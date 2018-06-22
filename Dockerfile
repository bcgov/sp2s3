FROM node:10-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY . /usr/src/app
RUN rm -rf node_modules && npm install

CMD [ "npm", "start" ]