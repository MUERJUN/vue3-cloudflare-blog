<script setup>
import { ref, computed, inject } from 'vue'
import { renderMarkdown } from '../lib/md.js'
import { site, categories } from '../site.config'
import { toast } from '../lib/toast.js'

const articles = inject('articles', [])

/* 密码门禁 */
const passInput = ref('')
const authed = ref(sessionStorage.getItem('muerjun-admin') === '1')
const unlock = () => {
  if (passInput.value === site.adminPassword) {
    authed.value = true
    sessionStorage.setItem('muerjun-admin', '1')
    toast('已进入管理后台', 'ok')
  } else {
    toast('密码不对', 'err')
  }
}
const lock = () => {
  authed.value = false
  sessionStorage.removeItem('muerjun-admin')
}

/* 写文章表单 */
const form = ref({
  id: '',
  title: '',
  category: categories[0].zh,
  tags: '',
  date: new Date().toISOString().slice(0, 10),
  summary: '',
  content: '',
})

const previewHtml = computed(() => renderMarkdown(form.value.content))
const preErr = computed(() => {
  if (!form.value.id.trim()) return '缺少 id（英文短横线，例如 edge-rendering-cloudflare）'
  if (form.value.title.trim().length < 2) return '标题太短了'
  return ''
})

const loadArticle = (a) => {
  form.value = {
    id: a.id,
    title: a.title,
    category: a.category || categories[0].zh,
    tags: Array.isArray(a.tags) ? a.tags.join(', ') : a.tags || '',
    date: (a.date || '').slice(0, 10),
    summary: a.summary || '',
    content: a.content || '',
  }
  toast(`已载入「${a.title}」到编辑器`, 'info')
}

const built = computed(() => ({
  id: form.value.id.trim(),
  title: form.value.title.trim(),
  category: form.value.category,
  tags: form.value.tags.split(/[,，]/).map((s) => s.trim()).filter(Boolean),
  date: form.value.date,
  summary: form.value.summary.trim(),
  content: form.value.content,
}))

const exportText = computed(() => JSON.stringify(built.value, null, 2))

async function copyJson() {
  try {
    await navigator.clipboard.writeText(exportText.value)
    toast('JSON 已复制到剪贴板', 'ok')
  } catch {
    toast('复制失败，请手动选中下方文本', 'err')
  }
}

const resetForm = () => {
  form.value = {
    id: '',
    title: '',
    category: categories[0].zh,
    tags: '',
    date: new Date().toISOString().slice(0, 10),
    summary: '',
    content: '',
  }
}
</script>

<template>
  <main class="page">
    <div class="wrap-wide">
      <!-- 未登录 -->
      <div v-if="!authed" class="admin-form" style="max-width: 24rem; margin: 3rem auto">
        <div class="kicker" style="font-family: var(--mono); font-size: 0.78rem; color: var(--accent)">~/admin — auth</div>
        <h2 style="margin: 0.3rem 0 1rem">管理后台</h2>
        <div class="field">
          <label for="pw">password</label>
          <input id="pw" v-model="passInput" class="input" type="password" autocomplete="current-password" @keydown.enter="unlock" />
        </div>
        <button class="btn btn--primary" style="width: 100%; justify-content: center" type="button" @click="unlock">进入 →</button>
        <p class="status-line">密码在 <code>src/site.config.js</code> 的 adminPassword 里，记得改成你自己的。</p>
      </div>

      <!-- 已登录 -->
      <div v-else>
        <div class="admin-toolbar">
          <div class="page-head" style="margin: 0">
            <div class="kicker">~/admin — composer</div>
            <h1 style="font-size: 1.6rem">写文章</h1>
          </div>
          <button class="btn" type="button" @click="lock">锁定后台</button>
        </div>

        <div class="admin-form">
          <div class="admin-meta-row">
            <div class="field">
              <label for="ad-id">id (slug)</label>
              <input id="ad-id" v-model="form.id" class="input mono" type="text" placeholder="edge-rendering-cloudflare" />
            </div>
            <div class="field">
              <label for="ad-title">title</label>
              <input id="ad-title" v-model="form.title" class="input" type="text" placeholder="文章标题" />
            </div>
          </div>
          <div class="admin-meta-row">
            <div class="field">
              <label for="ad-cat">category</label>
              <select id="ad-cat" v-model="form.category" class="input">
                <option v-for="c in categories" :key="c.zh" :value="c.zh">{{ c.zh }}</option>
              </select>
            </div>
            <div class="field">
              <label for="ad-date">date</label>
              <input id="ad-date" v-model="form.date" class="input mono" type="date" />
            </div>
          </div>
          <div class="field">
            <label for="ad-tags">tags（逗号分隔）</label>
            <input id="ad-tags" v-model="form.tags" class="input mono" type="text" placeholder="vue3, cloudflare, perf" />
          </div>
          <div class="field">
            <label for="ad-summary">summary</label>
            <input id="ad-summary" v-model="form.summary" class="input" type="text" placeholder="列表页显示的一句话摘要" />
          </div>
          <div class="field">
            <label for="ad-content">content（Markdown）</label>
            <textarea id="ad-content" v-model="form.content" class="input" rows="12" placeholder="支持标题 / 列表 / 引用 / 代码块 / 链接等"></textarea>
          </div>

          <div class="admin-actions">
            <button class="btn btn--primary" type="button" :disabled="!!preErr" @click="copyJson">复制 JSON</button>
            <button class="btn" type="button" @click="resetForm">清空</button>
          </div>
          <p v-if="preErr" class="status-line err">✕ {{ preErr }}</p>

          <div class="preview-box">
            <div class="kicker" style="font-family: var(--mono); font-size: 0.72rem; color: var(--ink-3); margin-bottom: 0.6rem">live preview</div>
            <div v-if="form.content.trim()" class="md" v-html="previewHtml"></div>
            <p v-else style="color: var(--ink-3); font-size: 0.9rem">在左侧正文框输入 Markdown，这里实时预览（空）</p>
          </div>

          <div class="export-box">
            <div class="field">
              <label>article.json —— 复制后粘进 <code>src/data/articles.json</code>，再 <code>git push</code> 即上线</label>
              <textarea class="input mono" readonly :value="exportText" rows="8"></textarea>
            </div>
          </div>
        </div>

        <div style="margin-top: 2.4rem; margin-bottom: 1rem">
          <h2 style="font-size: 1.2rem">已有文章（可载入编辑，仅本地）</h2>
        </div>
        <ul class="log">
          <li v-for="a in articles" :key="a.id" class="log-item">
            <div class="log-link" style="cursor: pointer" @click="loadArticle(a)">
              <span class="log-arrow" aria-hidden="true">✎</span>
              <span class="log-title" style="font-size: 0.95rem">{{ a.title }}</span>
              <span class="mono" style="font-size: 0.76rem; color: var(--ink-3)">load →</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>