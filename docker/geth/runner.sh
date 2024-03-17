## Accounts generations for the nodes !
# Generating account for the node 1 (signer)
geth account new --datadir node1 --password <(echo $NODE1_ACCOUNT_PASSWORD) | grep "Public address of the key" > node1.pass

# Generating account for the node 2
geth account new --datadir node2 --password <(echo $NODE2_ACCOUNT_PASSWORD) | grep "Public address of the key" > node2.pass


## Genesis.json
# Replacement of the generated accounts
NODE1_PUBLIC__ADDR=$(python /script/tools.py address node1.pass)
NODE2_PUBLIC__ADDR=$(python /script/tools.py address node2.pass)

python /script/tools.py replace genesis.json 'NETWORK_ID' ${NETWORK_ID}
python /script/tools.py replace genesis.json 'NODE1_PUBLIC__ADDR' ${NODE1_PUBLIC__ADDR}
python /script/tools.py replace genesis.json 'NODE2_PUBLIC__ADDR' ${NODE2_PUBLIC__ADDR}

geth --datadir node1 init genesis.json
geth --datadir node2 init genesis.json

bootnode -genkey bnode/boot.key
bootnode -nodekey bnode/boot.key -addr :30305

#RECUPERER LE BOOTNODE

# cat genesis.json
# geth --datadir data init genesis.json
# geth --datadir data --http --http.addr "0.0.0.0" --http.port "8545" --http.api "eth,web3,personal,net" --networkid 1234 console

# geth account new --datadir data --password <(echo $SIGNER_ACCOUNT_PASSWORD)
# geth --datadir data2 --networkid 12345 --port 30305 --unlock 0x0000000000000000000000000000000000000001 --mine
# geth --unlock 0x0000000000000000000000000000000000000001 --mine
# geth --datadir=data/
# geth account list --datadir signer > password