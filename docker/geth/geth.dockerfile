FROM ethereum/client-go:alltools-latest

EXPOSE 8545 8546 30303

RUN mkdir -p /ethereum

WORKDIR /ethereum

ADD runner.sh /script/
ADD genesis.json .

CMD ["sh" , "/script/runner.sh"]