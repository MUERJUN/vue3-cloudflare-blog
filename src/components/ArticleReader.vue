<script setup>
defineProps({
  show: { type: Boolean, default: false },
  article: { type: Object, default: null },
  tagLabel: { type: String, default: 'post' },
})
const emit = defineEmits(['close'])

function fmt(timeStr) {
  if (!timeStr) return ''
  const d = new Date(timeStr)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show && article" class="overlay" @click.self="emit('close')">
      <div class="modal reader" role="dialog" aria-modal="true" :aria-label="article.title">
        <div class="modal-head">
          <div>
            <div class="mono-label">
              {{ fmt(article.create_time) }} · {{ tagLabel }}
            </div>
            <h3 style="font-size: 1.3rem; line-height: 1.45">{{ article.title }}</h3>
          </div>
          <button class="modal-close" type="button" aria-label="关闭" @click="emit('close')">×</button>
        </div>
        <div class="modal-body reader-body">
          <p class="reader-text">{{ article.content }}</p>
          <p class="reader-end mono">EOF · 感谢阅读</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.reader { max-width: 40rem; }
.reader-body { padding-bottom: 1.8rem; }
.reader-text {
  white-space: pre-line;
  margin: 0.4rem 0 0;
  font-size: 1rem;
  line-height: 1.9;
  color: var(--ink);
}
.reader-end {
  text-align: center;
  color: var(--ink-3);
  font-size: 0.8rem;
  margin: 2rem 0 0;
}
</style>