FROM ethereum/client-go:alltools-stable

RUN apk add --no-cache python3 py3-pip
RUN mkdir -p /ethereum

WORKDIR /ethereum

ADD runner.sh /script/
ADD tools.py /script/
ADD genesis.json .
RUN mkdir -p bnode node1 node2 node3


# 30305 -> bnode | Others nodes 8551 8552 | HTTP Node 8545
EXPOSE 30305 8551 8545 8546

CMD ["sh" , "/script/runner.sh"]