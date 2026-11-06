FROM node:26-slim

WORKDIR /usr/src/app

COPY . ./
RUN corepack enable && corepack install
RUN pnpm install --frozen-lockfile

EXPOSE 8080

ENV HOST=0.0.0.0
ENV PORT=8080
ENV HUSKY=0

RUN pnpm run build

CMD [ "node", "./output/server/index.mjs" ]
