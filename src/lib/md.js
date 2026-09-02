// 轻量 Markdown 渲染器（无外部依赖，安全性：先转义 HTML 再解析）

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inline(src) {
  let s = esc(src)
  // 行内代码
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>')
  // 图片 [alt](url)
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
  // 链接 [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
  // 加粗 / 斜体
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
  return s
}

function codeBlock(src) {
  const m = src.match(/```(\w*)\n([\s\S]*?)```/)
  if (!m) return null
  const lang = m[1] || ''
  const code = esc(m[2])
  return {
    html: `<pre class="md-code"><span class="md-code-bar">${lang || 'code'}</span><code>${code.replace(/\n$/, '')}</code></pre>`,
    rest: src.slice(m[0].length),
  }
}

export function renderMarkdown(src) {
  const lines = String(src || '').replace(/\r\n/g, '\n').split('\n')
  const out = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // 代码块
    if (/^```/.test(line)) {
      const block = []
      while (i < lines.length && !/^```$/.test(lines[i + 1] || '')) {
        i++
        block.push(lines[i])
      }
      i += 2 // 跳过结尾 ``` 和下一行
      out.push(`<pre class="md-code"><span class="md-code-bar">code</span><code>${esc(block.join('\n'))}</code></pre>`)
      continue
    }

    // 标题
    const h = line.match(/^(#{1,4})\s+(.*)$/)
    if (h) {
      const lv = h[1].length
      out.push(`<h${lv + 2} class="md-h${lv}">${inline(h[2])}</h${lv + 2}>`)
      i++
      continue
    }

    // 引用
    if (/^>\s?/.test(line)) {
      const quote = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      out.push(`<blockquote class="md-quote">${inline(quote.join('\n'))}</blockquote>`)
      continue
    }

    // 无序列表
    if (/^\s*[-*]\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ''))}</li>`)
        i++
      }
      out.push(`<ul class="md-list">${items.join('')}</ul>`)
      continue
    }

    // 有序列表
    if (/^\s*\d+\.\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ''))}</li>`)
        i++
      }
      out.push(`<ol class="md-list">${items.join('')}</ol>`)
      continue
    }

    // 分隔线
    if (/^\s*(---+|\*\*\*+)\s*$/.test(line)) {
      out.push('<hr class="md-hr" />')
      i++
      continue
    }

    // 空行
    if (/^\s*$/.test(line)) {
      i++
      continue
    }

    // 段落（合并连续非空行）
    const para = []
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,4}\s|>\s?|```|-\s+|\d+\.\s+)/.test(lines[i])) {
      para.push(lines[i])
      i++
    }
    out.push(`<p class="md-p">${inline(para.join('<br />'))}</p>`)
  }

  return out.join('\n')
}