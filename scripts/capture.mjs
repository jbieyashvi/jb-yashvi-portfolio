// Captures real screenshots of the live AI-built projects (raw PNGs into capture/).
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const OUT = 'capture'
mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const which = process.argv[2] || 'all'
const settle = (p, ms = 1200) => p.waitForTimeout(ms)

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < h; y += 500) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(120) }
  await page.evaluate(() => window.scrollTo(0, 0)); await settle(page, 800)
}

if (which === 'all' || which === 'medurun') {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.goto('https://jbieyashvi.github.io/medurun-landing-page/', { waitUntil: 'networkidle' })
  await settle(page, 2500)
  await page.screenshot({ path: `${OUT}/medurun-hero.png` })
  await scrollThrough(page)
  const ids = await page.evaluate(() => [...document.querySelectorAll('section')].map((s, i) => ({ i, id: s.id, top: s.getBoundingClientRect().top + scrollY, h: s.offsetHeight })))
  console.log(ids)
  for (const s of ids) {
    if (s.i === 0) continue
    await page.evaluate((y) => window.scrollTo(0, y - 72), s.top)
    await settle(page, 1500)
    await page.screenshot({ path: `${OUT}/medurun-s${String(s.i).padStart(2, '0')}-${s.id || 'x'}.png` })
  }
  await ctx.close()
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
  const mp = await m.newPage()
  await mp.goto('https://jbieyashvi.github.io/medurun-landing-page/', { waitUntil: 'networkidle' })
  await settle(mp, 2500)
  await mp.screenshot({ path: `${OUT}/medurun-mobile-hero.png` })
  await m.close()
}

if (which === 'all' || which === 'iica') {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
  const page = await ctx.newPage()
  const base = 'https://jbieyashvi.github.io/iica-mobile-app-prototype/#'
  const routes = ['/home', '/search', '/explore', '/catalogue', '/artist/ananya-rao', '/collaborate', '/collaborate/discover', '/collaborate/recommendations', '/events', '/explore/events', '/explore/content', '/shop', '/explore/shop', '/library', '/orders', '/profile', '/portfolio', '/whats-new']
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: 'networkidle' })
    await settle(page, 1500)
    const txt = await page.evaluate(() => document.body.innerText.slice(0, 160).replace(/\s+/g, ' '))
    console.log(r, '=>', txt)
    await page.screenshot({ path: `${OUT}/iica${r.replace(/\//g, '_')}.png` })
  }
  await ctx.close()
}

if (which === 'all' || which === 'retina') {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.goto('https://jbieyashvi.github.io/retina-prototype/', { waitUntil: 'networkidle' })
  await settle(page)
  const steps = await page.locator('.pill').allInnerTexts()
  console.log(steps)
  for (const s of steps) {
    await page.locator('.pill', { hasText: s }).first().click()
    await settle(page, 1000)
    const phone = page.locator('.phone').first()
    const n = s.split(' ')[0].padStart(2, '0')
    if (await phone.count()) await phone.screenshot({ path: `${OUT}/retina-${n}.png` })
    else await page.screenshot({ path: `${OUT}/retina-${n}.png` })
    console.log(s, '=>', await page.evaluate(() => (document.querySelector('.screen.on')?.innerText || '').slice(0, 500).replace(/\s+/g, ' ')))
  }
  await ctx.close()
}
await browser.close()
