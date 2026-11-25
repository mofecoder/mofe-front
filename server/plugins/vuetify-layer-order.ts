// Vuetify 4 の CSS 層の優先順位を、HTML の <head> の先頭で宣言する。
//
// CSS 層の優先度は最初に出現した順で決まる。Vuetify 自身も順序を宣言しているが、
// - dev では Vite がコンポーネントごとの CSS (VApp.css など) を vuetify/styles より先に挿入する
// - build では `@use "vuetify/styles"` が vuetify-components 層 (.blockquote) を順序宣言より先に出力する
// ため、vuetify-core (リセット等) がコンポーネントより強くなってしまう。
// どの CSS よりも先に出力されるよう、レンダリング後の HTML の head 先頭に差し込む。
const LAYER_ORDER = '<style>@layer vuetify-core, vuetify-components, vuetify-overrides, vuetify-utilities, vuetify-final;</style>'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    html.head.unshift(LAYER_ORDER)
  })
})
