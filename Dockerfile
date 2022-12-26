FROM node:10-alpine
ARG pat
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copies package.json and package-lock.json to Docker environment
COPY package.json ./
COPY yarn.lock ./
COPY .npmrc ./

RUN touch ~/.npmrc
RUN echo "; begin auth token" >> ~/.npmrc
RUN echo "//pkgs.dev.azure.com/suporte0667/NoCond/_packaging/NoCond/npm/registry/:username=suporte0667" >> ~/.npmrc
RUN echo "//pkgs.dev.azure.com/suporte0667/NoCond/_packaging/NoCond/npm/registry/:_password=$pat" >> ~/.npmrc
RUN echo "//pkgs.dev.azure.com/suporte0667/NoCond/_packaging/NoCond/npm/registry/:email=npm requires email to be set but doesn't use the value" >> ~/.npmrc
RUN echo "//pkgs.dev.azure.com/suporte0667/NoCond/_packaging/NoCond/npm/:username=suporte0667" >> ~/.npmrc
RUN echo "//pkgs.dev.azure.com/suporte0667/NoCond/_packaging/NoCond/npm/:_password=$pat" >> ~/.npmrc
RUN echo "//pkgs.dev.azure.com/suporte0667/NoCond/_packaging/NoCond/npm/:email=npm requires email to be set but doesn't use the value" >> ~/.npmrc
RUN echo "; end auth token" >> ~/.npmrc

RUN apk update && apk add yarn python g++ make && rm -rf /var/cache/apk/*
RUN yarn install

COPY . /usr/src/app
RUN yarn build:all

ENV NODE_ENV docker

EXPOSE 80

CMD [ "yarn", "server" ]