const { chromium } = require('/home/wxf/.npm/_npx/31e32ef8478fbf80/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({headless:true,executablePath:'/home/wxf/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell',args:['--no-sandbox']});
  const page = await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:2});
  await page.goto('http://127.0.0.1:9010/ppt.html');
  await page.screenshot({path:'PPT_1105/preview.png',fullPage:true});
  const result = await page.evaluate(() => ({title:document.title, slide:document.querySelector('.slide').getBoundingClientRect().toJSON(), textCount:document.querySelectorAll('svg text').length, logoLoaded:document.querySelector('svg image').href.baseVal}));
  console.log(JSON.stringify(result));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
