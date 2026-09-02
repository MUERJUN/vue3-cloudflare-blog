// 明暗主题切换（localStorage 持久化；默认深色）
const KEY = 'muerjun-theme'

export function getTheme() {
  return localStorage.getItem(KEY) || 'dark'
}

export function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark')
  localStorage.setItem(KEY, t === 'light' ? 'light' : 'dark')
}

export function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark'
  applyTheme(next)
  return next
}