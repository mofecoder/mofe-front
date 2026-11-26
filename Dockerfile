# ビルド段: 依存をインストールして Nuxt をビルドする
FROM node:26-slim AS build

WORKDIR /usr/src/app

# prepare スクリプトの husky を動かさない (.git はイメージに入れていない)
ENV HUSKY=0

RUN npm install -g corepack && corepack enable

# 依存の定義だけを先にコピーして、ソースの変更でインストールのキャッシュが無効にならないようにする
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack install && pnpm install --frozen-lockfile

COPY . ./
RUN pnpm run build

# 実行段: ビルド結果 (.output) だけを持つ。ソースや node_modules、秘密情報は含めない
FROM node:26-slim

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

COPY --from=build --chown=node:node /usr/src/app/.output ./.output

# root ではなく node ユーザーで動かす
USER node

EXPOSE 8080

CMD [ "node", "./.output/server/index.mjs" ]
