FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development \
    CHOKIDAR_USEPOLLING=true \
    WATCHPACK_POLLING=true

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000 9229

CMD ["npm", "run", "start:dev"]
