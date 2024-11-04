import { InstallCodeMirror } from 'codemirror-editor-vue3'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/python/python'
import 'codemirror/mode/go/go'
import 'codemirror/mode/rust/rust'
import 'codemirror/mode/ruby/ruby'
import 'codemirror/mode/fortran/fortran'
import 'codemirror/mode/crystal/crystal'
import 'codemirror/mode/perl/perl'
import 'codemirror/mode/shell/shell'

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(InstallCodeMirror)
})
