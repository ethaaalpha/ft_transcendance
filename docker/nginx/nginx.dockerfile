FROM nginx:stable-alpine

ARG DOMAIN

RUN apk add openssl && mkdir -p /etc/ssl/keys && mkdir -p /etc/ssl/certs/
RUN openssl req -x509 -nodes -newkey rsa:2048 -keyout "/etc/ssl/keys/${DOMAIN}.key" -out "/etc/ssl/certs/${DOMAIN}.crt" -subj "/C=fr/ST=Rhone/L=Lyon/O=PongPong/CN=localhost"

COPY ${DOMAIN}.conf /etc/nginx/nginx.conf

ADD https://github.com/mrdoob/three.js/archive/refs/tags/r162.tar.gz .
RUN tar -xvzf r162.tar.gz
RUN mv three.js-r162/ three
RUN mv three usr/share/libs/

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
