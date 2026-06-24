#!/usr/bin/env node
/*
 * contrast-check.mjs — reproducible WCAG 2.x contrast verification for the
 * edoconnell.org design tokens. Run: `node scripts/contrast-check.mjs`.
 *
 * Why this exists: the design-system refinement (2026-06-24) claims every
 * text/accent pair clears WCAG AA on both light and dark themes. A throwaway
 * tmp script is not reproducible evidence, so the check lives in-repo and exits
 * non-zero on any AA failure — it can gate CI alongside the axe suite.
 *
 * AA thresholds: 4.5:1 normal text, 3:1 large text / UI components.
 * We hold normal-text pairs to a >=0.3 margin over 4.5 (>=4.8) so antialiasing
 * and subpixel rendering can't tip a "passes by 0.1" value under in real browsers.
 */

const TARGET = 4.5
const MARGIN = 4.8 // 4.5 + 0.3 safety margin for normal text

function toRGB(hex) {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}
function channelLum(c) {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}
function lum(hex) {
  const [r, g, b] = toRGB(hex).map(channelLum)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function ratio(a, b) {
  const L1 = lum(a)
  const L2 = lum(b)
  const hi = Math.max(L1, L2)
  const lo = Math.min(L1, L2)
  return (hi + 0.05) / (lo + 0.05)
}
// composite an rgba(r,g,b,a) string OR {hex,a} over an opaque base hex
function composite(fgHex, alpha, baseHex) {
  const fg = toRGB(fgHex)
  const base = toRGB(baseHex)
  const out = fg.map((c, i) => Math.round(alpha * c + (1 - alpha) * base[i]))
  return '#' + out.map((c) => c.toString(16).padStart(2, '0')).join('')
}

// ─── FINAL TOKEN VALUES (must mirror global.css) ────────────────────────────
const light = {
  text: '#1A1A17',
  textMuted: '#595650',
  textTertiary: '#5F5B51', // re-derived for >=0.3 margin on subtle (was #6E6A62 = 4.60, no margin)
  bg: '#FFFFF8',
  surface: '#FFFFFF',
  subtle: '#F0EDE4',
  secondary: '#FFFFFF',
  border: '#DAD5C8',
  accent: '#8B2635',
  accentHover: '#6E1D27',
  onAccent: '#FFFFFF',
  kindBrief: '#1D4E89',
  kindEssay: '#8A5212',
  kindCase: '#0F6E66',
  // -subtle tint alphas
  accentSubtleA: 0.06,
  kindBriefSubtleA: 0.08,
  kindEssaySubtleA: 0.1,
  kindCaseSubtleA: 0.1,
}
const dark = {
  text: '#E6E3DC',
  textMuted: '#A8A49B',
  textTertiary: '#9A968C', // re-derived for >=0.3 margin on subtle (was #8E8A82 = 4.33, FAIL)
  bg: '#17171A',
  surface: '#1F1F23',
  subtle: '#27272B',
  secondary: '#101012',
  border: '#3A3A40',
  accent: '#D98A95',
  accentHover: '#E8A4AD',
  onAccent: '#17171A',
  kindBrief: '#7FB0EC',
  kindEssay: '#E8B23C',
  kindCase: '#5BD6C4',
  accentSubtleA: 0.14,
  kindBriefSubtleA: 0.14,
  kindEssaySubtleA: 0.16,
  kindCaseSubtleA: 0.14,
}

let failures = 0
let thin = 0

function check(label, fg, bg, { large = false } = {}) {
  const r = ratio(fg, bg)
  const min = large ? 3 : TARGET
  const ok = r >= min
  const isThin = !large && ok && r < MARGIN
  if (!ok) failures++
  if (isThin) thin++
  const tag = !ok ? 'FAIL' : isThin ? 'THIN' : 'ok  '
  console.log(`  [${tag}] ${r.toFixed(2)}:1  ${label}  (${fg} on ${bg})`)
}

function suite(name, t) {
  console.log(`\n=== ${name} ===`)
  // body/muted/tertiary text against every surface they can land on
  for (const [tname, color] of [
    ['text', t.text],
    ['text-muted', t.textMuted],
    ['text-tertiary', t.textTertiary],
  ]) {
    for (const [bname, bg] of [
      ['bg', t.bg],
      ['surface', t.surface],
      ['subtle', t.subtle],
      ['secondary', t.secondary],
    ]) {
      check(`${tname} on ${bname}`, color, bg)
    }
  }
  // accent (links) on the three reading surfaces
  for (const [bname, bg] of [['bg', t.bg], ['surface', t.surface], ['subtle', t.subtle]]) {
    check(`accent on ${bname}`, t.accent, bg)
  }
  check('accent-hover on bg', t.accentHover, t.bg)
  // on-accent text sitting on the accent fill (buttons, ::selection)
  check('on-accent on accent fill', t.onAccent, t.accent)
  // focus ring (UI component) vs surfaces it abuts — 3:1 large/UI threshold
  check('focus ring vs bg', t.accent, t.bg, { large: true })
  check('focus ring vs surface', t.accent, t.surface, { large: true })
  // kind/status colors vs bg AND vs their own -subtle tint composited over bg
  for (const [kname, color, a] of [
    ['kind-brief', t.kindBrief, t.kindBriefSubtleA],
    ['kind-essay', t.kindEssay, t.kindEssaySubtleA],
    ['kind-case', t.kindCase, t.kindCaseSubtleA],
  ]) {
    check(`${kname} on bg`, color, t.bg)
    check(`${kname} on own -subtle tint`, color, composite(color, a, t.bg))
  }
  // accent on its own -subtle tint (dead-banner text/border context)
  check('accent on accent -subtle tint', t.accent, composite(t.accent, t.accentSubtleA, t.bg))
}

suite('LIGHT theme', light)
suite('DARK theme', dark)

console.log(`\n${'─'.repeat(60)}`)
console.log(`FAIL (<${TARGET}:1): ${failures}   THIN (<${MARGIN}:1, no margin): ${thin}`)
if (failures > 0) {
  console.log('RESULT: contrast FAILURES present — fix before merge.')
  process.exit(1)
}
console.log(thin > 0 ? 'RESULT: AA passes, but THIN values flagged — consider more margin.' : 'RESULT: all pairs clear AA with >=0.3 margin.')
