import { Component, Vue } from 'nuxt-property-decorator'

declare global {
  interface Window {
    MathJax: any
  }
}

@Component
export default class MathJax extends Vue {
  renderMathJax() {
    if (window.MathJax) {
      window.MathJax.Hub.Config({
        TeX: { equationNumbers: { autoNumber: 'AMS' } },
        tex2jax: {
          inlineMath: [
            ['$', '$'],
            ['\\(', '\\)']
          ],
          displayMath: [
            ['$$', '$$'],
            ['\\[', '\\]']
          ],
          processEscapes: true,
          skipTags: ['script', 'noscript', 'style', 'textarea']
        },
        'HTML-CSS': { matchFontHeight: false },
        displayAlign: 'center',
        displayIndent: '2em'
      })
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
    }
  }
}
