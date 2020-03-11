import { Plugin } from '@nuxt/types'
import languages from '~/assets/languages'
import { Language } from '~/types/language'

const map = new Map<string, Language>()
languages.forEach((lang) => {
  map.set(lang.innerName, lang)
})

function getLanguageName(lang: string): Language | undefined {
  return map.get(lang)
}

const plugin: Plugin = (_, inject) => {
  inject('getLanguage', getLanguageName)
}

export default plugin
