FROM node:alpine

ADD runner.sh /data/
ADD hardhat.config.js /data/

WORKDIR /app/

CMD [ "sh", "/data/runner.sh"]