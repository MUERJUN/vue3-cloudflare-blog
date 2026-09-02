// 轻量 Toast 通知（替代 alert / confirm 弹窗）
import { reactive } from 'vue'

let seed = 0
export const toasts = reactive([])

/**
 * 弹出一条通知
 * @param {string} msg   内容
 * @param {'info'|'ok'|'err'} type 类型
 */
export function toast(msg, type = 'info') {
  const id = ++seed
  toasts.push({ id, msg, type })
  setTimeout(() => {
    const i = toasts.findIndex((t) => t.id === id)
    if (i > -1) toasts.splice(i, 1)
  }, 3800)
}