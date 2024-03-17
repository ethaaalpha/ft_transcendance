npm init --yes
echo 'NPN Init -- SUCCESS'

npm install --save-dev hardhat
echo 'HARDHAT Install -- SUCCESS'

mv /data/hardhat.config.js .
npx hardhat node