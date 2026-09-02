<script setup>
import { site } from '../site.config'

const skills = ['Vue3 / Vite', 'Node.js', 'Cloudflare Workers', 'Docker', 'Rust（入门）', 'CI/CD']
const areas = ['前端工程化', '云原生部署', '全栈小工具', '性能优化']
</script>

<template>
  <main class="page">
    <div class="wrap">
      <div class="page-head">
        <div class="kicker">~/about</div>
        <h1>关于 {{ site.name }}</h1>
        <p>写代码的人，主攻 Vue3 前后端与云原生部署。这个站是我的开发日志。</p>
      </div>

      <div class="about-grid">
        <section class="card-block">
          <h3>我在做什么</h3>
          <p style="color: var(--ink-2)">白天写业务代码，晚上折腾部署和工具链。这里主要记录三类事：</p>
          <ul class="md" style="margin: 0.6em 0 0; padding-left: 1.2em">
            <li v-for="a in areas" :key="a" class="md-list" style="list-style: disc">{{ a }}</li>
          </ul>
        </section>

        <section class="card-block">
          <h3>技能栈</h3>
          <div class="skill-tags">
            <span v-for="s in skills" :key="s">{{ s }}</span>
          </div>
          <h3 style="margin-top: 1.4rem">链接</h3>
          <div class="about-links">
            <a v-for="s in site.socials" :key="s.label" :href="s.url" target="_blank" rel="noreferrer">
              {{ s.label }} ↗
            </a>
            <a href="#/admin">admin</a>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>