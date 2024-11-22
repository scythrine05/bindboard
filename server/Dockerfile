FROM node:20.17.0-alpine AS builder

WORKDIR /src/app

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

COPY package.json package-lock.json ./

RUN if [ "$NODE_ENV" = "development" ]; then npm install; else npm install --only=production; fi

COPY . .

RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# Production stage
FROM node:20.17.0-alpine
WORKDIR /src/app

COPY --from=builder /src/app/dist ./dist
COPY --from=builder /src/app/node_modules ./node_modules
COPY package.json ./

ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "run", "start"]
