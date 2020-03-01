import { CafeCoderApi } from '~/apis'

interface Utils {
  escapeHtml(s: string): string
}
interface MarkdownIt {
  render(s: string): string
  renderInline(s: string): string
  utils: Utils
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $api: CafeCoderApi
    readonly $md: MarkdownIt
  }
}
