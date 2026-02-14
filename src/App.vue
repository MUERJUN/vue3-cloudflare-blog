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
          
          <!-- 登录/用户信息切换 -->
          <div v-if="!isLogin" class="auth-btns">
            <button class="register-btn" @click="showRegister = true">注册</button>
            <button class="login-btn" @click="showLogin = true">登录</button>
          </div>
          
          <div v-else class="user-info" @click="showProfile = true">
            <img :src="userInfo.avatar" class="user-avatar" />
            <div class="user-name-wrap">
              <span class="user-nickname">{{ userInfo.nickname || userInfo.username }}</span>
              <!-- 管理员标识：仅 admin 账号显示 -->
              <span v-if="userInfo.username === 'admin'" class="admin-tag">管理员</span>
            </div>
            <button class="logout-btn" @click.stop="handleLogout">退出</button>
          </div>
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
            <!-- 显示真实后端文章数据 -->
            <div v-for="article in articles" :key="article.id" class="article-card neon-card">
              <div class="article-cover" :style="{ background: getRandomCover() }"></div>
              <div class="article-body">
                <div class="article-title">{{ article.title }}</div>
                <div class="article-meta">
                  <span class="category-tag">{{ article.category }}</span>
                  <span>{{ formatTime(article.create_time) }}</span>
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

    <!-- 注册弹窗 -->
    <div class="modal-mask" v-if="showRegister" @click="showRegister = false">
      <div class="modal-content neon-card" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">用户注册</h3>
          <button class="close-btn" @click="showRegister = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label>用户名</label>
            <input type="text" v-model="registerForm.username" placeholder="请输入用户名" />
          </div>
          <div class="form-item">
            <label>邮箱</label>
            <input type="email" v-model="registerForm.email" placeholder="请输入邮箱" />
          </div>
          <div class="form-item">
            <label>验证码</label>
            <div style="display: flex; gap: 10px;">
              <input type="text" v-model="registerForm.code" placeholder="请输入验证码" />
              <button class="send-code-btn" @click="sendCode" :disabled="countdown > 0">
                {{ countdown > 0 ? `${countdown}s后重发` : '发送验证码' }}
              </button>
            </div>
          </div>
          <div class="form-item">
            <label>密码</label>
            <input type="password" v-model="registerForm.password" placeholder="请输入密码" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showRegister = false">取消</button>
          <button class="confirm-btn" @click="handleRegister">注册</button>
        </div>
      </div>
    </div>

    <!-- 个人中心弹窗（修改昵称/头像） -->
    <div class="modal-mask" v-if="showProfile" @click="showProfile = false">
      <div class="modal-content neon-card" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            个人中心
            <span v-if="userInfo.username === 'admin'" class="admin-tag">管理员</span>
          </h3>
          <button class="close-btn" @click="showProfile = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label>头像</label>
            <img :src="userInfo.avatar" style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 10px;" />
            <input type="text" v-model="profileForm.avatar" placeholder="输入头像URL" />
          </div>
          <div class="form-item">
            <label>昵称</label>
            <input type="text" v-model="profileForm.nickname" placeholder="输入新昵称" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showProfile = false">取消</button>
          <button class="confirm-btn" @click="handleUpdateProfile">保存修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 🌟 核心：配置后端接口地址（固定Worker地址，确保请求能到达）
const baseURL = 'https://blog-api.3442578363.workers.dev';
// 创建axios实例，统一配置baseURL和CORS头
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000 // 超时时间10秒
});

// 分类数据
const categories = ref([
  { id: 1, name: "前端开发" },
  { id: 2, name: "云原生部署" },
  { id: 3, name: "全栈实践" },
  { id: 4, name: "学习笔记" }
]);

// 文章数据（从后端获取）
const articles = ref([]);

// 登录相关
const showLogin = ref(false);
const loginForm = ref({
  username: "",
  password: ""
});

// 注册相关
const showRegister = ref(false);
const registerForm = ref({
  username: "",
  email: "",
  code: "",
  password: ""
});
const countdown = ref(0);

// 个人中心相关
const showProfile = ref(false);
const userInfo = ref({});
const profileForm = ref({
  nickname: "",
  avatar: ""
});

// 核心状态：是否登录
const isLogin = ref(false);

// 随机封面渐变
const getRandomCover = () => {
  const covers = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  ];
  return covers[Math.floor(Math.random() * covers.length)];
};

// 时间格式化
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  return new Date(timeStr).toLocaleDateString('zh-CN');
};

// 发送验证码（核心修复：使用正确的axios实例 + 动态获取用户输入的邮箱 + 倒计时功能）
async function sendCode() {
  // 1. 校验邮箱
  if (!registerForm.value.email) {
    alert('请先输入邮箱地址！');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.value.email)) {
    alert('请输入有效的邮箱地址！');
    return;
  }

  try {
    // 2. 发送POST请求到验证码接口（使用配置好的axios实例）
    const res = await axiosInstance.post('/api/verify-code', {
      email: registerForm.value.email // 使用用户输入的邮箱，而非固定值
    });
    
    // 3. 成功提示（显示返回的验证码）
    alert(`验证码发送成功！\n你的验证码是：${res.data.data.code}\n有效期5分钟`);
    
    // 4. 启动倒计时
    countdown.value = 60;
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
  } catch (err) {
    // 5. 错误提示（更友好的信息）
    const errorMsg = err.response?.data?.msg || `请求失败：${err.message}`;
    alert(`发送验证码失败：\n${errorMsg}`);
    console.error('验证码接口错误详情：', err);
  }
}

// 注册（修复：使用axios实例）
const handleRegister = async () => {
  // 前置校验
  if (!registerForm.value.username || !registerForm.value.email || !registerForm.value.code || !registerForm.value.password) {
    alert('请填写完整的注册信息！');
    return;
  }

  try {
    const res = await axiosInstance.post('/api/register', registerForm.value);
    if (res.data.code === 200) {
      alert('注册成功！请使用账号密码登录');
      showRegister.value = false;
      showLogin.value = true;
      // 清空注册表单
      registerForm.value = { username: "", email: "", code: "", password: "" };
    } else {
      alert(res.data.msg);
    }
  } catch (err) {
    alert('注册失败：' + (err.response?.data?.msg || err.message));
    console.error('注册接口错误：', err);
  }
};

// 登录（修复：使用axios实例）
const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    alert('请输入用户名和密码！');
    return;
  }

  try {
    const res = await axiosInstance.post('/api/login', loginForm.value);

    if (res.data.code === 200) {
      localStorage.setItem('token', res.data.token);
      alert('登录成功！');
      showLogin.value = false;

      // 登录成功后获取用户信息
      const userRes = await axiosInstance.get('/api/user/me', {
        headers: { Authorization: `Bearer ${res.data.token}` }
      });
      userInfo.value = userRes.data;
      profileForm.value = { 
        nickname: userRes.data.nickname, 
        avatar: userRes.data.avatar 
      };
      isLogin.value = true;
    } else {
      alert(res.data.msg || '登录失败');
    }
  } catch (err) {
    console.error('登录失败：', err);
    alert('登录失败：' + (err.response?.data?.msg || '请检查用户名密码或后端接口'));
  }
};

// 修改个人信息（修复：使用axios实例）
const handleUpdateProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('请先登录！');
    return;
  }
  
  // 校验必填项
  if (!profileForm.value.nickname) {
    alert('请输入昵称！');
    return;
  }

  try {
    const res = await axiosInstance.post('/api/user/update', profileForm.value, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.data.code === 200) {
      alert('修改成功！');
      userInfo.value.nickname = profileForm.value.nickname;
      userInfo.value.avatar = profileForm.value.avatar || userInfo.value.avatar;
      showProfile.value = false;
    } else {
      alert(res.data.msg);
    }
  } catch (err) {
    alert('修改失败：' + (err.response?.data?.msg || err.message));
    console.error('修改个人信息错误：', err);
  }
};

// 退出登录
const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token');
    isLogin.value = false;
    userInfo.value = {};
    alert('已退出登录');
  }
};

// 页面加载时初始化
onMounted(async () => {
  // 1. 获取文章列表
  try {
    console.log('获取文章列表：', `${baseURL}/api/articles`);
    const res = await axiosInstance.get('/api/articles');
    articles.value = res.data;
    console.log('文章数据：', articles.value);
  } catch (err) {
    console.error('获取文章失败：', err);
    alert('获取文章失败，请检查后端接口是否正常！');
  }

  // 2. 自动检查登录状态
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const userRes = await axiosInstance.get('/api/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      userInfo.value = userRes.data;
      profileForm.value = { 
        nickname: userRes.data.nickname, 
        avatar: userRes.data.avatar 
      };
      isLogin.value = true;
    } catch (err) {
      localStorage.removeItem('token');
      isLogin.value = false;
      alert('登录状态已过期，请重新登录');
    }
  }
});
</script>

<style scoped>
/* 全局滚动条美化 */
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

/* 纯CSS动态背景 */
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

/* 登录/注册按钮样式 */
.auth-btns {
  display: flex;
  gap: 10px;
}
.register-btn {
  padding: 8px 20px;
  background: transparent;
  border: 1px solid #4facfe;
  color: #4facfe;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}
.register-btn:hover {
  background: rgba(79, 188, 254, 0.1);
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

/* 用户信息展示样式 */
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  cursor: pointer;
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #4facfe;
}
.user-name-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}
.user-nickname {
  color: #e2e8f0;
  font-size: 14px;
}
/* 管理员标签样式 */
.admin-tag {
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}
.logout-btn {
  padding: 4px 8px;
  background: rgba(245, 87, 108, 0.1);
  border: 1px solid #f5576c;
  color: #f5576c;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 5px;
  transition: all 0.3s;
}
.logout-btn:hover {
  background: rgba(245, 87, 108, 0.2);
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

/* 登录/注册/个人中心弹窗通用样式 */
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

/* 发送验证码按钮样式 */
.send-code-btn {
  padding: 10px 16px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}
.send-code-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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
  .modal-content {
    width: 90%;
  }
}
</style>