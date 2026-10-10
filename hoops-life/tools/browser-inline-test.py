from pathlib import Path
import re
from playwright.sync_api import sync_playwright
root=Path('/mnt/data/hoops-mutant-release')
html=(root/'index.html').read_text()
scripts=re.findall(r'<script src="([^"]+)"',html)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1440,'height':900},reduced_motion='reduce')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 css=(root/'css/style.css').read_text()+(root/'css/dna.css').read_text()
 page.set_content('<!doctype html><html><head><style>'+css+'</style></head><body><div id="app"></div></body></html>')
 for src in scripts:
  if src.startswith('packs/') or src.startswith('assets/') or src.startswith('data/history/seasons/') :continue
  f=root/src
  if f.exists():
   try:page.add_script_tag(content=f.read_text())
   except Exception as e:print('injectfail',src,str(e)[:200])
 page.evaluate("window.dispatchEvent(new Event('DOMContentLoaded'))")
 page.wait_for_timeout(500)
 print('loaded scripts',len(scripts),'buttons',page.locator('button').all_text_contents()[:25],'errors',errors[:10])
 if page.get_by_text('Skill Draft Career').count():
  page.get_by_text('Skill Draft Career').first.click()
  print('Skill page',page.locator('h2').all_text_contents()[:4], 'errors',errors[:10])
  if page.locator('[data-go]').count():
   page.locator('[data-go]').first.click()
   print('skill draft controls',page.locator('[data-spin]').count(),'DNA board',page.locator('.dna-showcase').count(),'errors',errors[:15])
 page.screenshot(path='/mnt/data/hoops-dna-browser-inline.png')
 b.close()
