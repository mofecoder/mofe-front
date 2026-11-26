// cookie 名は Firebase Hosting が __session 以外の cookie をサーバーに渡さないため、この名前にしている
export const AUTH_COOKIE_NAME = '__session'

// 認証 cookie の属性
// - secure: HTTPS でだけ送る。開発 (http://localhost) では付けると保存されないので外す
// - sameSite: 他サイトからのリクエストには付けない (トップレベルの遷移では送る)
// 削除するときも属性 (特に path) を揃える必要があるので、読み書きする箇所ではすべてこれを使う
export const AUTH_COOKIE_OPTIONS = {
  secure: !import.meta.dev,
  sameSite: 'lax',
  path: '/'
} as const
