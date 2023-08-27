# syntax=docker/dockerfile:1

FROM node:18.17

WORKDIR /app

COPY . .

RUN yarn deploy
EXPOSE 8081

CMD ["yarn", "start"]
