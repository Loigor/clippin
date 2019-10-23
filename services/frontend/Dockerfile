FROM node:12

WORKDIR /usr/src/app

COPY package.json .
COPY tsconfig.json .
COPY ./public ./public
COPY ./src ./src

RUN npm i
EXPOSE 3000
EXPOSE 35729
CMD ["npm", "start"]