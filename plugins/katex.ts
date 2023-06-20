import 'katex/dist/katex.min.css'
import { RenderMathInElementOptions } from 'katex/contrib/auto-render'

export default defineNuxtPlugin(async () => {})
export const RenderMathOptions: RenderMathInElementOptions = {
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false },
    { left: '\\(', right: '\\)', display: false },
    { left: '\\[', right: '\\]', display: true }
  ],
  ignoredTags: ['script', 'noscript', 'style', 'textarea', 'option']
}
