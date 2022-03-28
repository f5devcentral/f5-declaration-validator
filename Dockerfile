# syntax=docker/dockerfile:1

# https://simplernerd.com/docker-typescript-production/


FROM node:14-alpine3.10 as ts-compiler
# FROM node:14.18.2
# ENV NODE_ENV=production

# USER node

WORKDIR /app

# RUN chown node /app

COPY ["package.json", "package-lock.json*", "./"]

# RUN npm install --production
RUN npm ci

COPY . .

RUN npm run compile


FROM node:14-alpine3.10 as ts-remover
WORKDIR /app
COPY --from=ts-compiler /app/package*.json ./
COPY --from=ts-compiler /app/dist ./
RUN npm install --only=production


FROM gcr.io/distroless/nodejs:14
EXPOSE 3030
COPY --from=ts-remover /app ./
USER 1000
# CMD [ "npm", "run", "start" ]
CMD [ "app.js" ]

STOPSIGNAL SIGQUIT

