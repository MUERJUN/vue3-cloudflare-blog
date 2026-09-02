<script setup>
import { inject, ref, computed } from 'vue'
import PostRow from '../components/PostRow.vue'
import { categories, enOf } from '../site.config'

const articles = inject('articles', [])
const keyword = ref('')
const activeCat = ref('')

const filtered = computed(() => {
  let list = articles.value
  if (activeCat.value) list = list.filter((a) => a.category === activeCat.value)
  const kw = keyword.value.trim().toLowerCase()
  if (kw) {
    list = list.filter(
      (a) => ((a.title || '') + ' ' + (a.summary || '') + ' ' + (a.content || '')).toLowerCase().includes(kw),
    )
  }
  return list
})

const countOf = (zh) => articles.value.filter((a) => a.category === zh).length
</script>

<template>
  <main class="page">
    <div class="wrap-wide">
      <div class="page-head">
        <div class="kicker">~/posts — all</div>
        <h1>全部文章</h1>
        <p>共 {{ articles.length }} 篇，支持搜索与分类过滤。</p>
      </div>

      <div class="filter-row">
        <div class="search-box">
          <input
            v-model="keyword"
            class="input"
            type="search"
            placeholder="grep title / content…"
            aria-label="搜索文章"
          />
        </div>
        <div class="chip-row">
          <button class="chip" :class="{ on: activeCat === '' }" type="button" @click="activeCat = ''">
            all<span class="n">{{ articles.length }}</span>
          </button>
          <button
            v-for="c in categories"
            :key="c.zh"
            class="chip"
            :class="{ on: activeCat === c.zh }"
            type="button"
            @click="activeCat = activeCat === c.zh ? '' : c.zh"
          >
            {{ c.en }}<span class="n">{{ countOf(c.zh) }}</span>
          </button>
        </div>
      </div>

      <ul v-if="filtered.length" class="log">
        <PostRow v-for="a in filtered" :key="a.id" :article="a" :tag-label="enOf(a.category)" />
      </ul>
      <div v-else class="state-box">没有匹配的文章 —— 换个关键词或分类试试</div>
    </div>
  </main>
</template>