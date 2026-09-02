<script setup>
import { inject } from 'vue'
const projects = inject('projects', [])
</script>

<template>
  <main class="page">
    <div class="wrap-wide">
      <div class="page-head">
        <div class="kicker">~/projects</div>
        <h1>项目</h1>
        <p>在做和做过的那些东西 —— 技术栈写在每个卡片上。</p>
      </div>

      <div v-if="projects.length" class="proj-grid">
        <a
          v-for="p in projects"
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
      <div v-else class="state-box" style="margin-top: 1rem">暂无项目 —— 数据层准备好后会自动显示</div>
    </div>
  </main>
</template>