"""
Builds Hoops Life's historical database from Basketball-Reference CSVs
(https://github.com/sumitrodatta/bball-reference-datasets, "Data/" folder).

Usage:  python3 tools/build-history.py <csv_dir> <nba_ids.json>
Output: data/history/index.js and data/history/seasons/<year>.js

Every real player-season gets:
  - OVR from Box Plus/Minus (BPM), shrunk toward average for low minutes. Seasons before
    1974 have no BPM, so BPM is estimated from PER and WS/48 with a regression fitted on
    later seasons.
  - 21 attributes from the matching stats, as z-scores within that season (so eras compare
    fairly), then shifted together so the computed OVR (same formula as js/league/ratings.js)
    matches the target in the first-stage build; recalibrate-history.py then
    adjusts individual skills from available production and applies independent
    OVR computation without blindly inflating unrelated attributes.
  - Tendencies from the real shot diet and usage.
Season "YYYY" in the source = the season ending in YYYY. Hoops Life labels seasons by the
starting year, so source 2026 -> season 2025 (2025-26).
"""
import csv, json, math, os, sys, unicodedata
from collections import defaultdict

SRC = sys.argv[1]
NBA_IDS = json.load(open(sys.argv[2])) if len(sys.argv) > 2 else []
OUT = os.path.join(os.path.dirname(__file__), '..', 'data', 'history')
os.makedirs(os.path.join(OUT, 'seasons'), exist_ok=True)

def rd(name):
    with open(os.path.join(SRC, name), newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))

def num(x, d=None):
    try:
        if x in (None, '', 'NA'): return d
        return float(x)
    except ValueError:
        return d

def norm(n):
    n = unicodedata.normalize('NFKD', n).encode('ascii', 'ignore').decode().lower()
    return ''.join(c for c in n if c.isalnum())

nba_id_by_name = {}
for pid, name, active in NBA_IDS:
    k = norm(name)
    if k not in nba_id_by_name or active:
        nba_id_by_name[k] = pid

# ---------------- load ----------------
print('loading csvs…')
per_game = rd('Player_Per_Game.csv')
adv = {(r['season'], r['lg'], r['player_id'], r['team']): r for r in rd('Advanced.csv')}
p100 = {(r['season'], r['lg'], r['player_id'], r['team']): r for r in rd('Per_100_Poss.csv')}
p36 = {(r['season'], r['lg'], r['player_id'], r['team']): r for r in rd('Per_36_Minutes.csv')}
shoot = {(r['season'], r['lg'], r['player_id'], r['team']): r for r in rd('Player_Shooting.csv')}
pbp = {(r['season'], r['lg'], r['player_id'], r['team']): r for r in rd('Player_Play_By_Play.csv')}
career = {r['player_id']: r for r in rd('Player_Career_Info.csv')}
team_sum = rd('Team_Summaries.csv')
team_pg = {(r['season'], r['lg'], r['abbreviation']): r for r in rd('Team_Stats_Per_Game.csv')}
awards = rd('Player_Award_Shares.csv')
eos = rd('End_of_Season_Teams.csv')
allstar = rd('All-Star_Selections.csv')
draft = rd('Draft_Pick_History.csv')

COMBINED = {'TOT', '2TM', '3TM', '4TM', '5TM'}

# ---------------- group rows per player-season ----------------
ps = defaultdict(list)   # (season, lg, pid) -> rows in file order
for r in per_game:
    if r['lg'] not in ('NBA', 'BAA', 'ABA'): continue
    ps[(r['season'], r['lg'], r['player_id'])].append(r)

def main_row(rows):
    for r in rows:
        if r['team'] in COMBINED: return r
    return rows[0]

# ---------------- BPM estimate for pre-1974 ----------------
# Fit bpm ~ a*PER + b*WS48 + c on seasons 1980+ with >= 800 minutes.
xs, ys = [], []
for k, rows in ps.items():
    s = int(k[0])
    if s < 1980: continue
    r = main_row(rows)
    a = adv.get((r['season'], r['lg'], r['player_id'], r['team']))
    if not a: continue
    mp = num(a['mp'], 0)
    if mp < 800: continue
    per, ws48, bpm = num(a['per']), num(a['ws_48']), num(a['bpm'])
    if None in (per, ws48, bpm): continue
    xs.append((per, ws48)); ys.append(bpm)
n = len(xs)
# Least squares with 3 params (closed form via normal equations).
S = [[0] * 3 for _ in range(3)]; T = [0] * 3
for (p, w), y in zip(xs, ys):
    v = (p, w, 1.0)
    for i in range(3):
        T[i] += v[i] * y
        for j in range(3): S[i][j] += v[i] * v[j]
def solve(A, b):
    A = [row[:] + [b[i]] for i, row in enumerate(A)]
    for i in range(3):
        piv = max(range(i, 3), key=lambda r: abs(A[r][i])); A[i], A[piv] = A[piv], A[i]
        for r in range(3):
            if r != i:
                f = A[r][i] / A[i][i]
                for c in range(i, 4): A[r][c] -= f * A[i][c]
    return [A[i][3] / A[i][i] for i in range(3)]
CA, CB, CC = solve(S, T)
print(f'BPM ~ {CA:.3f}*PER + {CB:.2f}*WS48 + {CC:.2f}  (n={n})')

# Reference impact distribution (qualified players, 1980+): every season is mapped onto it so that
# being the best player of 1965 rates like being the best player of 2026.
ref = [y for (p, w), y in zip(xs, ys)]
REF_MU = sum(ref) / len(ref)
REF_SD = math.sqrt(sum((y - REF_MU) ** 2 for y in ref) / len(ref))
print(f'reference BPM distribution: mean {REF_MU:.2f} sd {REF_SD:.2f}')

def phi_inv(p):
    # Acklam's inverse normal approximation
    p = min(max(p, 1e-6), 1 - 1e-6)
    a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00]
    b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01]
    c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00]
    d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00]
    pl, ph = 0.02425, 1 - 0.02425
    if p < pl:
        q = math.sqrt(-2 * math.log(p)); return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)
    if p > ph:
        q = math.sqrt(-2 * math.log(1 - p)); return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)
    q = p - 0.5; r = q * q
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q / (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1)

# ---------------- OVR formula (must match js/league/ratings.js) ----------------
ATTRS = ['close', 'mid', 'three', 'ft', 'layup', 'dunk', 'post', 'handle', 'pass', 'iq', 'perD', 'intD', 'steal', 'block', 'oreb', 'dreb', 'speed', 'vert', 'str', 'stam', 'dur']
W = {
  'PG': dict(close=1, mid=3, three=4, ft=1, layup=3, dunk=.5, post=.2, handle=4, pass_=4, iq=3, perD=3, intD=.5, steal=2, block=.3, oreb=.3, dreb=1, speed=3, vert=1, str=.5, stam=1),
  'SG': dict(close=1, mid=3, three=4, ft=1, layup=3, dunk=1, post=.3, handle=3, pass_=2, iq=3, perD=3, intD=.5, steal=2, block=.5, oreb=.5, dreb=1, speed=3, vert=1.5, str=.7, stam=1),
  'SF': dict(close=1.5, mid=3, three=3, ft=1, layup=3, dunk=2, post=1, handle=2, pass_=2, iq=3, perD=3, intD=1.5, steal=1.5, block=1, oreb=1, dreb=2, speed=2, vert=2, str=1.5, stam=1),
  'PF': dict(close=3, mid=2, three=2, ft=1, layup=2.5, dunk=2.5, post=2, handle=1, pass_=1.5, iq=3, perD=2, intD=3, steal=1, block=2, oreb=2, dreb=3, speed=1.5, vert=2, str=2.5, stam=1),
  'C':  dict(close=4, mid=1.5, three=1.5, ft=.8, layup=2, dunk=3, post=2.5, handle=.5, pass_=1.5, iq=3, perD=1, intD=4, steal=.5, block=3.5, oreb=3, dreb=4, speed=1, vert=2, str=3, stam=1),
}
def compute_ovr(a, pos):
    w = W.get(pos, W['SF'])
    s = ws = 0
    for k, v in w.items():
        key = 'pass' if k == 'pass_' else k
        s += a[key] * v; ws += v
    avg = s / ws
    top = sorted([a[k] for k in ATTRS if k not in ('dur', 'stam')], reverse=True)[:6]
    raw = avg * 0.45 + (sum(top) / 6) * 0.55
    return round(max(25, min(99, 40 + (raw - 52) * 1.5)))

def ovr_from_bpm(bpm):
    if bpm >= 3: return 82.3 + (bpm - 3) * 1.92
    return 76 + bpm * 2.1

def main_pos(pos):
    p = (pos or 'SF').split('-')[0].strip()
    return p if p in W else {'G': 'SG', 'F': 'SF', 'GF': 'SG', 'FC': 'PF'}.get(p, 'SF')

# ---------------- per-season processing ----------------
by_season = defaultdict(list)
for (season, lg, pid), rows in ps.items():
    by_season[(season, lg)].append((pid, rows))

def zscorer(values, weights=None):
    vals = [v for v in values if v is not None]
    if len(vals) < 5: return lambda v: 0.0
    m = sum(vals) / len(vals)
    sd = math.sqrt(sum((v - m) ** 2 for v in vals) / len(vals)) or 1
    return lambda v: 0.0 if v is None else max(-3, min(3, (v - m) / sd))

def shrink(pct, att, lg_pct, prior):
    if pct is None or att is None: return lg_pct
    return (pct * att + lg_pct * prior) / (att + prior)

index_players = {}
season_list = []
league_profiles = {}

for (season, lg), entries in sorted(by_season.items(), key=lambda x: (int(x[0][0]), x[0][1])):
    s = int(season)
    rec = []
    for pid, rows in entries:
        r = main_row(rows)
        key = (r['season'], r['lg'], pid, r['team'])
        a, h, x36, sh, pb = adv.get(key, {}), p100.get(key, {}), p36.get(key, {}), shoot.get(key, {}), pbp.get(key, {})
        c = career.get(pid, {})
        g = num(r['g'], 0); mpg = num(r['mp_per_game'], 0) or 0
        mp = num(a.get('mp'), g * mpg) or g * mpg
        if g <= 0: continue
        rec.append(dict(pid=pid, rows=rows, r=r, a=a, h=h, x36=x36, sh=sh, pb=pb, c=c, g=g, mpg=mpg, mp=mp))
    if not rec: continue
    qual = [x for x in rec if x['mp'] >= 400] or rec

    # league reference values (minutes-weighted)
    def lgavg(fn):
        num_, den = 0, 0
        for x in rec:
            v = fn(x)
            if v is not None: num_ += v * x['mp']; den += x['mp']
        return num_ / den if den else None
    lg3 = lgavg(lambda x: num(x['r']['x3p_percent'])) or 0.33
    lgft = lgavg(lambda x: num(x['r']['ft_percent'])) or 0.75
    lg2 = lgavg(lambda x: num(x['r']['x2p_percent'])) or 0.47

    # raw skill measures
    for x in rec:
        r, a, h, x36, sh, pb, c = x['r'], x['a'], x['h'], x['x36'], x['sh'], x['pb'], x['c']
        ht = num(c.get('ht_in_in'), 78); wt = num(c.get('wt'), 215)
        x['ht'], x['wt'] = ht, wt
        fga = num(r['fga_per_game'], 0) * x['g']
        tpa = num(r['x3pa_per_game'], 0) * x['g']
        fta = num(r['fta_per_game'], 0) * x['g']
        m = {}
        m['ft'] = shrink(num(r['ft_percent']), fta, lgft, 60)
        m['three_pct'] = shrink(num(r['x3p_percent']), tpa, lg3 - 0.03, 120) if s >= 1980 else None
        m['three_vol'] = (tpa / max(1, x['mp']) * 36) if s >= 1980 else None
        m['two'] = shrink(num(r['x2p_percent']), fga - tpa, lg2, 80)
        if sh:
            rim_pct = num(sh.get('fg_percent_from_x0_3_range')); rim_sh = num(sh.get('percent_fga_from_x0_3_range'), 0) or 0
            sht_pct = num(sh.get('fg_percent_from_x3_10_range')); sht_sh = num(sh.get('percent_fga_from_x3_10_range'), 0) or 0
            m10_pct = num(sh.get('fg_percent_from_x10_16_range')); m10_sh = num(sh.get('percent_fga_from_x10_16_range'), 0) or 0
            m16_pct = num(sh.get('fg_percent_from_x16_3p_range')); m16_sh = num(sh.get('percent_fga_from_x16_3p_range'), 0) or 0
            m['rim'] = shrink(rim_pct, rim_sh * fga, 0.62, 50)
            m['short'] = shrink(sht_pct, sht_sh * fga, 0.40, 40)
            mid_att = (m10_sh + m16_sh) * fga
            mid_pct = ((m10_pct or 0) * m10_sh + (m16_pct or 0) * m16_sh) / (m10_sh + m16_sh) if (m10_sh + m16_sh) > 0 else None
            m['midpct'] = shrink(mid_pct, mid_att, 0.40, 60)
            m['dunk_rate'] = num(sh.get('percent_dunks_of_fga'), 0)
            m['share_rim'], m['share_short'], m['share_mid'] = rim_sh, sht_sh, m10_sh + m16_sh
            m['share_3'] = num(sh.get('percent_fga_from_x3p_range'), 0) or 0
        x['m'] = m
        x['ast'] = num(a.get('ast_percent')) if a.get('ast_percent') not in (None, '', 'NA') else (num(x36.get('ast_per_36_min'), 0) * 3.2 if x36 else None)
        x['tov'] = num(a.get('tov_percent'))
        x['usg'] = num(a.get('usg_percent'))
        if x['usg'] is None:
            fga36 = num(x36.get('fga_per_36_min')) if x36 else None
            fta36 = num(x36.get('fta_per_36_min')) if x36 else None
            x['shots36'] = (fga36 + 0.44 * (fta36 or 0)) if fga36 is not None else None
        x['stl'] = num(a.get('stl_percent')); x['blk'] = num(a.get('blk_percent'))
        x['orb'] = num(a.get('orb_percent')); x['drb'] = num(a.get('drb_percent')); x['trb'] = num(a.get('trb_percent'))
        if x['trb'] is None and x36: x['trb'] = num(x36.get('trb_per_36_min'), 0) * 1.6
        x['dbpm'] = num(a.get('dbpm')); x['dws48'] = (num(a.get('dws'), 0) / max(1, x['mp']) * 48) if a.get('dws') not in (None, '', 'NA') else None
        x['ftr'] = num(a.get('f_tr'))
        x['pf36'] = num(x36.get('pf_per_36_min')) if x36 else None
        # Impact: BPM blended with a PER/WS48 estimate (smooths single-metric quirks).
        bpm = num(a.get('bpm'))
        per, ws48 = num(a.get('per')), num(a.get('ws_48'))
        est = (CA * per + CB * ws48 + CC) if (per is not None and ws48 is not None) else None
        if bpm is None: bpm = est if est is not None else -2.0
        elif est is not None: bpm = bpm * 0.6 + est * 0.4
        # Shrink toward replacement level for small samples.
        x['bpm'] = (bpm * x['mp'] + (-2.5) * 600) / (x['mp'] + 600)

    # Standardize this season's impact onto the reference distribution (qualified = 800+ min).
    q800 = [x['bpm'] for x in rec if x['mp'] >= 800] or [x['bpm'] for x in qual]
    smu = sum(q800) / len(q800)
    ssd = math.sqrt(sum((v - smu) ** 2 for v in q800) / len(q800)) or 1
    for x in rec:
        x['bpm'] = REF_MU + (x['bpm'] - smu) / ssd * REF_SD

    # Before usage % existed (pre-1978): usage relative to the league's shot volume that season.
    lg_shots = [x['shots36'] for x in qual if x.get('shots36') is not None]
    if lg_shots:
        avg_shots = sum(lg_shots) / len(lg_shots)
        for x in rec:
            if x['usg'] is None and x.get('shots36') is not None:
                x['usg'] = 20.0 * x['shots36'] / avg_shots

    def Z(fn):
        return zscorer([fn(x) for x in qual])
    zs = {
        'ft': Z(lambda x: x['m']['ft']), 'tp': Z(lambda x: x['m']['three_pct']), 'tv': Z(lambda x: x['m']['three_vol']),
        'two': Z(lambda x: x['m']['two']), 'rim': Z(lambda x: x['m'].get('rim')), 'short': Z(lambda x: x['m'].get('short')),
        'mid': Z(lambda x: x['m'].get('midpct')), 'dunk': Z(lambda x: x['m'].get('dunk_rate')),
        'ast': Z(lambda x: x['ast']), 'tov': Z(lambda x: x['tov']), 'usg': Z(lambda x: x['usg']),
        'stl': Z(lambda x: x['stl']), 'blk': Z(lambda x: x['blk']), 'orb': Z(lambda x: x['orb']), 'drb': Z(lambda x: x['drb']), 'trb': Z(lambda x: x['trb']),
        'dbpm': Z(lambda x: x['dbpm']), 'dws': Z(lambda x: x['dws48']), 'bpm': Z(lambda x: x['bpm']),
        'ht': Z(lambda x: x['ht']), 'bmi': Z(lambda x: x['wt'] / (x['ht'] ** 2)), 'mpg': Z(lambda x: x['mpg']), 'ftr': Z(lambda x: x['ftr']), 'pf': Z(lambda x: x['pf36']),
    }
    teams_g = {}
    for t in team_sum:
        if t['season'] == season and t['lg'] == lg:
            teams_g[t['abbreviation']] = (num(t['w'], 0) or 0) + (num(t['l'], 0) or 0)
    season_games = max(teams_g.values()) if teams_g else 82

    out_players = []
    for x in rec:
        m = x['m']
        g = lambda k, v: zs[k](v)
        pos = main_pos(x['r']['pos'])
        guard = pos in ('PG', 'SG'); big = pos in ('PF', 'C')
        zht = zs['ht'](x['ht'])
        has3 = s >= 1980
        has_def = x['stl'] is not None
        zft = g('ft', m['ft'])
        ztwo = g('two', m['two'])
        zrim = g('rim', m.get('rim')) if 'rim' in m else ztwo * 0.8 + zht * 0.2
        zshort = g('short', m.get('short')) if 'short' in m else ztwo * 0.7
        zmid = g('mid', m.get('midpct')) if 'midpct' in m else zft * 0.5 + ztwo * 0.3
        zusg = g('usg', x['usg']); zast = g('ast', x['ast']); ztov = g('tov', x['tov'])
        zstl = g('stl', x['stl']) if has_def else (0.4 if guard else -0.2) + g('dws', x['dws48']) * 0.3
        zblk = g('blk', x['blk']) if has_def else zht * 0.8 + g('trb', x['trb']) * 0.3
        zorb = g('orb', x['orb']) if x['orb'] is not None else g('trb', x['trb']) * 0.8 + zht * 0.2
        zdrb = g('drb', x['drb']) if x['drb'] is not None else g('trb', x['trb'])
        zdef = g('dbpm', x['dbpm']) if x['dbpm'] is not None else g('dws', x['dws48'])
        zdunk = g('dunk', m.get('dunk_rate')) if 'dunk_rate' in m else zht * 0.5 + zorb * 0.3 + zblk * 0.2
        zbpm = zs['bpm'](x['bpm'])
        sk = {}
        if has3:
            sk['three'] = g('tp', m['three_pct']) * 0.65 + g('tv', m['three_vol']) * 0.45 - 0.1
        else:
            sk['three'] = zft * 0.55 + zmid * 0.25 - 0.9   # no 3-point line: shooting touch only
        sk['mid'] = zmid * 0.55 + zft * 0.25 + zusg * 0.2
        sk['ft'] = zft
        sk['close'] = zrim * 0.45 + zshort * 0.3 + zht * 0.25
        sk['layup'] = zrim * 0.55 + g('ftr', x['ftr']) * 0.2 + (0.3 if not big else -0.1) + zusg * 0.15
        sk['dunk'] = zdunk * 0.7 + zht * 0.2 + zorb * 0.1
        sk['post'] = zht * 0.45 + zshort * 0.25 + zusg * 0.2 + zs['bmi'](x['wt'] / x['ht'] ** 2) * 0.15 - (0.4 if guard else 0)
        sk['handle'] = zast * 0.35 + zusg * 0.35 - ztov * 0.15 + (0.55 if guard else -0.35 if big else 0) - zht * 0.15
        sk['pass'] = zast * 0.85 - ztov * 0.1 + zbpm * 0.15
        sk['iq'] = zbpm * 0.45 + zast * 0.15 - ztov * 0.15 - g('pf', x['pf36']) * 0.15 + zdef * 0.15
        sk['perD'] = zstl * 0.35 + zdef * 0.4 + (0.25 if not big else -0.3) - zht * 0.05
        sk['intD'] = zblk * 0.4 + zdef * 0.25 + zdrb * 0.15 + zht * 0.25
        sk['steal'] = zstl
        sk['block'] = zblk
        sk['oreb'] = zorb
        sk['dreb'] = zdrb
        sk['speed'] = -zht * 0.6 + zstl * 0.2 + (0.35 if guard else -0.3 if big else 0) - max(0, num(x['r']['age'], 27) - 30) * 0.08
        sk['vert'] = zdunk * 0.35 + zblk * 0.25 + zorb * 0.2 - zht * 0.15 - max(0, num(x['r']['age'], 27) - 30) * 0.08
        sk['str'] = zs['bmi'](x['wt'] / x['ht'] ** 2) * 0.55 + zht * 0.25 + zorb * 0.2
        sk['stam'] = zs['mpg'](x['mpg']) * 0.9
        attrs = {k: 62 + v * 12 for k, v in sk.items()}
        attrs['dur'] = 50 + min(1.0, x['g'] / max(1, season_games)) * 45
        # Shift so computed OVR matches the BPM-based target.
        target = max(40, min(99, round(ovr_from_bpm(x['bpm']))))
        shift = 0
        for _ in range(14):
            cur = {k: round(max(25, min(99, attrs[k] + (0 if k == 'dur' else shift * (0.4 if k == 'stam' else 1))))) for k in ATTRS}
            d = target - compute_ovr(cur, pos)
            if d == 0: break
            shift += d * 0.9
        final = cur
        # Tendencies from the real shot diet and role.
        usg = x['usg'] if x['usg'] is not None else 18
        tend = {}
        tend['usage'] = round(max(5, min(100, (usg - 10) * 3.4)))
        if 'share_rim' in m:
            tend['three'] = round(m['share_3'] * 100)
            tend['mid'] = round(m['share_mid'] * 100)
            tend['drive'] = round(m['share_rim'] * 100 * (0.6 if big else 1.0))
            tend['post'] = round(m['share_short'] * 100 * (1.3 if big else 0.5) + (m['share_rim'] * 40 if big else 0))
        else:
            ar = num(x['a'].get('x3p_ar'))
            share3 = ar if (ar is not None and has3) else 0
            tend['three'] = round(share3 * 100)
            rest = 100 - tend['three']
            rimfrac = max(0.25, min(0.75, 0.45 + zht * 0.08 + (g('ftr', x['ftr']) * 0.05)))
            tend['drive'] = round(rest * rimfrac * (0.6 if big else 1.0))
            tend['post'] = round(rest * rimfrac * (0.7 if big else 0.15))
            tend['mid'] = round(rest * (1 - rimfrac))
        ast = x['ast'] if x['ast'] is not None else 12
        tend['passFirst'] = round(max(5, min(95, 20 + (ast - usg * 0.6) * 1.6)))
        tend['gamble'] = round(max(5, min(95, 50 + zstl * 15)))
        tend['crash'] = round(max(5, min(95, 40 + zorb * 18)))
        tend['effort'] = 75
        tend['foulAggr'] = round(max(5, min(95, 50 + g('pf', x['pf36']) * 15)))
        # How often he gets to the line (free throw attempts per FGA, shrunk for small samples).
        ftr = x['ftr'] if x['ftr'] is not None else 0.25
        fga_tot = num(x['r']['fga_per_game'], 0) * x['g']
        ftr = (ftr * fga_tot + 0.25 * 150) / (fga_tot + 150)
        tend['drawFoul'] = round(max(5, min(99, ftr * 150)))

        # Team stints for rosters (games per team, in order).
        stints = [(rw['team'], int(num(rw['g'], 0))) for rw in x['rows'] if rw['team'] not in COMBINED]
        r = x['r']
        c = x['c']
        age = int(num(r['age'], 0) or 0)
        out_players.append([
            x['pid'], [list(st) for st in stints], age, int(x['g']), int(num(r['gs'], 0) or 0), round(x['mpg'], 1),
            num(r['pts_per_game'], 0), num(r['trb_per_game'], 0), num(r['ast_per_game'], 0), num(r['stl_per_game'], 0) or 0, num(r['blk_per_game'], 0) or 0,
            num(r['fg_percent'], 0) or 0, num(r['x3p_percent'], 0) or 0, num(r['ft_percent'], 0) or 0,
            target, round(x['bpm'], 1), pos,
            ''.join(f'{final[k]:02d}' if final[k] < 100 else '99' for k in ATTRS),
            ''.join(f'{min(99, tend[k]):02d}' for k in ['usage', 'three', 'mid', 'drive', 'post', 'passFirst', 'gamble', 'crash', 'foulAggr', 'drawFoul']),
        ])
        if x['pid'] not in index_players:
            nm = c.get('player') or r['player']
            bd = c.get('birth_date') or ''
            index_players[x['pid']] = [nm, nba_id_by_name.get(norm(nm)), c.get('pos') or r['pos'], int(num(c.get('ht_in_in'), 78)), int(num(c.get('wt'), 215)),
                                       int(bd[:4]) if bd[:4].isdigit() else None, 1 if c.get('hof') == 'TRUE' else 0, (c.get('colleges') or '').replace('NA', '')]

    hl_season = s - 1  # label by starting year
    teams = []
    for t in team_sum:
        if t['season'] == season and t['lg'] == lg and t['abbreviation'] != 'NA' and t['team'] != 'League Average':
            tp = team_pg.get((season, lg, t['abbreviation']), {})
            teams.append([t['abbreviation'], t['team'], int(num(t['w'], 0) or 0), int(num(t['l'], 0) or 0), num(t['srs'], 0), num(t['o_rtg'], 0), num(t['d_rtg'], 0), num(t['pace'], 0), 1 if t['playoffs'] == 'TRUE' else 0, t.get('arena') or ''])
    la = next((t for t in team_sum if t['season'] == season and t['lg'] == lg and t['team'] == 'League Average'), None)
    prof = None
    if la:
        prof = dict(pace=num(la['pace']), ortg=num(la['o_rtg']), efg=num(la['e_fg_percent']), tov=num(la['tov_percent']), orb=num(la['orb_percent']), ftr=num(la['ft_fga']), tpar=num(la['x3p_ar']), ts=num(la['ts_percent']))
    key = f'{hl_season}' if lg == 'NBA' or lg == 'BAA' else f'{hl_season}-{lg}'
    league_profiles[key] = prof
    season_list.append(key)
    with open(os.path.join(OUT, 'seasons', f'{key}.js'), 'w') as f:
        f.write('window.HL = window.HL || {}; HL.HISTORY_SEASONS = HL.HISTORY_SEASONS || {};\n')
        f.write(f'HL.HISTORY_SEASONS[{json.dumps(key)}] = ' + json.dumps({'lg': lg, 'teams': teams, 'profile': prof, 'players': out_players}, separators=(',', ':')) + ';\n')

# ---------------- awards & history ----------------
aw = defaultdict(list)
for a in awards:
    if a['winner'] == 'TRUE':
        aw[a['player_id']].append([int(a['season']) - 1, a['award']])
for e in eos:
    if e['lg'] in ('NBA', 'BAA'):
        aw[e['player_id']].append([int(e['season']) - 1, f"{e['type']} {e['number_tm']}"])
for a in allstar:
    if a['lg'] == 'NBA':
        aw[a['player_id']].append([int(a['season']) - 1, 'All-Star'])
drafts = {}
for d in draft:
    if d['player_id'] and d['lg'] in ('NBA', 'BAA'):
        drafts.setdefault(d['player_id'], [int(d['season']), int(num(d['overall_pick'], 0) or 0), d['tm'], d['college'] if d['college'] != 'NA' else ''])

# ---------------- legacy (all-time ranking) ----------------
# Champions by season-ending year (not in the dataset). 2026 is left out until the Finals are in the data.
CHAMPS = {1947: 'PHW', 1948: 'BLB', 1949: 'MNL', 1950: 'MNL', 1951: 'ROC', 1952: 'MNL', 1953: 'MNL', 1954: 'MNL', 1955: 'SYR', 1956: 'PHW', 1957: 'BOS', 1958: 'STL',
          **{y: 'BOS' for y in range(1959, 1967)}, 1967: 'PHI', 1968: 'BOS', 1969: 'BOS', 1970: 'NYK', 1971: 'MIL', 1972: 'LAL', 1973: 'NYK', 1974: 'BOS', 1975: 'GSW',
          1976: 'BOS', 1977: 'POR', 1978: 'WSB', 1979: 'SEA', 1980: 'LAL', 1981: 'BOS', 1982: 'LAL', 1983: 'PHI', 1984: 'BOS', 1985: 'LAL', 1986: 'BOS', 1987: 'LAL',
          1988: 'LAL', 1989: 'DET', 1990: 'DET', 1991: 'CHI', 1992: 'CHI', 1993: 'CHI', 1994: 'HOU', 1995: 'HOU', 1996: 'CHI', 1997: 'CHI', 1998: 'CHI', 1999: 'SAS',
          2000: 'LAL', 2001: 'LAL', 2002: 'LAL', 2003: 'SAS', 2004: 'DET', 2005: 'SAS', 2006: 'MIA', 2007: 'SAS', 2008: 'BOS', 2009: 'LAL', 2010: 'LAL', 2011: 'DAL',
          2012: 'MIA', 2013: 'MIA', 2014: 'SAS', 2015: 'GSW', 2016: 'CLE', 2017: 'GSW', 2018: 'GSW', 2019: 'TOR', 2020: 'LAL', 2021: 'MIL', 2022: 'GSW', 2023: 'DEN',
          2024: 'BOS', 2025: 'OKC'}
LEGACY_W = {'MVP': 10, 'Ring': 4, 'All-NBA 1st': 4, 'All-NBA 2nd': 2.5, 'All-NBA 3rd': 1.5, 'All-Star': 1, 'DPOY': 2, 'ROY': 0.5}
career = defaultdict(lambda: {'g': 0, 'pts': 0, 'trb': 0, 'ast': 0, 'val': 0.0, 'peak': 0, 'rings': 0, 'seasons': 0, 'first': 9999, 'last': 0})
for (season, lg, pid), rows in ps.items():
    if lg not in ('NBA', 'BAA'): continue
    r = main_row(rows)
    s_end = int(season)
    g = num(r['g'], 0) or 0
    c = career[pid]
    c['g'] += g; c['pts'] += (num(r['pts_per_game'], 0) or 0) * g; c['trb'] += (num(r['trb_per_game'], 0) or 0) * g; c['ast'] += (num(r['ast_per_game'], 0) or 0) * g
    c['seasons'] += 1; c['first'] = min(c['first'], s_end - 1); c['last'] = max(c['last'], s_end - 1)
    last_team = [rw['team'] for rw in rows if rw['team'] not in COMBINED]
    if CHAMPS.get(s_end) and last_team and last_team[-1] == CHAMPS[s_end] and g >= 10: c['rings'] += 1
# Season impact from the rated season files (OVR per season).
for k in season_list:
    if '-' in k: continue
    data = json.loads(open(os.path.join(OUT, 'seasons', f'{k}.js')).read().split('] = ', 1)[1].rstrip().rstrip(';'))
    games = max((t[2] + t[3] for t in data['teams']), default=82) or 82
    for p in data['players']:
        pid, g, ovr = p[0], p[3], p[14]
        c = career[pid]
        c['val'] += max(0, ovr - 72) ** 1.6 / 10 * min(1, g / games)
        c['peak'] = max(c['peak'], ovr)
legacy = {}
for pid, c in career.items():
    a = aw.get(pid, [])
    cnt = lambda name: sum(1 for x in a if x[1] == name)
    score = c['val'] + LEGACY_W['MVP'] * cnt('nba mvp') + LEGACY_W['Ring'] * c['rings'] + LEGACY_W['All-NBA 1st'] * cnt('All-NBA 1st') + LEGACY_W['All-NBA 2nd'] * cnt('All-NBA 2nd') \
        + LEGACY_W['All-NBA 3rd'] * cnt('All-NBA 3rd') + LEGACY_W['All-Star'] * cnt('All-Star') + LEGACY_W['DPOY'] * cnt('nba dpoy') + LEGACY_W['ROY'] * cnt('nba roy')
    legacy[pid] = [round(score, 1), c['peak'], c['rings'], cnt('nba mvp'), cnt('All-Star'), int(c['g']), int(c['pts']), int(c['trb']), int(c['ast']), c['first'], c['last']]
ranked = sorted(legacy.items(), key=lambda kv: -kv[1][0])
print('All-time top 20 by legacy:', ', '.join(f"{index_players[p][0] if p in index_players else p} {v[0]}" for p, v in ranked[:20]))

with open(os.path.join(OUT, 'index.js'), 'w') as f:
    f.write('// Generated by tools/build-history.py from Basketball-Reference data. Do not edit by hand.\n')
    f.write('window.HL = window.HL || {};\n')
    f.write('HL.HISTORY = ' + json.dumps({
        'attrs': ATTRS, 'tends': ['usage', 'three', 'mid', 'drive', 'post', 'passFirst', 'gamble', 'crash', 'foulAggr', 'drawFoul'],
        'playerFields': ['name', 'nbaId', 'pos', 'height', 'weight', 'born', 'hof', 'college'],
        'seasonFields': ['pid', 'stints', 'age', 'g', 'gs', 'mpg', 'pts', 'trb', 'ast', 'stl', 'blk', 'fgp', 'tpp', 'ftp', 'ovr', 'bpm', 'pos', 'attrs', 'tend'],
        'seasons': season_list, 'profiles': league_profiles, 'players': index_players, 'awards': aw, 'drafts': drafts,
        'legacyFields': ['score', 'peak', 'rings', 'mvps', 'allstars', 'g', 'pts', 'trb', 'ast', 'first', 'last'],
        'legacy': {p: v for p, v in ranked[:1500]}, 'legacyWeights': LEGACY_W, 'champions': {k - 1: v for k, v in CHAMPS.items()},
    }, separators=(',', ':')) + ';\n')
total = sum(os.path.getsize(os.path.join(OUT, 'seasons', p)) for p in os.listdir(os.path.join(OUT, 'seasons')))
print(f'{len(season_list)} seasons, {len(index_players)} players, seasons dir {total/1e6:.1f} MB, index {os.path.getsize(os.path.join(OUT, "index.js"))/1e6:.2f} MB')
# Explicit second pass. This also runs against already generated data without source CSVs.
import subprocess
subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'recalibrate-history.py')], check=True)