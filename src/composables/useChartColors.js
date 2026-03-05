import { computed } from 'vue'

function getCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function hexToRgb(hex) {
  const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

function toRgba(hex, alpha) {
  const rgb = hexToRgb(hex)
  if (!rgb) return `rgba(0,0,0,${alpha})`
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`
}

export function useChartColors() {
  const lavender = computed(() => getCssVar('--color-lavender'))
  const peach = computed(() => getCssVar('--color-peach'))
  const mint = computed(() => getCssVar('--color-mint'))
  const pink = computed(() => getCssVar('--color-rose'))
  const textMuted = computed(() => getCssVar('--color-text-muted'))
  const surface = computed(() => getCssVar('--color-surface'))
  const surfaceSolid = computed(() => getCssVar('--color-surface-solid'))

  function withAlpha(colorRef, alpha) {
    const hex = typeof colorRef === 'string' ? colorRef : colorRef.value
    return toRgba(hex, alpha)
  }

  return { lavender, peach, mint, pink, textMuted, surface, surfaceSolid, withAlpha }
}
