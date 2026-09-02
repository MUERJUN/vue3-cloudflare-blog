// 站点配置 —— 想改名字、链接、后端地址、后台密码，都改这里
export const site = {
  name: 'MUERJUN',
  brand: 'muerjun',        // 终端里显示的主机名
  title: 'MUERJUN · Dev Journal',
  tagline: '前端 / 云原生 / 全栈 —— 写给自己，也写给路过的你。',
  // 后端接口（Worker）。文章/项目会先请求这里，失败则自动用本地数据兜底。
  apiBase: 'https://blog-api.3442578363.workers.dev',
  // 后台密码（纯前端门禁，适合个人博客；改成一个你自己的值）
  adminPassword: 'muerjun2026',
  // 页脚
  footer: '© MUERJUN · Vue3 + Vite · 部署于 Cloudflare',
  socials: [
    { label: 'github', url: 'https://github.com/MUERJUN' },
    // { label: 'twitter', url: 'https://x.com/yourname' },
  ],
}

export const categories = [
  { zh: '前端开发', en: 'frontend' },
  { zh: '云原生部署', en: 'cloud-native' },
  { zh: '全栈实践', en: 'fullstack' },
  { zh: '学习笔记', en: 'notes' },
]

export const enOf = (zh) => categories.find((c) => c.zh === zh)?.en || 'post'