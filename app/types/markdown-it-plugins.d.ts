declare module 'markdown-it-sub' {
  import type MarkdownIt from 'markdown-it'
  const sub: MarkdownIt.PluginSimple
  export default sub
}

declare module 'markdown-it-sup' {
  import type MarkdownIt from 'markdown-it'
  const sup: MarkdownIt.PluginSimple
  export default sup
}
declare module 'markdown-it-mark' {
  import type MarkdownIt from 'markdown-it'
  const mark: MarkdownIt.PluginSimple
  export default mark
}
declare module 'markdown-it-texmath' {
  import type MarkdownIt from 'markdown-it'
  const texmath: MarkdownIt.PluginSimple
  export default texmath
}
