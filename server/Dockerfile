FROM node:20.17.0-alpine

WORKDIR /src/app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]
