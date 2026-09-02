<script setup>
import { site } from '../site.config'
defineProps({ postCount: { type: Number, default: 0 }, projCount: { type: Number, default: 0 } })
</script>

<template>
  <section class="hero">
    <div class="wrap">
      <div class="shell">
        <div class="shell-bar" aria-hidden="true">
          <span class="shell-dot r"></span>
          <span class="shell-dot y"></span>
          <span class="shell-dot g"></span>
          <span class="shell-title">{{ site.brand }}@dev: ~</span>
        </div>
        <div class="shell-body">
          <p class="shell-line"><span class="p">≈</span> whoami</p>
          <p class="shell-headline">{{ site.name }} — <span class="hl">前端 / 云原生 / 全栈</span></p>
          <p class="shell-line" style="margin-top: 0.7rem"><span class="p">≈</span> ls ./posts</p>
          <p class="shell-line">… {{ postCount }} 篇文章，{{ projCount }} 个项目，还在增长中<span style="color: var(--accent)">▍</span></p>
          <div class="shell-stats">
            <span>posts <b>{{ postCount }}</b></span><span class="sep">·</span>
            <span>projects <b>{{ projCount }}</b></span><span class="sep">·</span>
            <span>uptime <b>{{ '24/7' }}</b></span>
          </div>
        </div>
      </div>
      <p class="hero-sub">
        记录<a class="hl" href="#/posts" style="text-decoration: none">踩过的坑</a>、读过的源码、试过的部署方案 ——
        文本优先，能静态就静态，把动态留给真正会变的部分。
      </p>
    </div>
  </section>
</template>