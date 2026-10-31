/* ---------- the isometric drawing kit shared by the route scenes ----------
   A point (x, y, z) in a building's own space lands on the scene at o + x·U + y·V, lifted by z.
   U runs down to the right and V down to the left, so each box shows its top, its right face
   (x at its largest) and its left face (y at its largest). */
export const C = Math.cos(Math.PI / 6)
export const U: Pt = [C, 0.5]
export const V: Pt = [-C, 0.5]
export type Pt = [number, number]
export type P3 = [number, number, number]
export type Shape = { cls: string; d: string }

export const f1 = (n: number) => +n.toFixed(1)
export const along = (p: Pt, d: Pt, k: number): Pt => [p[0] + d[0] * k, p[1] + d[1] * k]

/** a small kit for drawing one building, with its front-bottom corner just above `door` */
export function kit(door: Pt, w: number, d: number) {
  const o: Pt = [door[0] - C * (w - d), door[1] - (w + d) / 2 - 14]
  const at = ([x, y, z]: P3): Pt => [f1(o[0] + x * U[0] + y * V[0]), f1(o[1] + x * U[1] + y * V[1] - z)]
  const out: Shape[] = []
  const poly = (cls: string, pts: P3[]) => out.push({ cls, d: 'M' + pts.map((p) => at(p).join(' ')).join(' L') + 'Z' })
  const line = (cls: string, pts: P3[]) => out.push({ cls, d: 'M' + pts.map((p) => at(p).join(' ')).join(' L') })
  const box = (x: number, y: number, z: number, bw: number, bd: number, h: number, top = 'roof') => {
    const [X, Y, Z] = [x + bw, y + bd, z + h]
    poly('wall', [[x, Y, z], [X, Y, z], [X, Y, Z], [x, Y, Z]])
    poly('wall wall--r', [[X, y, z], [X, Y, z], [X, Y, Z], [X, y, Z]])
    poly(top, [[x, y, Z], [X, y, Z], [X, Y, Z], [x, Y, Z]])
  }
  /** a window on the right face (x = X), from y to y + ww and z to z + hh */
  const winR = (X: number, y: number, z: number, ww: number, hh: number, cls = 'win') =>
    poly(cls, [[X, y, z], [X, y + ww, z], [X, y + ww, z + hh], [X, y, z + hh]])
  /** a window on the left face (y = Y) */
  const winL = (Y: number, x: number, z: number, ww: number, hh: number, cls = 'win') =>
    poly(cls, [[x, Y, z], [x + ww, Y, z], [x + ww, Y, z + hh], [x, Y, z + hh]])
  /** a round window on the right face */
  const ringR = (X: number, y: number, z: number, r: number, cls: string) =>
    poly(cls, Array.from({ length: 16 }, (_, k): P3 => [X, y + r * Math.cos((k / 16) * Math.PI * 2), z + r * Math.sin((k / 16) * Math.PI * 2)]))
  return { out, at, poly, line, box, winR, winL, ringR }
}

/** the road from one stop to the next: three straight runs along the iso axes, with round corners */
export function segment(a: Pt, b: Pt, via: 'uvu' | 'vuv' = 'uvu') {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]]
  const ku = dy + dx / (2 * C)
  const kv = dy - dx / (2 * C)
  const legs: [Pt, number][] = via === 'uvu' ? [[U, ku / 2], [V, kv], [U, ku / 2]] : [[V, kv / 2], [U, ku], [V, kv / 2]]
  let p = a
  const pts: Pt[] = [a]
  for (const [d, k] of legs) pts.push((p = along(p, d, k)))
  let path = `M${a[0]} ${a[1]}`
  for (let i = 1; i < pts.length - 1; i++) {
    const [prev, c, next] = [pts[i - 1], pts[i], pts[i + 1]]
    const lin = Math.hypot(c[0] - prev[0], c[1] - prev[1])
    const lout = Math.hypot(next[0] - c[0], next[1] - c[1])
    const r = Math.min(22, lin / 2, lout / 2)
    const p1 = along(c, [(prev[0] - c[0]) / lin, (prev[1] - c[1]) / lin], r)
    const p2 = along(c, [(next[0] - c[0]) / lout, (next[1] - c[1]) / lout], r)
    path += ` L${f1(p1[0])} ${f1(p1[1])} Q${f1(c[0])} ${f1(c[1])} ${f1(p2[0])} ${f1(p2[1])}`
  }
  return path + ` L${b[0]} ${b[1]}`
}
