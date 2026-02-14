<template>
  <div class="app-container">
    <!-- 纯CSS动态背景（替代粒子效果） -->
    <div class="animated-bg"></div>

    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-inner">
        <h1 class="logo">
          <span class="gradient-text">Cyber</span>Blog
        </h1>
        <nav class="nav">
          <a href="#" class="nav-item">首页</a>
          <a href="#" class="nav-item">项目</a>
          <a href="#" class="nav-item">关于</a>
          <button class="login-btn" @click="showLogin = true">登录</button>
        </nav>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="main">
      <div class="main-inner">
        <!-- 侧边栏 -->
        <aside class="sidebar">
          <div class="sidebar-card neon-card">
            <h3 class="sidebar-title">文章分类</h3>
            <ul class="category-list">
              <li v-for="category in categories" :key="category.id" class="category-item">
                {{ category.name }}
              </li>
            </ul>
          </div>
          <div class="sidebar-card neon-card">
            <h3 class="sidebar-title">关于博主</h3>
            <p>Vue3 + Node.js 全栈开发者</p>
            <p>专注前端开发 & 云原生部署</p>
            <div class="social-links">
              <a href="#" class="social-link">GitHub</a>
              <a href="#" class="social-link">Twitter</a>
            </div>
          </div>
        </aside>

        <!-- 文章列表 -->
        <section class="article-content">
          <div class="content-header">
            <h2 class="section-title">最新文章</h2>
            <div class="search-box">
              <input type="text" placeholder="搜索文章..." />
            </div>
          </div>
          
          <div class="article-list">
            <div v-for="article in articles" :key="article.id" class="article-card neon-card">
              <div class="article-cover" :style="{ background: article.cover }"></div>
              <div class="article-body">
                <div class="article-title">{{ article.title }}</div>
                <div class="article-meta">
                  <span class="category-tag">{{ article.category }}</span>
                  <span>{{ article.create_time }}</span>
                </div>
                <div class="article-desc">{{ article.content.slice(0, 120) }}...</div>
                <button class="read-more-btn">阅读全文 →</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- 底部 -->
    <footer class="footer">
      <div class="footer-inner">
        <p>© 2026 CyberBlog | Powered by Vue3 + Cloudflare</p>
      </div>
    </footer>

    <!-- 登录弹窗 -->
    <div class="modal-mask" v-if="showLogin" @click="showLogin = false">
      <div class="modal-content neon-card" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">管理员登录</h3>
          <button class="close-btn" @click="showLogin = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label>用户名</label>
            <input type="text" v-model="loginForm.username" placeholder="请输入用户名" />
          </div>
          <div class="form-item">
            <label>密码</label>
            <input type="password" v-model="loginForm.password" placeholder="请输入密码" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showLogin = false">取消</button>
          <button class="confirm-btn" @click="handleLogin">登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 分类数据
const categories = ref([
  { id: 1, name: "前端开发" },
  { id: 2, name: "云原生部署" },
  { id: 3, name: "全栈实践" },
  { id: 4, name: "学习笔记" }
]);

// 文章数据（带渐变封面）
const articles = ref([
  {
    id: 1,
    title: "Vue3 + Cloudflare Pages 前端部署实战",
    category: "前端开发",
    cover: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    content: "本文详细讲解如何将 Vue3 项目打包并部署到 Cloudflare Pages，利用 Cloudflare 全球 CDN 加速，实现免费、高速的网页访问。包括打包配置、静态资源处理、自定义域名绑定等关键步骤。",
    create_time: "2026-02-14"
  },
  {
    id: 2,
    title: "Cloudflare Workers + D1 实现无服务器后端",
    category: "云原生部署",
    cover: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    content: "Cloudflare Workers 是 Serverless 运行环境，结合 D1 数据库可以快速搭建无服务器后端。本文从零开始实现博客的接口开发、JWT 鉴权、数据存储，全程免费无需服务器。",
    create_time: "2026-02-14"
  },
  {
    id: 3,
    title: "全栈开发：从 Vue3 到 Cloudflare 完整流程",
    category: "全栈实践",
    cover: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    content: "作为一名全栈开发者，从需求分析、技术选型、前端开发、后端接口、部署上线，一步步完成个人博客系统的开发。重点讲解前后端对接、跨域处理、权限控制等核心问题。",
    create_time: "2026-02-14"
  }
]);

// 登录相关
const showLogin = ref(false);
const loginForm = ref({
  username: "",
  password: ""
});

const handleLogin = () => {
  if (loginForm.value.username === "admin" && loginForm.value.password === "123456") {
    alert("登录成功！后续可添加文章管理功能");
    showLogin.value = false;
  } else {
    alert("用户名或密码错误（默认：admin/123456）");
  }
};
</script>

<style scoped>
/* 全局滚动条美化（核心优化） */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #4facfe 0%, #764ba2 100%);
  border-radius: 3px;
  transition: background 0.3s;
}
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #00f2fe 0%, #667eea 100%);
}
/* 隐藏Firefox滚动条（可选） */
* {
  scrollbar-width: thin;
  scrollbar-color: #4facfe #0f172a;
}

/* 全局布局 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #0f172a;
  color: #e2e8f0;
  position: relative;
  overflow-x: hidden;
}

/* 纯CSS动态背景（替代粒子效果） */
.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(79, 70, 229, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(79, 188, 254, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(124, 58, 237, 0.05) 0%, transparent 50%);
  animation: bgMove 20s infinite linear;
}
@keyframes bgMove {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-20px, -20px) scale(1.05); }
  100% { transform: translate(0, 0) scale(1); }
}

/* 顶部导航 */
.header {
  background-color: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(79, 70, 229, 0.2);
  height: 70px;
  line-height: 70px;
  position: sticky;
  top: 0;
  z-index: 10;
}
.header-inner {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}
.gradient-text {
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.nav {
  display: flex;
  gap: 30px;
  align-items: center;
}
.nav-item {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.3s;
}
.nav-item:hover {
  color: #4facfe;
}
.login-btn {
  padding: 8px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}
.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

/* 主体内容 */
.main {
  flex: 1;
  padding: 40px 0;
  position: relative;
  z-index: 1;
}
.main-inner {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 30px;
}

/* 侧边栏 */
.sidebar {
  width: 280px;
}
.sidebar-card {
  background-color: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(79, 70, 229, 0.2);
}
.neon-card {
  box-shadow: 0 0 20px rgba(79, 70, 229, 0.1);
  transition: box-shadow 0.3s;
}
.neon-card:hover {
  box-shadow: 0 0 30px rgba(79, 70, 229, 0.2);
}
.sidebar-title {
  margin-top: 0;
  font-size: 18px;
  color: #4facfe;
  border-bottom: 1px solid rgba(79, 70, 229, 0.2);
  padding-bottom: 12px;
  margin-bottom: 16px;
}
.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.category-item {
  padding: 10px 0;
  color: #94a3b8;
  cursor: pointer;
  border-radius: 6px;
  padding-left: 12px;
  transition: background-color 0.3s, color 0.3s;
}
.category-item:hover {
  background-color: rgba(79, 70, 229, 0.1);
  color: #4facfe;
}
.social-links {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}
.social-link {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.3s;
}
.social-link:hover {
  color: #4facfe;
}

/* 文章内容区 */
.article-content {
  flex: 1;
}
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.section-title {
  margin: 0;
  color: #e2e8f0;
  font-size: 24px;
  position: relative;
}
.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
}
.search-box input {
  padding: 10px 16px;
  background-color: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 20px;
  width: 220px;
  outline: none;
  color: #e2e8f0;
  transition: border-color 0.3s;
}
.search-box input:focus {
  border-color: #4facfe;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.article-card {
  background-color: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(79, 70, 229, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
}
.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.2);
}
.article-cover {
  width: 180px;
  flex-shrink: 0;
}
.article-body {
  padding: 24px;
  flex: 1;
}
.article-title {
  font-size: 20px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 12px;
}
.article-meta {
  color: #94a3b8;
  font-size: 12px;
  margin-bottom: 16px;
  display: flex;
  gap: 15px;
  align-items: center;
}
.category-tag {
  background-color: rgba(79, 70, 229, 0.1);
  color: #4facfe;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
}
.article-desc {
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 20px;
}
.read-more-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}
.read-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(79, 188, 254, 0.4);
}

/* 底部 */
.footer {
  background-color: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(79, 70, 229, 0.2);
  text-align: center;
  padding: 24px 0;
  font-size: 14px;
  color: #94a3b8;
}
.footer-inner {
  width: 1200px;
  margin: 0 auto;
}

/* 登录弹窗 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  width: 420px;
  background-color: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(79, 70, 229, 0.2);
}
.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(79, 70, 229, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-title {
  margin: 0;
  color: #4facfe;
}
.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.3s;
}
.close-btn:hover {
  color: #4facfe;
}
.modal-body {
  padding: 24px;
}
.form-item {
  margin-bottom: 20px;
}
.form-item label {
  display: block;
  margin-bottom: 8px;
  color: #e2e8f0;
}
.form-item input {
  width: 100%;
  padding: 12px;
  background-color: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 8px;
  outline: none;
  color: #e2e8f0;
  transition: border-color 0.3s;
}
.form-item input:focus {
  border-color: #4facfe;
}
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(79, 70, 229, 0.2);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.cancel-btn {
  padding: 10px 20px;
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 8px;
  background-color: transparent;
  color: #94a3b8;
  cursor: pointer;
  transition: border-color 0.3s, color 0.3s;
}
.cancel-btn:hover {
  border-color: #4facfe;
  color: #4facfe;
}
.confirm-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}
.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .header-inner, .main-inner, .footer-inner {
    width: 90%;
  }
}
@media (max-width: 768px) {
  .main-inner {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
  }
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  .article-card {
    flex-direction: column;
  }
  .article-cover {
    width: 100%;
    height: 120px;
  }
}
</style>