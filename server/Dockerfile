FROM node:20.17.0-alpine AS builder

WORKDIR /src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:20.17.0-alpine
WORKDIR /src/app

COPY --from=builder /src/app/dist ./dist
COPY --from=builder /src/app/node_modules ./node_modules
COPY package.json ./

ENV NODE_ENV=production

EXPOSE 5000
CMD ["node", "dist/server.js"]