FROM node:16.13.0-buster

WORKDIR /home/node

ADD . .

RUN chown -R node:node /home/node/

USER node

RUN yarn

ENTRYPOINT ["/home/node/start.sh","minecraft-oracle-api"]
