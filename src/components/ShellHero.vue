<script setup>
defineProps({
  postCount: { type: Number, default: 0 },
  tagCount: { type: Number, default: 0 },
  isLogin: { type: Boolean, default: false },
})
</script>

<template>
  <section class="hero">
    <div class="wrap">
      <div class="hero-shell">
        <div class="hero-shell-bar" aria-hidden="true">
          <span class="hero-dot r"></span>
          <span class="hero-dot y"></span>
          <span class="hero-dot g"></span>
          <span class="hero-shell-title">muerjun@cyberblog: ~/posts</span>
        </div>
        <div class="hero-shell-body">
          <p class="hero-line"><span class="p">~</span> $ cat README.md</p>
          <p class="hero-title-line">
            前端 / 云原生 / 全栈 —— 写给自己，也写给路过的你
            <span class="cur" aria-hidden="true">&nbsp;</span>
          </p>
          <div class="hero-stats">
            <span>posts <b>{{ postCount }}</b></span>
            <span>cats <b>{{ tagCount }}</b></span>
            <span v-if="isLogin">session <b style="color: var(--ok)">●</b></span>
          </div>
        </div>
      </div>
      <p class="hero-sub">
        这里是我的开发笔记：踩过的坑、读过的源码、试过的部署方案。<span class="hl">搜索与分类过滤都即时生效</span>，点任意一行的标题即可展开全文。
      </p>
    </div>
  </section>
</template>