from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1440,'height':900},reduced_motion='reduce')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('file:///mnt/data/hoops-mutant-release/index.html',wait_until='domcontentloaded',timeout=25000)
 page.wait_for_timeout(1500)
 print('title',page.title(),'buttons',page.locator('button').all_text_contents()[:20],'errors',errors[:6])
 page.screenshot(path='/mnt/data/hoops-browser-smoke.png',full_page=False)
 browser.close()
