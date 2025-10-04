FROM node:22-slim

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install --prod --frozen-lockfile

COPY . ./

EXPOSE 8080

ENV HOST=0.0.0.0
ENV PORT=8080
ENV HUSKY=0

RUN pnpm run build

CMD [ "node", "./output/server/index.mjs" ]
