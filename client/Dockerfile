FROM node:20.17.0-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install
ARG VITE_SOCKET_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

COPY . .

RUN npm run build

FROM nginx:latest AS serve

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
