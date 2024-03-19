## Accounts generations for the nodes !
# Wroting passwords to files
echo $NODE1_ACCOUNT_PASSWORD > node1/password.txt
echo $NODE2_ACCOUNT_PASSWORD > node2/password.txt

echo 'Generating nodes accounts'
# Generating account for the node 1 (signer)
geth account new --datadir node1 --password node1/password.txt 2> temp | grep "Public address of the key" > keys_acc/node1.key

# Generating account for the node 2
geth account new --datadir node2 --password node2/password.txt 2> temp| grep "Public address of the key" > keys_acc/node2.key

# Tests accounts !
echo 'Generating tests accounts'
geth account new --datadir node2 --password node2/password.txt 2> temp | grep "Public address of the key" > keys_acc/test1.key
geth account new --datadir node2 --password node2/password.txt 2> temp | grep "Public address of the key" > keys_acc/test2.key
geth account new --datadir node2 --password node2/password.txt 2> temp | grep "Public address of the key" > keys_acc/test3.key
geth account new --datadir node2 --password node2/password.txt 2> temp | grep "Public address of the key" > keys_acc/test4.key
geth account new --datadir node2 --password node2/password.txt 2> temp | grep "Public address of the key" > keys_acc/test5.key


## Genesis.json & Accounts
# Replacement of the generated accounts
echo 'Editing genesis.json file !'
NODE1_PUBLIC__ADDR=$(python /script/tools.py address keys_acc/node1.key)
NODE2_PUBLIC__ADDR=$(python /script/tools.py address keys_acc/node2.key)
TEST1_ACCOUNT__ADDR=$(python /script/tools.py address keys_acc/test1.key)
TEST2_ACCOUNT__ADDR=$(python /script/tools.py address keys_acc/test2.key)
TEST3_ACCOUNT__ADDR=$(python /script/tools.py address keys_acc/test3.key)
TEST4_ACCOUNT__ADDR=$(python /script/tools.py address keys_acc/test4.key)
TEST5_ACCOUNT__ADDR=$(python /script/tools.py address keys_acc/test5.key)

python /script/tools.py replace genesis.json 'NETWORK_ID' ${NETWORK_ID}
python /script/tools.py replace genesis.json 'NODE1_PUBLIC__ADDR' ${NODE1_PUBLIC__ADDR}
python /script/tools.py replace genesis.json 'NODE2_PUBLIC__ADDR' ${NODE2_PUBLIC__ADDR}
python /script/tools.py replace genesis.json 'TEST1_ACCOUNT__ADDR' ${TEST1_ACCOUNT__ADDR}
python /script/tools.py replace genesis.json 'TEST2_ACCOUNT__ADDR' ${TEST2_ACCOUNT__ADDR}
python /script/tools.py replace genesis.json 'TEST3_ACCOUNT__ADDR' ${TEST3_ACCOUNT__ADDR}
python /script/tools.py replace genesis.json 'TEST4_ACCOUNT__ADDR' ${TEST4_ACCOUNT__ADDR}
python /script/tools.py replace genesis.json 'TEST5_ACCOUNT__ADDR' ${TEST5_ACCOUNT__ADDR}
python /script/tools.py replace genesis.json 'INITIAL_SIGNER__ADDRESS' ${NODE1_PUBLIC__ADDR:2}

printf "${TEST1_ACCOUNT__ADDR}\n${TEST2_ACCOUNT__ADDR}\n${TEST3_ACCOUNT__ADDR}\n${TEST4_ACCOUNT__ADDR}\n${TEST5_ACCOUNT__ADDR}\n" > accounts.txt
# Nodes inits
echo 'Initializing nodes !'
geth --datadir node1 init genesis.json
geth --datadir node2 init genesis.json
geth --datadir node3 init genesis.json

bootnode -genkey bnode/boot.key
ENODE=$(bootnode -nodekeyhex $(cat bnode/boot.key) -writeaddress)

## Runners
echo 'Running bootnode and nodes !'
RUNNER_1="geth --datadir node1 --port 30306 --bootnodes enode://${ENODE}@127.0.0.1:0?discport=30305 --networkid ${NETWORK_ID} --unlock ${NODE1_PUBLIC__ADDR} --password node1/password.txt --authrpc.port 8546 --mine --miner.etherbase ${NODE1_PUBLIC__ADDR}"
RUNNER_2="geth --datadir node2 --port 30307 --bootnodes enode://${ENODE}@127.0.0.1:0?discport=30305 --networkid ${NETWORK_ID} --unlock ${NODE2_PUBLIC__ADDR} --password node2/password.txt --http --allow-insecure-unlock --http.corsdomain '*' --http.port 8545 --http.addr 0.0.0.0"

RUNNER_BN="bootnode -nodekey bnode/boot.key -addr :30305"
${RUNNER_BN} & ${RUNNER_1} & ${RUNNER_2}
