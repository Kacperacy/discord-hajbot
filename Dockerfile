FROM alpine

RUN apk add --update nodejs npm
WORKDIR /app
COPY package*.json ./
COPY package-lock.json ./
RUN npm ci
COPY . .

ENV NODE_ENV=production
ENV IS_HOSTED=true

ENTRYPOINT npm run start:test