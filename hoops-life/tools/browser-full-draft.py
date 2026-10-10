from pathlib import Path
import re,time
from playwright.sync_api import sync_playwright
root=Path('/mnt/data/hoops-mutant-release')
html=(root/'index.html').read_text();scripts=[x for x in re.findall(r'<script src="([^"]+)"',html) if not x.startswith(('packs/','assets/'))]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1450,'height':900},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content('<html><head><style>'+(root/'css/style.css').read_text()+(root/'css/dna.css').read_text()+'</style></head><body><div id="app"></div></body></html>')
 for src in scripts:
  f=root/src
  if f.exists():page.add_script_tag(content=f.read_text())
 for year in range(1950,1960):page.add_script_tag(content=(root/f'data/history/seasons/{year}.js').read_text())
 page.evaluate('window.dispatchEvent(new Event("DOMContentLoaded"))');page.locator('button').filter(has_text='Skill Draft Career').first.click()
 page.locator('[data-go]').click();page.evaluate('HL.Legends.wildcard=async()=>null;const orig=HL.RNG.pick;HL.RNG.pick=function(arr){return arr.includes(1950)?1950:orig(arr)}')
 t=time.monotonic()
 for i in range(23):
  print("SPIN",i+1,flush=True)
  page.locator('[data-spin]').click(timeout=6000)
  page.wait_for_selector('.hand .gcard',state='attached',timeout=6000)
  page.locator('.hand .gcard').first.dispatch_event('click')
  if page.locator('[data-dna-dismiss]').count():page.locator('[data-dna-dismiss]').click()
  if errors:print('ERROR after',i+1,errors[:2]);break
 else:
  print('FULL DRAFT done',round(time.monotonic()-t,2),'seconds', 'built',page.locator('[data-begin]').count(),'DNA effects',page.locator('.dna-effect').count())
 print('errors',errors[:10]);page.screenshot(path='/mnt/data/hoops-dna-complete-build.png');b.close()
