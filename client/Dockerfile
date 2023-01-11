FROM node:12-alpine

RUN apk update && apk add --no-cache python make gcc g++ bash
USER node
RUN echo "alias ll='ls -la'" >> ~/.bashrc
EXPOSE 9229
RUN mkdir /home/node/app
WORKDIR /home/node/app

CMD sh
