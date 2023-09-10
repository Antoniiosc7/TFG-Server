FROM node:14

WORKDIR /app

COPY . .

RUN npm install

#RUN npm install -g http-server

EXPOSE 80

#CMD ["nohup", "http-server", "&"]

CMD ["nohup", "node", "index.js", "&"]
