// Records a short scroll-through of the live Medurun landing page (WebM) + stills at chosen scroll points.
import { chromium } from 'playwright-core'
import { renameSync, readdirSync, mkdirSync, rmSync } from 'node:fs'
const browser = await chromium.launch({ channel: 'chrome' })
const URL = 'https://jbieyashvi.github.io/medurun-landing-page/'

// warm-up for stills
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.goto(URL, { waitUntil: 'networkidle' }); await page.waitForTimeout(2500)
  const smooth = async (to) => { await page.evaluate(async (to) => { const s = scrollY; const n = 40; for (let i = 1; i <= n; i++) { scrollTo(0, s + (to - s) * i / n); await new Promise(r => setTimeout(r, 30)) } }, to); await page.waitForTimeout(1600) }
  for (const [name, y] of [['positioning', 2500], ['network', 3400], ['services', 6400], ['why', 13300], ['how', 16600], ['how2', 17800], ['contact', 22100]]) {
    await smooth(y); await page.screenshot({ path: `capture/medurun-still-${name}.png` })
  }
  await ctx.close()
}

mkdirSync('capture/video', { recursive: true }); rmSync('capture/video', { recursive: true }); mkdirSync('capture/video')
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: 'capture/video', size: { width: 1280, height: 800 } } })
const page = await ctx.newPage()
await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForTimeout(3500)
await page.evaluate(async () => {
  const ease = (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  const go = async (to, ms) => { const s = scrollY; const t0 = performance.now(); await new Promise(res => { const f = (now) => { const p = Math.min(1, (now - t0) / ms); scrollTo(0, s + (to - s) * ease(p)); p < 1 ? requestAnimationFrame(f) : res() }; requestAnimationFrame(f) }) }
  const wait = (ms) => new Promise(r => setTimeout(r, ms))
  await go(1900, 2200); await wait(900); await go(3300, 2600); await wait(1200)
  await go(4400, 1800); await wait(900); await go(13200, 3200); await wait(1100); await go(16700, 2400); await wait(800); await go(18300, 2600); await wait(1200)
})
await ctx.close()
const f = readdirSync('capture/video')[0]
renameSync(`capture/video/${f}`, 'capture/medurun-scroll.webm')
await browser.close()
console.log('done')
