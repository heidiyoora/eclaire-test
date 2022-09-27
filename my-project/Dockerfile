# FROM strapi/base:14
FROM node:14

RUN apt-get update -y && apt-get install -y jq curl

ARG NODE_ENV
ARG RELEASE

ENV NODE_ENV=${NODE_ENV}
ENV RELEASE=${RELEASE}
# ENV NODE_VERSION 14.19.3

COPY . /srv/app

RUN npm install -g --unsafe-perm @strapi/strapi@$(cat /srv/app/package.json | jq -r '.dependencies."@strapi/strapi"')

WORKDIR /srv/app
RUN yarn install

RUN strapi build

CMD ["strapi", "start"]
