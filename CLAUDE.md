# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリのコードを扱う際のガイドである。

## コマンド

パッケージマネージャは **pnpm** (`packageManager: pnpm@12.3.4`、Node は `.node-version` の 26.13.0)。README の yarn 記載は古い。

- `pnpm dev` — `nuxt dev --dotenv .env.local` (ポート 8000)
- `pnpm build` / `pnpm generate` / `pnpm start`
- `pnpm lint` (`eslint --fix .`) / `pnpm lint:nofix` (`eslint .`)
- husky の pre-commit で lint-staged が `*.{js,ts,vue}` に `eslint --fix` を実行する
- `pnpm test` (jest) は **実質機能しない**。設定が Nuxt 2 時代のもの (`vue-jest`、`<rootDir>/components` 参照) で、テストファイルも存在しない
- バックエンド API のベース URL は `NUXT_PUBLIC_API_BASE` (`.env` は `https://api.mofecoder.com/api`)。ローカル用スタブは `kichi2004/cafecoder-stub` (README 参照)

## アーキテクチャ

Nuxt 4 (`compatibilityVersion: 4`) + Vuetify 4 + Pinia。ソースは `app/` 配下。

- **API 層**: `app/utils/apis/*.ts` で、`Api` クラス (`app/types/api.ts`) のインスタンスとしてエンドポイント (path / method / options) を宣言する。`.POST` などの getter でメソッド違いを派生させる。
  - 呼び出しは `useApi(api, args, options, body)` (`composables/useApi.ts`) → `useHttp` (`composables/useHttp.ts`) → `useFetch`。composable 外では `utils/api.ts` の `api()`。
  - `useHttp` は cookie (`AUTH_COOKIE_NAME`) の認証トークン (client / accessToken / uid) をヘッダーに付与し、リクエスト body を snake_case、レスポンスを camelCase に自動変換 (`utils/http.ts`)。401 で `userStore.signOut()` と cookie 削除を行い、`useLoadingIndicator` と連動する。
  - devise token auth 風のヘッダーローテーションは `store/user.ts` の `onResponse` が cookie を更新して処理する。
- **状態管理**: `app/store/` の Pinia ストア (`user.ts`, `contest.ts`)。
- **認証**: `middleware/user.global.ts` が全ルートで `fetchUser()` を実行。`authenticated.ts` (要ログイン) と `admin.ts` (role が admin) がページ単位のガード。
- **SSR 設定** (`nuxt.config.ts` の `routeRules`): `/admin/**` と `/manage/**` は `ssr: false`、`/privacy_policy` は prerender。
- **UI**: Vuetify 4 (`vite-plugin-vuetify` を `vite:extendConfig` フックで追加)。`vite.optimizeDeps.include` に VOverlay などが入っているのは Vuetify 4 の z-index 問題の回避策なので削除しない。
- **Markdown / 数式 / エディタ**: `plugins/markdownit.ts` + `components/MarkdownContent.vue` (markdown-it + texmath + KaTeX + highlight.js)。KaTeX の脆弱性は pnpm override で対応済み。コードエディタは CodeMirror 5 (`plugins/codemirror.client.ts`, `components/CodeEditor.vue`)。
- **レイアウト / ページ**: `layouts/` は default / contest / top の 3 種。コンテスト配下は `pages/contests/[contestName]/` と `components/contests/`、管理画面は `pages/manage/` と `components/manage/`。
- 定数は `app/constants/`、型は `app/types/` に集約。`app/types/contestAdmin.js` と `contestAdmin.ts` が重複して存在する (`.js` は CommonJS 形式のコンパイル残骸)。型は `.ts` 側を編集すること。

## 規約

- ESLint は flat config (`eslint.config.mjs`) + `@nuxt/eslint` (`.nuxt/eslint.config.mjs` を拡張するため、初回は `nuxt prepare` 等で `.nuxt` の生成が必要)。
- コミットメッセージ・コメントは日本語。
- Docker ビルドも pnpm を使用 (`Dockerfile`、`--frozen-lockfile`)。
