FROM ethereum/client-go:alltools-v1.13.8

RUN apk add python3 py3-pip && rm /usr/lib/python3.11/EXTERNALLY-MANAGED

ADD requirements.txt .
RUN pip install  -r requirements.txt
RUN mkdir -p /ethereum

WORKDIR /ethereum

ADD runner.sh /script/
ADD tools.py /script/
ADD genesis.json .
RUN mkdir -p bnode node1 node2 keys_acc


# 30305 -> bnode | Others nodes 8551 8552 | HTTP Node 8545
EXPOSE 30305 8551 8545 8546

CMD ["sh" , "/script/runner.sh"]