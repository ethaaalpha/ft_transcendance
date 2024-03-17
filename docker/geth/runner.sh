# cat genesis.json
geth --datadir data init genesis.json
geth --datadir data --http --http.addr "0.0.0.0" --http.port "8545" --http.api "eth,web3,personal,net" --networkid 1234 console

# geth account new --datadir data --password <(echo $SIGNER_ACCOUNT_PASSWORD)
# geth --datadir data2 --networkid 12345 --port 30305 --unlock 0x0000000000000000000000000000000000000001 --mine
# geth --unlock 0x0000000000000000000000000000000000000001 --mine
# geth --datadir=data/