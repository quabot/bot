# syntax=docker/dockerfile:1

FROM node:20.5

WORKDIR /app

COPY . .

RUN yarn deploy
EXPOSE 8081

CMD ["yarn", "start"]
