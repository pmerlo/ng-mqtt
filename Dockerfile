FROM node

RUN npm install -g @angular/cli

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200

CMD ["ng" , "serve"]
