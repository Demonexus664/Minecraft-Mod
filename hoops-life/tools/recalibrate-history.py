#!/usr/bin/env python3
"""Recompute historical ratings from archived season production, shot diet and player bio.

Runs against the committed generated historical DB, no external credentials required.
Changes every NBA/BAA/ABA player-season with the same documented rules. The available
packed dataset has FG%, 3P%, FT%, minutes, points, boards, assists, steals, blocks,
usage/shot tendencies, height, weight, era, and source-era estimates. Historical
speed, vertical and defense are *estimates*, not measured combine numbers.

Usage: python3 tools/recalibrate-history.py
Run after build-history.py to reproduce post-processing when source CSVs are present.
"""
from pathlib import Path
import json, math

MODEL_REV = 2
ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'data/history'
index_txt = (BASE/'index.js').read_text()
H = json.loads(index_txt.split('HL.HISTORY = ',1)[1].rsplit(';',1)[0])
keys=H['attrs']; tk=H['tends']; ix={k:i for i,k in enumerate(keys)}

# Hand-researched physical scouting notes only where box scores cannot measure
# peak explosiveness or mobility (base observations applied with age adjustment).
# Not used to force OVR. Other players use identical stat/bio-based rules.
SCOUTED = {
  'Wilt Chamberlain': {'speed':94, 'vert':98, 'str':99, 'dunk':97},
  "Shaquille O'Neal": {'speed':84, 'vert':94, 'str':99, 'dunk':99},
  'Michael Jordan': {'speed':96, 'vert':98, 'dunk':95},
  'LeBron James': {'speed':95, 'vert':97, 'str':92, 'dunk':96},
  'Giannis Antetokounmpo': {'speed':93, 'vert':97, 'str':94, 'dunk':97},
  'Russell Westbrook': {'speed':96, 'vert':98, 'dunk':93},
  'Derrick Rose': {'speed':97, 'vert':97, 'dunk':91},
  'Vince Carter': {'speed':90, 'vert':99, 'dunk':99},
  'Dominique Wilkins': {'speed':90, 'vert':98, 'dunk':97},
  'Julius Erving': {'speed':90, 'vert':97, 'dunk':97},
  'Kobe Bryant': {'speed':90, 'vert':94, 'dunk':91},
  'David Robinson': {'speed':88, 'vert':95, 'str':91, 'dunk':91},
  'Hakeem Olajuwon': {'speed':88, 'vert':91, 'dunk':90},
  'Dwight Howard': {'speed':87, 'vert':97, 'str':95, 'dunk':98},
  'Zion Williamson': {'speed':88, 'vert':97, 'str':98, 'dunk':98},
  'Anthony Edwards': {'speed':94, 'vert':97, 'dunk':97},
  'Ja Morant': {'speed':95, 'vert':96, 'dunk':90},
  'Victor Wembanyama': {'speed':82, 'vert':87, 'dunk':87},
}

WEIGHTS={
'PG':[1,3,4,1,3,.5,.2,4,4,3,3,.5,2,.3,.3,1,3,1,.5,1],
'SG':[1,3,4,1,3,1,.3,3,2,3,3,.5,2,.5,.5,1,3,1.5,.7,1],
'SF':[1.5,3,3,1,3,2,1,2,2,3,3,1.5,1.5,1,1,2,2,2,1.5,1],
'PF':[3,2,2,1,2.5,2.5,2,1,1.5,3,2,3,1,2,2,3,1.5,2,2.5,1],
'C':[4,1.5,1.5,.8,2,3,2.5,.5,1.5,3,1,4,.5,3.5,3,4,1,2,3,1]
}
def score(a,pos):
    w=WEIGHTS.get(pos,WEIGHTS['SF']); avg=sum(a[k]*wi for k,wi in zip(keys,w))/sum(w)
    top=sorted((v for k,v in a.items() if k not in ('dur','stam')), reverse=True)[:6]
    return max(25,min(99,round(40+(avg*.45+sum(top)/6*.55-52)*1.5)))
def clamp(x,lo=25,hi=99):return max(lo,min(hi,round(x)))
def transform(row,year):
    pid,_,age,g,gs,mpg,ppg,rpg,apg,stl,blk,fgp,tpp,ftp,ovr,bpm,pos,pack,ten=row
    bio=H['players'][pid];name=bio[0];height=bio[3];weight=bio[4]
    a=dict(zip(keys,[int(pack[i*2:i*2+2]) for i in range(len(keys))])); t=dict(zip(tk,[int(ten[i*2:i*2+2]) for i in range(len(tk))]))
    # Reconstruct per-36 shooting opportunity from scoring, minutes and 3PA shot diet.
    # Explicit 3-point sample gate prevents inflated 3PT for occasional shooters.
    fga36=ppg/max(.7, 1.30 if fgp>=.4 else 1.15)*36/max(10,mpg)
    tpa36=fga36*t['three']/100
    if year < 1979:
        # No NBA 3-point line. Display a conservative *projection*, never 99.
        a['three']=clamp(29 + (ftp-.65)*55 + max(0,a['mid']-70)*.23,25,64)
    elif tpa36<.3:
        a['three']=clamp(30+(tpp-.25)*25,25,43)
    else:
        acc=max(.15,min(.5,tpp))
        rel=min(1, (tpa36*max(8,g)/82)/2.2)
        # Skill = accuracy AND creation volume, with a sample-size prior.
        # A low-volume 45% shooter is not automatically equal to Curry taking 12+.
        raw=55+(acc-.32)*125 + min(25,tpa36*3.0)
        if tpa36>=7 and acc>=.37:
            raw+=min(15,(tpa36-7)*2.3)
        a['three']=clamp(43+(raw-43)*rel,25,99)
    # Actual scoring efficiency, with a modest reliability prior for very short seasons.
    a['ft']=clamp(71+(ftp*100-71)*min(1,max(6,g)*max(10,mpg)/1300),25,99)
    # Physical skills cannot be inferred from impact BPM. Remove the historical model's
    # automatic large-height speed penalty. Keep mobility and explosion estimates distinct.
    a['speed']=clamp(a['speed']+(height-79)*2.0,28,97)
    a['str']=clamp(a['str']*.70+(weight/max(1,height)-2.5)*35*.30+12,25,99)
    # Observed volume and efficiency matters for individual rebounding and defense.
    per36=rpg*36/max(10,mpg)
    rebtgt=clamp(35+per36*3.6,30,98)
    oldavg=(a['oreb']+a['dreb'])/2
    for k in ('oreb','dreb'):
        a[k]=clamp(a[k]*.48+rebtgt*.52+(a[k]-oldavg)*.35,25,99)
    if year>=1973:
        for k,per in [('steal',stl*36/max(10,mpg)),('block',blk*36/max(10,mpg))]:
            target=clamp(38+per*19,28,97)
            a[k]=clamp(a[k]*.4+target*.6,25,99)
    # Extra scouting notes describe peak athletic tools, applied with age decline;
    # never increase unrelated shooting/defense ratings to make an OVR target.
    if name in SCOUTED:
        athletic_age=max(0,age-29)*1.35 + max(0,21-age)*.65
        for k,val in SCOUTED[name].items():
            target=clamp(val-athletic_age,25,99)
            a[k]=max(a[k],target) if age<=30 else clamp(a[k]*.25+target*.75)
    # Stamina/durability are distinct from peak speed/vertical.
    a['stam']=clamp(48+mpg*1.28,35,99)
    a['dur']=clamp(36+min(1,g/max(1,82 if year>=1967 else 78))*58,30,99)
    packed=''.join(f'{a[k]:02d}' for k in keys)
    return packed,score(a,pos)

files=sorted((BASE/'seasons').glob('*.js'))
changed=0;seasons=0;counts=[]
for path in files:
    raw=path.read_text()
    prefix,js=raw.rsplit(' = ',1)
    d=json.loads(js.strip().rstrip(';'))
    if d.get('_ratingsModel') == MODEL_REV:
        counts.append(len(d['players']))
        continue
    yr=int(path.stem.split('-')[0]);seasonchange=0
    for row in d['players']:
        new,ovr=transform(row,yr)
        if row[17]!=new or row[14]!=ovr:seasonchange+=1
        row[17]=new;row[14]=ovr
    if seasonchange:
        d['_ratingsModel'] = MODEL_REV
        path.write_text(prefix+' = '+json.dumps(d,separators=(',',':'),ensure_ascii=True)+';\n')
        changed+=seasonchange;seasons+=1
    counts.append(len(d['players']))
print(f'Recalibrated {changed} player-seasons in {seasons} season files ({sum(counts)} rows read).')