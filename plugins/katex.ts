import 'katex/dist/katex.min.css'
import renderMathInElement, {
  type RenderMathInElementOptions
} from 'katex/contrib/auto-render'
import defu from 'defu'
import katex from 'katex'

export default defineNuxtPlugin(async () => {
  return {
    provide: {
      render: (elem: HTMLElement, opt?: RenderMathInElementOptions) =>
        renderMathInElement(elem, defu(opt, RenderMathOptions)),
      renderToString: (tex: string, opt?: RenderMathInElementOptions) =>
        katex.renderToString(tex, defu(opt, RenderMathOptions))
    }
  }
})

export const RenderMathOptions: RenderMathInElementOptions = {
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false },
    { left: '\\(', right: '\\)', display: false },
    { left: '\\[', right: '\\]', display: true }
  ],
  ignoredTags: ['script', 'noscript', 'style', 'textarea', 'option'],
  throwOnError: false
}
