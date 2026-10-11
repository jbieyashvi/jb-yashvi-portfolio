import { chromium } from 'playwright-core'
const browser = await chromium.launch({ channel: 'chrome' })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
const page = await ctx.newPage()
const base = 'https://jbieyashvi.github.io/iica-mobile-app-prototype/#'
for (const r of ['/event/ragas-of-dusk', '/events/e1', '/product/p1', '/learn/m1', '/artist/ananya-rao', '/collaborate/match/ananya-rao']) {
  await page.goto('about:blank'); await page.goto(base + r, { waitUntil: 'networkidle' }); await page.waitForTimeout(1500)
  await page.evaluate(() => { window.scrollTo(0, 0); document.querySelectorAll('*').forEach(e => { if (e.scrollTop) e.scrollTop = 0 }) }); await page.waitForTimeout(500)
  console.log(r, '=>', await page.evaluate(() => document.body.innerText.slice(0, 200).replace(/\s+/g, ' ')))
  await page.screenshot({ path: `capture/iica${r.replace(/\//g, '_')}.png` })
}
await browser.close()
