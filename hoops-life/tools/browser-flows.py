from pathlib import Path
import re
from playwright.sync_api import sync_playwright
root=Path('/mnt/data/hoops-mutant-release')
html=(root/'index.html').read_text()
scripts=[x for x in re.findall(r'<script src="([^"]+)"',html) if not x.startswith(('packs/','assets/'))]
seasons=sorted((root/'data/history/seasons').glob('*.js'))
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1500,'height':1050},reduced_motion='reduce')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content('<!DOCTYPE html><html><head><style>'+(root/'css/style.css').read_text()+(root/'css/dna.css').read_text()+'</style></head><body><div id="app"></div></body></html>')
 for src in scripts:
  f=root/src
  if f.exists():page.add_script_tag(content=f.read_text())
 for f in seasons:page.add_script_tag(content=f.read_text())
 page.evaluate('window.dispatchEvent(new Event("DOMContentLoaded"))')
 page.locator('button').filter(has_text='Skill Draft Career').first.click()
 page.locator('[data-go]').click()
 page.locator('[data-spin]').click()
 page.wait_for_selector('.hand .gcard',timeout=12000,state='attached')
 cards=page.locator('.hand .gcard').count()
 page.locator('.hand .gcard').first.dispatch_event('click')
 taken=page.locator('.tile.on').count()
 print('SKILL: dealt',cards,'picked',taken,'DNA previews',page.locator('.dna-effect').count(),'errors',errors[:6])
 page.screenshot(path='/mnt/data/hoops-dna-skill-ui.png')
 page.evaluate('HL.App.title()')
 page.locator('button').filter(has_text='82-0 Challenge').first.click()
 page.locator('[data-go]').click()
 page.evaluate('HL.Legends.rollDraftTeam=async()=>{let spec=HL.Legends.DRAFT_TEAMS[0];return {spec,hand:await HL.Legends.draftTeam(spec)}}')
 page.locator('[data-spin]').click()
 page.wait_for_selector('.hand .gcard',timeout=12000,state='attached')
 print('82: dealt',page.locator('.hand .gcard').count(),'special label',page.locator('body').inner_text().find('LEGENDARY TEAM ROLL')>=0,'errors',errors[:6])
 page.screenshot(path='/mnt/data/hoops-dna-820-ui.png')
 page.locator('.hand .gcard').first.dispatch_event('pointerdown',{'clientX':500,'clientY':700})
 page.evaluate('document.dispatchEvent(new PointerEvent("pointerup",{bubbles:true,clientX:500,clientY:700}))')
 page.locator('[data-drop="PG"]').first.click()
 print('82 after pick:',page.locator('.gcard.placed').count(),'DNA effects',page.locator('.dna-effect').count(),'errors',errors[:10])
 b.close()
