FROM node:16.13.0-buster as builder

WORKDIR /home/node

ADD . .

RUN chown -R node:node /home/node/

USER node

ARG REACT_APP_CHAIN_ID=1285
ARG REACT_APP_RPC_URL=https://rpc.api.moonriver.moonbeam.network
ARG REACT_APP_SUBGRAPH_URL=https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/marketplacev2
ARG REACT_APP_NFT_SUBGRAPH_URL=https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft
ARG REACT_APP_BACKEND_API_URL=https://minecraft-metaverse-api.moonsama.com/api/v1
ARG REACT_APP_COMPOSITE_MEDIA_URI_PREFIX=https://dev.static.moonsama.com

RUN yarn

WORKDIR /home/node/packages/minecraft-oracle-ui

RUN yarn build

FROM nginxinc/nginx-unprivileged:1.21.6-alpine

ADD packages/minecraft-oracle-ui/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /home/node/packages/minecraft-oracle-ui/build/ /usr/share/nginx/html
