// すべての応答にセキュリティ関連のヘッダーを付ける。
//
// CSP はまだ Report-Only (違反してもブロックせず、ブラウザのコンソールに報告するだけ) にしている。
// 違反が出ないことを本番で確かめてから Content-Security-Policy に切り替える。
// script-src / style-src の 'unsafe-inline' は、Nuxt の SSR が埋め込むインラインのスクリプト
// (__NUXT_DATA__ など) と Vuetify のインラインスタイルのために必要。

// URL から origin を取り出す。未設定や不正な値なら null
function originOf(url: string | undefined): string | null {
  if (!url) return null
  try {
    return new URL(url).origin
  } catch {
    return null
  }
}

function buildCsp(apiOrigins: string[]): string {
  const connectSrc = [
    "'self'",
    ...apiOrigins,
    // 画像アップロードの署名付き URL への PUT (本番は Cloudflare R2)
    'https://*.r2.cloudflarestorage.com',
    // Google Analytics (vue-gtag)
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    'https://www.googletagmanager.com'
  ]
  if (import.meta.dev) {
    // 開発の画像アップロード先 (backend の compose の SeaweedFS) と Vite の HMR
    connectSrc.push('http://s3.localhost:8333', 'ws://localhost:*')
  }

  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      'https://www.googletagmanager.com',
      // トップページのフォローボタン
      'https://platform.twitter.com'
    ],
    // Google Fonts (app/styles/style.scss の Roboto)
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    // 問題文の画像は外部の URL も書けるので https は許可する
    'img-src': ["'self'", 'data:', 'blob:', 'https:'],
    'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
    'connect-src': connectSrc,
    // トップページのフォローボタンは iframe で表示される
    'frame-src': ['https://platform.twitter.com'],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'object-src': ["'none'"]
  }

  return Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(' ')}`)
    .join('; ')
}

export default defineNitroPlugin((nitroApp) => {
  // API の URL は実行時の環境変数 (NUXT_PUBLIC_API_BASE など) で決まるので、ビルド時ではなくここで読む
  const config = useRuntimeConfig()
  const apiOrigins = [
    ...new Set(
      [config.public.apiBase, config.public.apiV4Base]
        .map(url => originOf(url as string | undefined))
        .filter((origin): origin is string => origin !== null)
    )
  ]

  const headers = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy-Report-Only': buildCsp(apiOrigins)
  }

  nitroApp.hooks.hook('request', (event) => {
    setResponseHeaders(event, headers)
  })
})
