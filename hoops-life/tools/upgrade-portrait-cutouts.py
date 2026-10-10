"""Download larger original cutouts for reusable hero graphics; never edit the images."""
import hashlib
import json
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import Request, urlopen
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / 'docs/portrait-sources.json'
NAMES = {'Giannis Antetokounmpo', 'Luka Dončić', 'Anthony Edwards', 'Jayson Tatum',
         'Victor Wembanyama', 'Anthony Davis', 'Jaylen Brown', 'Devin Booker',
         'Kyrie Irving', 'Damian Lillard', 'Donovan Mitchell', 'Paolo Banchero',
         'Jalen Brunson', 'Karl-Anthony Towns', 'James Harden', 'Tyrese Haliburton'}

def upgrade(asset):
    if asset['size'] == '1040x760':
        return asset
    url = f"https://cdn.nba.com/headshots/nba/latest/1040x760/{asset['id']}.png"
    tmp = ROOT / (asset['src'] + '.download')
    try:
        with urlopen(Request(url, headers={'User-Agent': 'HoopsLifeAssetSetup/1.0'}), timeout=20) as response:
            blob = response.read()
        tmp.write_bytes(blob)
        with Image.open(tmp) as image:
            image.verify()
        with Image.open(tmp) as image:
            if image.size != (1040, 760):
                raise ValueError('Unexpected original dimensions')
        tmp.replace(ROOT / asset['src'])
        print('Upgraded', asset['name'], flush=True)
        return {**asset, 'size': '1040x760', 'url': url, 'bytes': len(blob),
                'sha256': hashlib.sha256(blob).hexdigest()}
    except Exception as error:
        tmp.unlink(missing_ok=True)
        print('Retained existing portrait:', asset['name'], str(error), flush=True)
        return asset

if __name__ == '__main__':
    manifest = json.loads(PATH.read_text())
    chosen = [a for a in manifest['portraits'] if a['name'] in NAMES]
    with ThreadPoolExecutor(max_workers=8) as pool:
        updates = {a['slug']: a for a in pool.map(upgrade, chosen)}
    manifest['portraits'] = [updates.get(a['slug'], a) for a in manifest['portraits']]
    PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
