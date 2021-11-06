FROM node:16.13.0-buster

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm \
    npm install -g @microsoft/rush@5.54.0 \
    npm install -g ts-node@10.4.0


WORKDIR /home/node

ADD . .

RUN chown -R node:node /home/node/

USER node

RUN rush update 

RUN rush build

ENTRYPOINT ["/home/node/start.sh","minecraft-oracle-api"]
