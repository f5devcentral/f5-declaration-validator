# syntax=docker/dockerfile:1

FROM node:14.18.2
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

EXPOSE 3030

CMD [ "npm", "run", "server" ]

STOPSIGNAL SIGQUIT