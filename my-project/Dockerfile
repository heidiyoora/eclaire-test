FROM strapi/base:14

RUN apt-get update -y && apt-get install -y jq

ARG NODE_ENV
ARG RELEASE

ENV NODE_ENV=${NODE_ENV}
ENV RELEASE=${RELEASE}

COPY . /srv/app

RUN yarn global add strapi@$(cat /srv/app/package.json | jq -r .dependencies.strapi)

WORKDIR /srv/app/plugins/magine
RUN npm install

WORKDIR /srv/app
RUN yarn install

RUN strapi build

CMD ["strapi", "start"]
