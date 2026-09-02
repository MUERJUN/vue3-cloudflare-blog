<script setup>
import { inject, computed } from 'vue'
import TerminalHero from '../components/TerminalHero.vue'
import PostRow from '../components/PostRow.vue'
import { enOf } from '../site.config'

const articles = inject('articles', [])
const projects = inject('projects', [])

const latest = computed(() => articles.value.slice(0, 4))
const projPreview = computed(() => projects.value.slice(0, 2))
</script>

<template>
  <TerminalHero :post-count="articles.length" :proj-count="projects.length" />

  <main class="page">
    <div class="wrap-wide">
      <section style="margin-bottom: 2.2rem">
        <div class="page-head" style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem">
          <div>
            <div class="kicker">latest commits</div>
            <h1>最新文章</h1>
          </div>
          <a class="btn btn--ghost btn--sm" href="#/posts">查看全部 →</a>
        </div>
        <ul class="log">
          <PostRow v-for="a in latest" :key="a.id" :article="a" :tag-label="enOf(a.category)" />
        </ul>
      </section>

      <section>
        <div class="page-head" style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem">
          <div>
            <div class="kicker">featured repos</div>
            <h1>项目</h1>
          </div>
          <a class="btn btn--ghost btn--sm" href="#/projects">查看全部 →</a>
        </div>
        <div class="proj-grid">
          <a
            v-for="p in projPreview"
            :key="p.id"
            class="proj-card"
            :href="p.url && p.url !== '#' ? p.url : '#/projects'"
            :target="p.url && p.url !== '#' ? '_blank' : undefined"
            :rel="p.url && p.url !== '#' ? 'noreferrer' : undefined"
          >
            <div class="proj-name">
              <span>{{ p.name }}</span>
              <span v-if="p.stars" class="proj-star">★ {{ p.stars }}</span>
            </div>
            <div class="proj-role">{{ p.role }}</div>
            <p class="proj-desc">{{ p.desc }}</p>
            <div class="proj-stack">
              <span v-for="s in p.stack" :key="s" class="stack-chip">{{ s }}</span>
            </div>
          </a>
        </div>
      </section>
    </div>
  </main>
</template>