<template>
  <div class="home">
    <h1>我的个人博客系统</h1>
    <button @click="login">登录管理员</button>
    <div class="article-list">
      <div v-for="article in articles" :key="article.id" class="article-item">
        <h3>{{ article.title }}</h3>
        <p>{{ article.content.slice(0, 100) }}...</p>
        <span>{{ article.create_time }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 模拟文章数据
const articles = ref([
  {
    id: 1,
    title: "我的第一篇博客",
    content: "这是用 Vue3 开发的个人博客系统，后续部署 Cloudflare 后端后可实现真实数据交互！",
    create_time: "2026-02-14"
  },
  {
    id: 2,
    title: "Vue3 + Cloudflare 部署指南",
    content: "今天我把自己的博客部署到了 Cloudflare Pages，速度超快而且完全免费！",
    create_time: "2026-02-14"
  },
  {
    id: 3,
    title: "前端全栈开发入门",
    content: "从 Vue3 到 Cloudflare Workers，一步步搭建自己的全栈项目。",
    create_time: "2026-02-14"
  }
]);

// 模拟登录
const login = () => {
  alert('登录功能需部署后端后使用，当前已安装 Vue3 项目并正常显示模拟数据！');
};

onMounted(() => {
  // 直接使用模拟数据，无需请求接口
});
</script>

<style scoped>
.home {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
}
.article-list {
  margin-top: 20px;
}
.article-item {
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
}
</style>