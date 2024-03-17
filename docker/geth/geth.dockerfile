FROM ethereum/client-go:alltools-latest

RUN apk add --no-cache python3 py3-pip
RUN mkdir -p /ethereum

WORKDIR /ethereum

ADD runner.sh /script/
ADD tools.py /script/
ADD genesis.json .

CMD ["sh" , "/script/runner.sh"]