FROM node:20.17.0-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .
COPY .env.production /app/.env

RUN npm run build

FROM nginx:latest AS serve

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
