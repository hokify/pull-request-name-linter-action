FROM node:15-alpine

RUN apk --no-cache add git

WORKDIR /app

COPY package*.json ./

RUN npm ci --production

COPY . .

ENTRYPOINT ["/app/entrypoint.sh"]
