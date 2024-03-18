## Accounts generations for the nodes !
# Wroting passwords to files
echo $NODE1_ACCOUNT_PASSWORD > node1/password.txt
echo $NODE2_ACCOUNT_PASSWORD > node2/password.txt
echo $TESTS_ACCOUNT_PASSWORD > test.password.txt

echo 'Generating nodes accounts'
# Generating account for the node 1 (signer)
geth account new --datadir node1 --password node1/password.txt 2> temp | grep "Public address of the key" > node1.pass

# Generating account for the node 2
geth account new --datadir node2 --password node2/password.txt 2> temp| grep "Public address of the key" > node2.pass

# Tests accounts !
echo 'Generating tests accounts'
geth account new --datadir test_accounts --password test.password.txt 2> temp | grep "Public address of the key" > test1.pass
geth account new --datadir test_accounts --password test.password.txt 2> temp | grep "Public address of the key" > test2.pass
geth account new --datadir test_accounts --password test.password.txt 2> temp | grep "Public address of the key" > test3.pass
geth account new --datadir test_accounts --password test.password.txt 2> temp | grep "Public address of the key" > test4.pass
geth account new --datadir test_accounts --password test.password.txt 2> temp | grep "Public address of the key" > test5.pass


## Genesis.json & Accounts
# Replacement of the generated accounts
echo 'Editing genesis.json file !'
NODE1_PUBLIC__ADDR=$(python /script/tools.py address node1.pass)
NODE2_PUBLIC__ADDR=$(python /script/tools.py address node2.pass)
TEST1_ACCOUNT__ADDR=$(python /script/tools.py address test1.pass)
TEST2_ACCOUNT__ADDR=$(python /script/tools.py address test2.pass)
TEST3_ACCOUNT__ADDR=$(python /script/tools.py address test3.pass)
TEST4_ACCOUNT__ADDR=$(python /script/tools.py address test4.pass)
TEST5_ACCOUNT__ADDR=$(python /script/tools.py address test5.pass)

python /script/tools.py replace genesis.json 'NETWORK_ID' ${NETWORK_ID}
python /script/tools.py replace genesis.json 'NODE1_PUBLIC__ADDR' ${NODE1_PUBLIC__ADDR}
python /script/tools.py replace genesis.json 'NODE2_PUBLIC__ADDR' ${NODE2_PUBLIC__ADDR}
python /script/tools.py replace genesis.json 'TEST1_ACCOUNT__ADDR' ${TEST1_ACCOUNT__ADDR}
python /script/tools.py replace genesis.json 'TEST2_ACCOUNT__ADDR' ${TEST2_ACCOUNT__ADDR}
python /script/tools.py replace genesis.json 'TEST3_ACCOUNT__ADDR' ${TEST3_ACCOUNT__ADDR}
python /script/tools.py replace genesis.json 'TEST4_ACCOUNT__ADDR' ${TEST4_ACCOUNT__ADDR}
python /script/tools.py replace genesis.json 'TEST5_ACCOUNT__ADDR' ${TEST5_ACCOUNT__ADDR}
python /script/tools.py replace genesis.json 'INITIAL_SIGNER__ADDRESS' ${NODE1_PUBLIC__ADDR:2}

echo "${TEST1_ACCOUNT__ADDR}\n${TEST2_ACCOUNT__ADDR}\n${TEST3_ACCOUNT__ADDR}\n${TEST4_ACCOUNT__ADDR}\n${TEST5_ACCOUNT__ADDR}\n" > accounts.txt
# Nodes inits
echo 'Initializing nodes !'
geth --datadir node1 init genesis.json
geth --datadir node2 init genesis.json

bootnode -genkey bnode/boot.key
ENODE=$(bootnode -nodekeyhex $(cat bnode/boot.key) -writeaddress)

## Runners
echo 'Running bootnode and nodes !'
RUNNER_1="geth --datadir node1 --port 30306 --bootnodes enode://${ENODE}@127.0.0.1:0?discport=30305 --networkid ${NETWORK_ID} --unlock ${NODE1_PUBLIC__ADDR} --password node1/password.txt --authrpc.port 8551 --mine --miner.etherbase ${NODE1_PUBLIC__ADDR}"
RUNNER_2="geth --datadir node2 --port 30307 --bootnodes enode://${ENODE}@127.0.0.1:0?discport=30305 --networkid ${NETWORK_ID} --unlock ${NODE2_PUBLIC__ADDR} --password node2/password.txt --authrpc.port 8552"
RUNNER_BN="bootnode -nodekey bnode/boot.key -verbosity 7 -addr :30305"
${RUNNER_BN} & ${RUNNER_1} & ${RUNNER_2}
