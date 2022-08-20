# syntax=docker/dockerfile:1

# https://simplernerd.com/docker-typescript-production/


# https://towardsdev.com/writing-a-docker-file-for-your-node-js-typescript-micro-service-c5170b957893

FROM node:14-alpine3.10 as builder
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm config set unsafe-perm true
RUN npm install -g typescript
RUN npm install -g ts-node
USER node
RUN npm install
COPY --chown=node:node . .
RUN npm run compile

# STAGE 2
FROM node:14-alpine
# install openssl so we can gen the cert on demand
RUN apk --update add openssl && mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
# copy project from builder
COPY --from=builder /home/node/app ./
# change to node user
USER node
# install node packages production only (no dev-deps)
RUN npm install --production

# this two stage process only cuts down on the node dev-dependencies.  The final container can further be slimmed by only moving the neccessary files for it to run
# package.json package-lock.json and dist/*.js
# https://stackoverflow.com/questions/37715224/copy-multiple-directories-with-one-command

EXPOSE 8443
CMD [ "node", "dist/app.js", "8443" ]