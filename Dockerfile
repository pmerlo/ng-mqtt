FROM node:14.16.0-alpine3.12

RUN npm install -g http-server

WORKDIR /usr/app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build --prod

WORKDIR /usr/app/dist/ng-mqtt

EXPOSE 8080

CMD ["http-server"]
