# build
FROM node:14 as build

LABEL author="Gustavo Arantes" maintainer="me@arantes.dev"

WORKDIR /build
COPY . .

RUN npm install

# production
FROM node:14-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --production

COPY --from=build /build/src .

CMD ["app.js"]