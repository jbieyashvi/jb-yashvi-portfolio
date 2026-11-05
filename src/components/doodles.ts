/** Hand-drawn strokes shared by the home story and the case-study titles (drawn with pathLength 1) */
export type DoodleName = 'circle' | 'under' | 'stars' | 'double'

export const DOODLES: Record<DoodleName, { box: string; d: string }> = {
  circle: { box: '0 0 100 40', d: 'M54 4 C82 3 98 11 97 21 C96 33 72 38 47 37 C20 36 3 30 4 19 C5 9 25 4 60 6' },
  under: { box: '0 0 100 12', d: 'M2 8 C14 2 24 11 37 6 S61 2 74 7 S91 10 98 4' },
  double: { box: '0 0 100 16', d: 'M2 5 C20 2 40 7 60 4 S88 3 98 5 M6 13 C26 10 50 14 72 11 S90 11 96 12' },
  stars: { box: '0 0 40 30', d: 'M12 3 L14 11 L22 13 L14 15 L12 23 L10 15 L2 13 L10 11 Z M31 1 L32.2 5.8 L37 7 L32.2 8.2 L31 13 L29.8 8.2 L25 7 L29.8 5.8 Z' },
}
