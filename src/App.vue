<script setup>
import { ref, provide, onMounted, onBeforeUnmount, computed } from 'vue'
import { fetchArticles, fetchProjects } from './lib/api.js'
import { getTheme, toggleTheme } from './lib/theme.js'
import { site } from './site.config'
import ToastHub from './components/ToastHub.vue'
import Home from './views/Home.vue'
import Posts from './views/Posts.vue'
import PostDetail from './views/PostDetail.vue'
import Projects from './views/Projects.vue'
import About from './views/About.vue'
import Admin from './views/Admin.vue'

/* 数据 */
const articles = ref([])
const projects = ref([])
provide('articles', articles)
provide('projects', projects)

/* 路由（hash） */
const route = ref(parseHash())
function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '')
  const [seg, id] = raw.split('/')
  const name = seg === '' ? 'home' : seg
  if (!['home', 'posts', 'post', 'projects', 'about', 'admin'].includes(name)) return { name: 'home' }
  return { name, param: id ? decodeURIComponent(id) : '' }
}
function onHash() {
  route.value = parseHash()
  window.scrollTo({ top: 0 })
}

/* 主题 */
const theme = ref(getTheme())
const isDark = computed(() => theme.value === 'dark')
function toggle() {
  theme.value = toggleTheme()
}

/* 导航激活态 */
const navItems = [
  { label: 'home', hash: '#/' },
  { label: 'posts', hash: '#/posts' },
  { label: 'projects', hash: '#/projects' },
  { label: 'about', hash: '#/about' },
]

onMounted(async () => {
  window.addEventListener('hashchange', onHash)
  articles.value = await fetchArticles()
  projects.value = await fetchProjects()
})
onBeforeUnmount(() => window.removeEventListener('hashchange', onHash))
</script>

<template>
  <header class="site-header">
    <div class="wrap-wide">
      <a class="brand" href="#/">
        <span class="at">@</span>muerjun<span class="cursor" aria-hidden="true"></span>
      </a>
      <nav class="site-nav" aria-label="站点导航">
        <a
          v-for="n in navItems"
          :key="n.label"
          :href="n.hash"
          :class="{ on: route.name === n.label || (n.label === 'home' && route.name === 'post') }"
        >
          {{ n.label }}
        </a>
      </nav>
      <div class="header-end">
        <button class="theme-btn" type="button" :aria-label="isDark ? '切换到亮色' : '切换到深色'" @click="toggle">
          {{ isDark ? '☀' : '☾' }}
        </button>
        <a class="btn btn--ghost btn--sm" style="text-decoration: none" href="#/admin">admin</a>
      </div>
    </div>
  </header>

  <Home v-if="route.name === 'home'" />
  <Posts v-else-if="route.name === 'posts'" />
  <PostDetail v-else-if="route.name === 'post'" :id="route.param" />
  <Projects v-else-if="route.name === 'projects'" />
  <About v-else-if="route.name === 'about'" />
  <Admin v-else-if="route.name === 'admin'" />

  <footer class="site-footer">
    <div class="wrap">
      <p class="mono-foot">{{ site.footer }}</p>
      <p>{{ site.tagline }}</p>
    </div>
  </footer>

  <ToastHub />
</template>