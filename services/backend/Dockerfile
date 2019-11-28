FROM node:12
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm i -g schemats
#COPY ./wait-for-it.sh /wait-for-it.sh
COPY ./gcloud-credentials.json /gcloud-credentials.json
#CMD ["/wait-for-it.sh", "postgres:5432", "--", "npm", "start"]
CMD ["npm", "start"]