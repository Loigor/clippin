FROM node:12
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm i -g schemats

CMD ["npm", "start"]