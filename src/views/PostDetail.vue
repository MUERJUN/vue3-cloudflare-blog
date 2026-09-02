<script setup>
import { inject, computed } from 'vue'
import { renderMarkdown } from '../lib/md.js'
import { enOf } from '../site.config'

const props = defineProps({ id: { type: String, default: '' } })
const articles = inject('articles', [])

const article = computed(() => articles.value.find((a) => String(a.id) === props.id))
const html = computed(() => (article.value ? renderMarkdown(article.value.content) : ''))

function fmt(d) {
  const x = new Date(d)
  if (Number.isNaN(x.getTime())) return d || ''
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}

const readMin = computed(() => {
  const raw = (article.value?.content || '').replace(/\s/g, '')
  return Math.max(1, Math.round(raw.length / 600))
})
</script>

<template>
  <main class="page">
    <div class="wrap">
      <template v-if="article">
        <a class="back-link" href="#/posts">← 返回全部文章</a>
        <header class="page-head">
          <div class="kicker">{{ enOf(article.category) }} · {{ fmt(article.date) }}</div>
          <h1>{{ article.title }}</h1>
          <div class="post-meta">
            <span v-for="t in article.tags" :key="t" class="log-tag">{{ t }}</span>
            <span>约 {{ readMin }} 分钟</span>
          </div>
        </header>
        <!-- 渲染后的 Markdown -->
        <div class="md" v-html="html"></div>
      </template>
      <div v-else class="state-box" style="margin-top: 3rem">
        找不到这篇文章 —— 可能已被删除 <a class="back-link" style="margin: 0 0 0 0.5rem" href="#/posts">← 回列表</a>
      </div>
    </div>
  </main>
</template>