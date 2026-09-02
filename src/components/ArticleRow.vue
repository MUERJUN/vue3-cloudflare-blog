<script setup>
defineProps({
  article: { type: Object, required: true },
  tagLabel: { type: String, default: 'post' },
})
const emit = defineEmits(['open'])

function fmt(timeStr) {
  if (!timeStr) return ''
  const d = new Date(timeStr)
  if (Number.isNaN(d.getTime())) return ''
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function excerpt(content) {
  const text = (content || '').replace(/\s+/g, ' ').trim()
  return text.length > 96 ? text.slice(0, 96) + '…' : text
}
</script>

<template>
  <li class="log-item">
    <a class="log-link" href="#" @click.prevent="emit('open', article)">
      <span class="log-arrow" aria-hidden="true">▸</span>
      <span class="log-date">{{ fmt(article.create_time) }}</span>
      <span class="log-tag">{{ tagLabel }}</span>
      <span class="log-title">{{ article.title }}</span>
      <span class="log-excerpt">{{ excerpt(article.content) }}</span>
      <span class="log-time">read →</span>
    </a>
  </li>
</template>