## Accounts generations for the nodes !
# Wroting passwords to files
echo $NODE1_ACCOUNT_PASSWORD > node1/password.txt
echo $NODE2_ACCOUNT_PASSWORD > node2/password.txt

# Generating account for the node 1 (signer)
geth account new --datadir node1 --password node1/password.txt | grep "Public address of the key" > node1.pass

# Generating account for the node 2
geth account new --datadir node2 --password node2/password.txt | grep "Public address of the key" > node2.pass


## Genesis.json
# Replacement of the generated accounts
NODE1_PUBLIC__ADDR=$(python /script/tools.py address node1.pass)
NODE2_PUBLIC__ADDR=$(python /script/tools.py address node2.pass)

python /script/tools.py replace genesis.json 'NETWORK_ID' ${NETWORK_ID}
python /script/tools.py replace genesis.json 'NODE1_PUBLIC__ADDR' ${NODE1_PUBLIC__ADDR}
python /script/tools.py replace genesis.json 'NODE2_PUBLIC__ADDR' ${NODE2_PUBLIC__ADDR}
python /script/tools.py replace genesis.json 'INITIAL_SIGNER__ADDRESS' ${NODE1_PUBLIC__ADDR:2}


geth --datadir node1 init genesis.json
geth --datadir node2 init genesis.json

bootnode -genkey bnode/boot.key
ENODE=$(bootnode -nodekeyhex $(cat bnode/boot.key) -writeaddress)

## Runners
RUNNER_1="geth --datadir node1 --port 30306 --bootnodes enode://${ENODE}@127.0.0.1:0?discport=30305 --networkid ${NETWORK_ID} --unlock ${NODE1_PUBLIC__ADDR} --password node1/password.txt --authrpc.port 8551 --mine --miner.etherbase ${NODE1_PUBLIC__ADDR}"
RUNNER_2="geth --datadir node2 --port 30307 --bootnodes enode://${ENODE}@127.0.0.1:0?discport=30305 --networkid ${NETWORK_ID} --unlock ${NODE2_PUBLIC__ADDR} --password node2/password.txt --authrpc.port 8552"
RUNNER_BN="bootnode -nodekey bnode/boot.key -verbosity 7 -addr :30305"
# echo ${RUNNER_1}
echo ${RUNNER_2}
${RUNNER_BN}
# ${RUNNER_BN} & ${RUNNER_1} & ${RUNNER_2}
