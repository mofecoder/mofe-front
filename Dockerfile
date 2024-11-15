FROM node:22-slim

WORKDIR /usr/src/app

COPY . ./
RUN npm ci

EXPOSE 8080

ENV HOST=0.0.0.0
ENV PORT=8080
ENV HUSKY=0

RUN npm run build

CMD [ "node", "./output/server/index.mjs" ]
