# Dockerfile for frontend React app

FROM node:20.17.0-alpine 

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Run the Vite development server
CMD ["npm", "run", "dev"]