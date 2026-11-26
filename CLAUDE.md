# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリのコードを扱う際のガイドである。

## コマンド

パッケージマネージャは **pnpm** (`packageManager: pnpm@12.3.4`、Node は `.node-version` の 26.13.0)。README の yarn 記載は古い。

- `pnpm dev` — `nuxt dev --dotenv .env.local` (ポート 8000)
- `pnpm build` / `pnpm generate` / `pnpm start`
- `pnpm lint` (`eslint --fix .`) / `pnpm lint:nofix` (`eslint .`)
- husky の pre-commit で lint-staged が `*.{js,ts,vue}` に `eslint --fix` を実行する
- 自動テストはない (Nuxt 2 時代の jest の設定は動かなかったので削除した)。変更の確認は `pnpm lint:nofix` と `pnpm build`、必要ならブラウザで行う
- バックエンド API のベース URL は `NUXT_PUBLIC_API_BASE` (`.env` は `https://api.mofecoder.com/api`)。ローカル用スタブは `kichi2004/cafecoder-stub` (README 参照)

## アーキテクチャ

Nuxt 4 (`compatibilityVersion: 4`) + Vuetify 4 + Pinia。ソースは `app/` 配下。

- **API 層**: 共通クライアント `$api` (`plugins/api.ts`、`$fetch.create`) と、`app/utils/apis/*.ts` の repository 関数 (`contestsApi()`、`manageProblemsApi()` など) で構成する。
  - `$api` は v1 (`/api/`、`NUXT_PUBLIC_API_BASE`)、`$apiV4` は v4 (`/v4/`、`NUXT_PUBLIC_API_V4_BASE`) を呼ぶ。処理 (認証・ケース変換・401) は共通で baseURL だけが違う。v4 を使う repository は `useNuxtApp().$apiV4` を使う (例: `uploadsApi()`)。
  - repository 関数は名前付き引数を受け取り `$api` を呼ぶ。パスパラメータが 2 つ以上なら `{ problemId, testcaseId }` のような名前付きのオブジェクトで受ける。factory (`xxxApi()`) は内部で `useNuxtApp()` を使うので、setup や action の先頭 (await の前) で呼ぶ。
  - setup 直下での取得は `useAsyncData(key, () => repo.xxx())`。引数が reactive なら key を関数にして条件を含める。イベントハンドラや store の action では直接 `await` して `try/catch` する (ハンドラ内で `useFetch` / `useAsyncData` を使わない)。
  - `$api` は cookie (`AUTH_COOKIE_NAME`) の認証トークンをヘッダーに付与し、JSON の body を snake_case、JSON のレスポンスを camelCase に変換する (`utils/http.ts`)。**query は変換しない**ので、repository でワイヤー上のキー (`exclude_open`、`task[]` など) を書く。
  - レスポンスに認証ヘッダーがあれば cookie を更新し、401 ならユーザー状態と cookie を消す。`useLoadingIndicator` とも連動する。
  - エラーは backend の統一形式 `{ error, details? }` (`types/apiError.ts`)。`utils/apiError.ts` の `getErrorMessage(e, fallback)` / `getErrorStatus(e)` で読む (`FetchError` と `useAsyncData` の `error` の両方に使える)。
- **状態管理**: `app/store/` の Pinia ストア (`user.ts`, `contest.ts`)。
- **認証**: `middleware/user.global.ts` が全ルートで `fetchUser()` を実行。`authenticated.ts` (要ログイン) と `admin.ts` (role が admin) がページ単位のガード。
- **SSR 設定** (`nuxt.config.ts` の `routeRules`): `/admin/**` と `/manage/**` は `ssr: false`、`/privacy_policy` は prerender。
- **UI**: Vuetify 4 (`vite-plugin-vuetify` を `vite:extendConfig` フックで追加)。`vite.optimizeDeps.include` に VOverlay などが入っているのは Vuetify 4 の z-index 問題の回避策なので削除しない。
- **画像アップロード**: Markdown の編集欄は `components/MarkdownTextarea.vue` (v-textarea のラッパー) を使う。writer / admin にはボタン・ドラッグ＆ドロップ・貼り付けでの画像アップロードが付き、完了するとカーソル位置に `![](公開 URL)` を挿入する。処理は `composables/useImageUpload.ts` (形式とサイズの確認 → JPEG / WebP の再エンコードでメタデータ除去 (`utils/imageSanitizer.ts`) → MD5 → `POST /v4/uploads` → ストレージへ直接 PUT → complete)。ストレージへの PUT は `$api` を通さない。
- **Markdown / 数式 / エディタ**: `plugins/markdownit.ts` + `components/MarkdownContent.vue` (markdown-it + texmath + KaTeX + highlight.js)。KaTeX の脆弱性は pnpm override で対応済み。コードエディタは CodeMirror 5 (`plugins/codemirror.client.ts`, `components/CodeEditor.vue`)。
- **レイアウト / ページ**: `layouts/` は default / contest / top の 3 種。コンテスト配下は `pages/contests/[contestName]/` と `components/contests/`、管理画面は `pages/manage/` と `components/manage/`。
- 定数は `app/constants/`、型は `app/types/` に集約。`app/types/contestAdmin.js` と `contestAdmin.ts` が重複して存在する (`.js` は CommonJS 形式のコンパイル残骸)。型は `.ts` 側を編集すること。

## 規約

- ESLint は flat config (`eslint.config.mjs`) + `@nuxt/eslint` (`.nuxt/eslint.config.mjs` を拡張するため、初回は `nuxt prepare` 等で `.nuxt` の生成が必要)。
- コミットメッセージ・コメントは日本語。
- Docker ビルドも pnpm を使用 (`Dockerfile`、`--frozen-lockfile`)。
