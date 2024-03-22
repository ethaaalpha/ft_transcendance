
if [ -d 'node1/geth/' ]; then
	echo 'Config already here, running !'
else
	echo 'Empty config, initing !'

	## Accounts generations for the nodes !
	# Wroting passwords to files
	echo $NODE1_ACCOUNT_PASSWORD > node1/password.txt
	echo $NODE2_ACCOUNT_PASSWORD > node2/password.txt

	for i in $(seq 1 6); do
		printf "$NODE2_ACCOUNT_PASSWORD\n" >> password.config
	done

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

	printf "${NODE2_PUBLIC__ADDR},${TEST1_ACCOUNT__ADDR},${TEST2_ACCOUNT__ADDR},${TEST3_ACCOUNT__ADDR},${TEST4_ACCOUNT__ADDR},${TEST5_ACCOUNT__ADDR}" > accounts.config
	echo $NODE1_PUBLIC__ADDR > n1.config

	# Nodes inits
	echo 'Initializing nodes !'
	geth --datadir node1 init genesis.json
	geth --datadir node2 init genesis.json
	geth --datadir node3 init genesis.json

	bootnode -genkey bnode/boot.key
fi

ALL_ACCOUNTS_N2=$(cat accounts.config)
NODE1_PUBLIC__ADDR=$(cat n1.config)

# Runners
echo 'Running bootnode and nodes !'
ENODE=$(bootnode -nodekeyhex $(cat bnode/boot.key) -writeaddress)
RUNNER_BN="bootnode -nodekey bnode/boot.key -addr :30305"
RUNNER_1="geth --verbosity 3 --cache 128 --datadir node1 --port 30306 --bootnodes enode://${ENODE}@127.0.0.1:0?discport=30305 --networkid ${NETWORK_ID} --unlock ${NODE1_PUBLIC__ADDR} --password node1/password.txt --authrpc.port 8546 --mine --miner.etherbase ${NODE1_PUBLIC__ADDR}"
RUNNER_2="geth --verbosity 3 --cache 128 --datadir node2 --port 30307 --bootnodes enode://${ENODE}@127.0.0.1:0?discport=30305 --networkid ${NETWORK_ID} \
--unlock ${ALL_ACCOUNTS_N2} --password password.config \
--http --allow-insecure-unlock --http.corsdomain '*' --http.port 8545 --http.addr 0.0.0.0"

${RUNNER_BN} 2>/dev/null & ${RUNNER_1} 2>/dev/null & ${RUNNER_2} 2>/dev/null