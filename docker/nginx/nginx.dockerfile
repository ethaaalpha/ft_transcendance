FROM nginx:stable-alpine

ARG DOMAIN

RUN apk add openssl && mkdir -p /etc/ssl/keys && mkdir -p /etc/ssl/certs/
RUN openssl req -x509 -nodes -newkey rsa:2048 -keyout "/etc/ssl/keys/${DOMAIN}.key" -out "/etc/ssl/certs/${DOMAIN}.crt" -subj "/C=fr/ST=Rhone/L=Lyon/O=PongPong/CN=localhost"

COPY ${DOMAIN}.conf /etc/nginx/nginx.conf

ADD runner.sh .

EXPOSE 443
CMD ["sh", "runner.sh"]
