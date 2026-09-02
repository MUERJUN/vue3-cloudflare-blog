<script setup>
// 文章日志行（复用组件）
defineProps({
  article: { type: Object, required: true },
  tagLabel: { type: String, default: 'post' },
  latest: { type: Boolean, default: false },
})
const emit = defineEmits(['open'])

function fmt(d) {
  const x = new Date(d)
  if (Number.isNaN(x.getTime())) return d || ''
  const p = (n) => String(n).padStart(2, '0')
  return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}`
}
</script>

<template>
  <li class="log-item">
    <a class="log-link" :href="`#/posts/${article.id}`" @click="emit('open')">
      <span class="log-arrow" aria-hidden="true">▸</span>
      <span class="log-date">{{ fmt(article.date) }}</span>
      <span class="log-tag">{{ tagLabel }}</span>
      <span class="log-title">{{ article.title }}</span>
      <span v-if="article.summary" class="log-summary">{{ article.summary }}</span>
      <span class="mono" style="font-size: 0.76rem; color: var(--ink-3)">→</span>
    </a>
  </li>
</template>