FROM node:14

WORKDIR /app

COPY . .

RUN npm install

#RUN npm install -g http-server

RUN npm install pm2 -g

EXPOSE 8082

#CMD ["nohup", "http-server", "&"]

CMD ["nohup", "node", "index.js", "&"]

#CMD ["pm2", "start", "index.js"]
