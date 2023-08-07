FROM node:18-bullseye
WORKDIR /app
ENV NODE_ENV=production


COPY package*.json ./
RUN npm ci --omit=dev
COPY . /app

EXPOSE 80 3000

CMD ["npm", "start"]
