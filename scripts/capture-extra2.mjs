import { chromium } from 'playwright-core'
const browser = await chromium.launch({ channel: 'chrome' })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
const page = await ctx.newPage()
await page.goto('https://jbieyashvi.github.io/iica-mobile-app-prototype/#/shop', { waitUntil: 'networkidle' }); await page.waitForTimeout(1500)
await page.getByText('The Art of Indian Songwriting').first().click(); await page.waitForTimeout(1500)
console.log(page.url(), await page.evaluate(() => document.body.innerText.slice(0, 250).replace(/\s+/g, ' ')))
await page.screenshot({ path: 'capture/iica_masterclass.png' })
await browser.close()
