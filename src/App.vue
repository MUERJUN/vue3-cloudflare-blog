<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { toast } from './lib/toast.js'
import AppHeader from './components/AppHeader.vue'
import ShellHero from './components/ShellHero.vue'
import ArticleRow from './components/ArticleRow.vue'
import AuthModal from './components/AuthModal.vue'
import ProfileModal from './components/ProfileModal.vue'
import ArticleReader from './components/ArticleReader.vue'
import ToastHub from './components/ToastHub.vue'

/* ── 接口 ─────────────────────────────── */
const baseURL = 'https://blog-api.3442578363.workers.dev'
const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

/* ── 分类 ─────────────────────────────── */
const CATS = [
  { name: '前端开发', en: 'frontend' },
  { name: '云原生部署', en: 'cloud-native' },
  { name: '全栈实践', en: 'fullstack' },
  { name: '学习笔记', en: 'notes' },
]
const enOf = (name) => CATS.find((c) => c.name === name)?.en || 'post'

/* ── 文章 ─────────────────────────────── */
const articles = ref([])
const loading = ref(true)
const loadError = ref('')
const keyword = ref('')
const activeCat = ref('')
const readerArticle = ref(null)
const showReader = ref(false)

const filtered = computed(() => {
  let list = articles.value
  if (activeCat.value) list = list.filter((a) => a.category === activeCat.value)
  const kw = keyword.value.trim().toLowerCase()
  if (kw) {
    list = list.filter((a) =>
      ((a.title || '') + ' ' + (a.content || '')).toLowerCase().includes(kw),
    )
  }
  return list
})

const countOf = (name) => articles.value.filter((a) => a.category === name).length

/* ── 登录状态 ─────────────────────────── */
const isLogin = ref(false)
const userInfo = ref({})
const showLogin = ref(false)
const showRegister = ref(false)
const authMode = ref('login')
const showProfile = ref(false)

/* ── 文章接口 ─────────────────────────── */
async function fetchArticles() {
  loading.value = true
  loadError.value = ''
  try {
    const res = await http.get('/api/articles')
    const data = res.data
    articles.value = Array.isArray(data) ? data : data?.list || []
  } catch (err) {
    loadError.value = err.message || '网络异常'
    toast('获取文章失败：请检查后端接口是否正常', 'err')
  } finally {
    loading.value = false
  }
}

/* ── 认证接口 ─────────────────────────── */
async function refreshUser() {
  const token = localStorage.getItem('token')
  if (!token) {
    isLogin.value = false
    userInfo.value = {}
    return
  }
  try {
    const res = await http.get('/api/user/me', { headers: { Authorization: `Bearer ${token}` } })
    userInfo.value = res.data || {}
    isLogin.value = true
  } catch {
    localStorage.removeItem('token')
    isLogin.value = false
    userInfo.value = {}
  }
}

async function handleLogin({ username, password }) {
  if (!username || !password) return toast('请输入用户名和密码', 'err')
  try {
    const res = await http.post('/api/login', { username, password })
    if (res.data.code === 200) {
      localStorage.setItem('token', res.data.token)
      showLogin.value = false
      toast('登录成功', 'ok')
      await refreshUser()
    } else {
      toast(res.data.msg || '登录失败', 'err')
    }
  } catch (err) {
    toast('登录失败：' + (err.response?.data?.msg || '请检查用户名密码或后端接口'), 'err')
  }
}

async function sendCode(email) {
  if (!email) return toast('请先输入邮箱地址', 'err')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast('邮箱格式不正确', 'err')
  try {
    const res = await http.post('/api/verify-code', { email })
    const code = res.data?.data?.code
    toast(code ? `验证码：${code}（5 分钟内有效）` : '验证码已发送，请查收', 'ok')
  } catch (err) {
    toast('发送失败：' + (err.response?.data?.msg || err.message), 'err')
  }
}

async function handleRegister(form) {
  const { username, email, code, password } = form
  if (!username || !email || !code || !password) return toast('请填写完整注册信息', 'err')
  try {
    const res = await http.post('/api/register', { username, email, code, password })
    if (res.data.code === 200) {
      toast('注册成功，请登录', 'ok')
      showRegister.value = false
      authMode.value = 'login'
      showLogin.value = true
    } else {
      toast(res.data.msg || '注册失败', 'err')
    }
  } catch (err) {
    toast('注册失败：' + (err.response?.data?.msg || err.message), 'err')
  }
}

async function handleUpdateProfile({ nickname, avatar }) {
  const token = localStorage.getItem('token')
  if (!token) return toast('请先登录', 'err')
  if (!nickname) return toast('请输入昵称', 'err')
  try {
    const res = await http.post(
      '/api/user/update',
      { nickname, avatar },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (res.data.code === 200) {
      userInfo.value = { ...userInfo.value, nickname, avatar: avatar || userInfo.value.avatar }
      showProfile.value = false
      toast('资料已更新', 'ok')
    } else {
      toast(res.data.msg || '保存失败', 'err')
    }
  } catch (err) {
    toast('保存失败：' + (err.response?.data?.msg || err.message), 'err')
  }
}

function handleLogout() {
  if (window.confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    isLogin.value = false
    userInfo.value = {}
    toast('已退出登录', 'info')
  }
}

/* ── 阅读器 ───────────────────────────── */
function openArticle(a) {
  readerArticle.value = a
  showReader.value = true
}

/* ── 键盘 ─────────────────────────────── */
function onKeydown(e) {
  if (e.key === 'Escape') {
    showReader.value = false
    showLogin.value = false
    showRegister.value = false
    showProfile.value = false
  }
}

onMounted(() => {
  fetchArticles()
  refreshUser()
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <AppHeader
    :is-login="isLogin"
    :user-info="userInfo"
    @open-login="showLogin = true; authMode = 'login'"
    @open-register="showRegister = true; authMode = 'register'"
    @open-profile="showProfile = true"
    @logout="handleLogout"
  />

  <ShellHero :post-count="articles.length" :tag-count="CATS.length" :is-login="isLogin" />

  <main class="main-layout">
    <div class="wrap-wide layout-grid">
      <!-- 左：文章日志 -->
      <section aria-label="文章列表">
        <div class="filter-row">
          <div class="search-box">
            <input
              v-model="keyword"
              type="search"
              placeholder="grep title / content…"
              aria-label="搜索文章"
            />
          </div>
          <div class="chip-row">
            <button class="chip" :class="{ 'is-on': activeCat === '' }" type="button" @click="activeCat = ''">
              all<span class="n">{{ articles.length }}</span>
            </button>
            <button
              v-for="c in CATS"
              :key="c.name"
              class="chip"
              :class="{ 'is-on': activeCat === c.name }"
              type="button"
              @click="activeCat = activeCat === c.name ? '' : c.name"
            >
              {{ c.en }}<span class="n">{{ countOf(c.name) }}</span>
            </button>
          </div>
        </div>

        <div v-if="loading" class="state-box"><span class="spinner" aria-hidden="true"></span>loading posts…</div>

        <div v-else-if="loadError" class="state-box">
          <p style="margin: 0 0 0.6rem">✕ {{ loadError }}</p>
          <button class="btn btn--sm retry" type="button" @click="fetchArticles">重试 retry →</button>
        </div>

        <div v-else-if="filtered.length === 0" class="state-box">
          没有匹配的文章 —— 试试换个关键词或分类
        </div>

        <ul v-else class="log">
          <ArticleRow
            v-for="a in filtered"
            :key="a.id"
            :article="a"
            :tag-label="enOf(a.category)"
            @open="openArticle"
          />
        </ul>
      </section>

      <!-- 右：侧栏 -->
      <aside aria-label="侧边栏">
        <div class="side-card">
          <h3>categories</h3>
          <ul class="side-list">
            <li v-for="c in CATS" :key="c.name">
              <button
                class="side-link"
                type="button"
                style="border: 0; background: none; cursor: pointer; padding: 0"
                @click="activeCat = activeCat === c.name ? '' : c.name"
              >
                {{ c.en }} · {{ countOf(c.name) }}
              </button>
            </li>
          </ul>
        </div>
        <div class="side-card">
          <h3>about me</h3>
          <p>写代码的人，主攻 Vue3 前后端与云原生部署。</p>
          <p>这里记录踩坑、实验与思考。</p>
          <div class="side-links">
            <a class="side-link" href="#" rel="noreferrer">github ↗</a>
            <a class="side-link" href="#" rel="noreferrer">twitter / x ↗</a>
          </div>
        </div>
      </aside>
    </div>
  </main>

  <footer class="site-footer">
    <div class="wrap" style="text-align: center">
      <p class="mono-foot">© CyberBlog · muerjun</p>
      <p>Vue 3 + Vite · 部署于 Cloudflare</p>
    </div>
  </footer>

  <AuthModal
    :show="showLogin || showRegister"
    :mode="authMode"
    @close="showLogin = false; showRegister = false"
    @switch-mode="(m) => (authMode = m)"
    @submit-login="handleLogin"
    @submit-register="handleRegister"
    @send-code="sendCode"
  />
  <ProfileModal :show="showProfile" :user-info="userInfo" @close="showProfile = false" @save="handleUpdateProfile" />
  <ArticleReader :show="showReader" :article="readerArticle" :tag-label="readerArticle ? enOf(readerArticle.category) : 'post'" @close="showReader = false" />
  <ToastHub />
</template>