import { CafeCoderApi } from '~/apis'
import { Language } from '~/types/language'

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
    readonly $getLanguage: (lang: string) => Language | null
    $fetch: () => any
  }
}
