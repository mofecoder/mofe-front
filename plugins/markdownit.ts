// https://www.ateliernonta.com/journal/nuxt3-markdown-it
import MarkdownIt from 'markdown-it'

// 要素に属性を追加
import attrs from 'markdown-it-attrs'
// 注釈
import fn from 'markdown-it-footnote'
// ^ で上付き, ~ で下付き
import sub from 'markdown-it-sub'
import sup from 'markdown-it-sup'
// == で強調
import mark from 'markdown-it-mark'
// リンクに target="_blank" を追加
import mila from 'markdown-it-link-attributes'
import tm from 'markdown-it-texmath'
import katex from 'katex'
import highlightjs from 'markdown-it-highlightjs'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github.css'

const mdit: MarkdownIt = new MarkdownIt({
  html: true,
  breaks: true,
  langPrefix: 'language-',
  typographer: false,
  quotes: '“”‘’'
})
  .use(attrs, {
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: []
  })
  .use(fn)
  .use(sub)
  .use(sup)
  .use(mark)
  .use(mila, {
    matcher(href: string) {
      return href.match(/^https?:\/\//)
    },
    attrs: {
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  })
  .use(tm, { engine: katex, delimiters: 'dollars' })
  .use(highlightjs)

mdit.renderer.rules.fence = function (tokens, idx, options, _, slf) {
  const token = tokens[idx]
  const info = token.info ? mdit.utils.unescapeAll(token.info).trim() : ''
  let langName = ''
  let langAttrs = ''
  let highlighted, arr

  if (info) {
    arr = info.split(/(\s+)/g)
    langName = arr[0]
    langAttrs = arr.slice(2).join('')
  }

  if (options.highlight) {
    highlighted =
      options.highlight(token.content, langName, langAttrs) ||
      mdit.utils.escapeHtml(token.content)
  } else {
    highlighted = mdit.utils.escapeHtml(token.content)
  }

  if (highlighted.indexOf('<pre') === 0) {
    return highlighted + '\n'
  }

  return (
    '<pre' +
    slf.renderAttrs(token) +
    '><code class="hljs">' +
    highlighted +
    '</code></pre>\n'
  )
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      md: mdit
    }
  }
})
