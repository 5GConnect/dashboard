FROM node:16

COPY . /app

WORKDIR /app

RUN npm run install

RUN npm install -g serve

RUN npm run build:prod

CMD serve -s dist
