FROM node:18-bullseye
WORKDIR /app
ENV NODE_ENV=production


COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

EXPOSE 1337 8545

CMD ["npx", "infinitymint", "--start-ganache", "true", "--stay-open", "true", "--start-express", "false"]

FROM node:18-bullseye
WORKDIR /express
ENV NODE_ENV=production

COPY package*.json .