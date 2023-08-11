# syntax=docker/dockerfile:1

FROM node:18.17

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 8081

CMD ["yarn", "start"]
