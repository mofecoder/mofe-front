import languages from '~~/constants/languages'
import { Language } from '~~/types/language'

const map = new Map<string, Language>()
languages.forEach((lang) => {
  map.set(lang.innerName, lang)
})

function getLanguageName(lang: string): Language | undefined {
  return map.get(lang)
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      getLanguageName
    }
  }
})
