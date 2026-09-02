// 数据层：先试 Worker 接口，失败/无数据时自动用本地 JSON 兜底
import axios from 'axios'
import { site } from '../site.config'
import seedArticles from '../data/articles.json'
import seedProjects from '../data/projects.json'

let http = null
function getHttp() {
  if (!http) {
    http = axios.create({ baseURL: site.apiBase, timeout: 8000 })
  }
  return http
}

async function withFallback(fetcher, fallback, label) {
  try {
    const res = await fetcher()
    const data = Array.isArray(res) ? res : res?.list || res?.data
    if (Array.isArray(data) && data.length > 0) return data
  } catch {
    /* 接口不可达，走本地 */
  }
  console.warn(`[api] ${label} 接口不可用，已回退到本地数据`)
  return fallback
}

export async function fetchArticles() {
  return withFallback(async () => (await getHttp().get('/api/articles')).data, seedArticles, 'articles')
}

export async function fetchProjects() {
  return withFallback(async () => (await getHttp().get('/api/projects')).data, seedProjects, 'projects')
}