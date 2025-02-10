FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN rm -rf node_modules
RUN npm install

COPY . .

RUN rm -rf dist

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
