FROM node:16

COPY . /app

WORKDIR /app

RUN npm run install

RUN npm install -g serve

CMD npm run build:prod

CMD serve -s dist
