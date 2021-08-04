// with gateway
const Web3 = require('web3');
const { legos } = require('@studydefi/money-legos');

const poktAppID = process.env.POKT_APP_ID || '60462b1ee1261e00308bfaae';
const bscNetworkAddress = `https://bsc-mainnet.gateway.pokt.network/v1/60a7fd94af88c10031823789`;
const ethNetworkAddress = `https://eth-mainnet.gateway.pokt.network/v1/${poktAppID}`;
const rinkebyNetworkAddress = `https://eth-rinkeby.gateway.pokt.network/v1/${poktAppID}`;
const bscTestnetNetworkAddress =
  'https://data-seed-prebsc-1-s1.binance.org:8545';
const exampleAddress = '0xE8B0a2B0Ec112294E6c43cdfDe0Ead401be581e9';

const addressPrivateKey = '';

const txConfig = {
  from: '0xE8B0a2B0Ec112294E6c43cdfDe0Ead401be581e9',
  to: '0x19562214f87ecdcb402E189617538d50e80cB9A7',
  value: '0x5af3107a4000',
  gas: '0x5208',
  gasPrice: '0x3b9aca00',
  data: null,
  nonce: 4,
  chainId: null,
};

const yUSDCABI = require('./yUSDC.json');

const web3Instances = {
  mainnet: new Web3(new Web3.providers.HttpProvider(ethNetworkAddress)),
  rinkeby: new Web3(new Web3.providers.HttpProvider(rinkebyNetworkAddress)),
  binance: new Web3(new Web3.providers.HttpProvider(bscNetworkAddress)),
  'binance-testnet': new Web3(
    new Web3.providers.HttpProvider(bscTestnetNetworkAddress)
  ),
  'binance-testnet2': new Web3(bscTestnetNetworkAddress),
};
const web3 = web3Instances['binance'];

const getUSDCBalance = async (walletAddress) => {
  const abi = legos.erc20.abi;
  // const addr = legos.erc20.usdc.address;
  const addr = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d';
  // const contract = new Contract(abi, addr);
  // contract.setProvider(web3);
  const contract = new web3.eth.Contract(abi, addr);
  try {
    console.time('getUSDCBalance');
    const balance = await contract.methods.balanceOf(walletAddress).call();
    console.log('getUSDCBalance', walletAddress, balance, typeof balance);
    console.timeEnd('getUSDCBalance');
  } catch (err) {
    throw err;
  }
};

const getCDaiBalance = async (walletAddress) => {
  const abi = legos.erc20.abi;
  // const addr = legos.erc20.usdc.address;
  const addr = '0xcbf343b6cce083dbb56da7fafcc7860b5cbe1b72'; // binance cDai
  // const contract = new Contract(abi, addr);
  // contract.setProvider(web3);
  const contract = new web3.eth.Contract(abi, addr);
  try {
    console.time('getCDaiBalance');
    const balance = await contract.methods.balanceOf(walletAddress).call();
    console.log('getCDaiBalance', walletAddress, balance, typeof balance);
    console.timeEnd('getCDaiBalance');
  } catch (err) {
    throw err;
  }
};

const getyUSDCPricePerFullShare = async (block) => {
  const abi = yUSDCABI;
  const addr = '0x597ad1e0c13bfe8025993d9e79c69e1c0233522e';
  const contract = new web3.eth.Contract(abi, addr);
  try {
    console.time('getyUSDCPricePerFullShare');
    if (block) {
      const result = await contract.methods
        .getPricePerFullShare()
        .call({}, block);
      console.log('getyUSDCPricePerFullShare', result, typeof result);
    } else {
      const result = await contract.methods.getPricePerFullShare().call();
      console.log('getyUSDCPricePerFullShare', result, typeof result);
    }
    console.timeEnd('getyUSDCPricePerFullShare');
  } catch (err) {
    throw err;
  }
};

const getETHBalance = async (network, walletAddress) => {
  const web3 = web3Instances[network];
  try {
    console.time('getETHBalance');
    var balance = await web3.eth.getBalance(walletAddress);

    console.log('getETHBalance', balance, typeof balance);
    console.timeEnd('getETHBalance');
  } catch (err) {
    console.log('err', err);
    throw err;
  }
};

const getGasPrice = async () => {
  try {
    console.time('getGasPrice');
    var result = await web3.eth.getGasPrice();

    console.log('getGasPrice', result, web3.utils.toHex(result), typeof result);
    console.timeEnd('getGasPrice');
  } catch (err) {
    throw err;
  }
};

const getBlockNumber = async () => {
  try {
    console.time('getBlockNumber');
    var result = await web3.eth.getBlockNumber();

    console.log('getBlockNumber', result);
    console.timeEnd('getBlockNumber');
  } catch (err) {
    throw err;
  }
};

const getTransactionCount = async (walletAddress) => {
  try {
    console.time('getTransactionCount');
    var result = await web3.eth.getTransactionCount(walletAddress);

    console.log('getTransactionCount', result);
    console.timeEnd('getTransactionCount');
  } catch (err) {
    throw err;
  }
};

const signTransaction = async () => {
  const web3 = web3Instances['mainnet'];
  const account = web3.eth.accounts.privateKeyToAccount(addressPrivateKey);
  try {
    console.time('signTransaction');

    console.log('txConfig', txConfig);
    const serializedTransaction = await account.signTransaction(txConfig);
    console.log('acount', account);
    console.log('test', serializedTransaction);

    console.log('txConfig', txConfig);
    console.log('network', web3.eth.defaultChain);
    console.timeEnd('signTransaction');
  } catch (err) {
    throw err;
  }
};

const sendTransaction = async (network, raw) => {
  const web3Selected = web3Instances[network];
  console.time('signTransaction');
  var result = await web3Selected.eth.sendSignedTransaction(
    raw,
    (error, hash) => {
      console.log('error', error);
    }
  );
  console.log('result', result);
  console.timeEnd('signTransaction');
};

// getUSDCBalance('0x87e89b3df75944273fdccf3ec574ec4a2083a020');
// getCDaiBalance('0x87e89b3df75944273fdccf3ec574ec4a2083a020');
// getGasPrice();
// getBlockNumber();
// getTransactionCount('0xde648af31ded7bf09e4f4af61f96937a60877e79');

// getyUSDCPricePerFullShare();
// getyUSDCPricePerFullShare(12450866);
// signTransaction();

// getETHBalance('rinkeby', '0x275e400c6f8b1cee71060c2c5C1AbbE0b72bBB60');
sendTransaction(
  'binance',
  '0xf86a80843b9aca0082520894b8f274dd2c11cf3101233660023a9b8cda0f8e7e87038d7ea4c680008026a0968d8acf99cfeae646d7cc0b47379fbb904216e949c2407cfe74805db6b5aa83a03e1812af763483bc3e56953546e0f08ab2e944d5b13b5593bd678e86f6f99e4d'
);

// sendTransaction(
//   'mainnet',
//   '0xf86a80843b9aca0082520894e8b0a2b0ec112294e6c43cdfde0ead401be581e987038d7ea4c680008025a077325a5ed5abfc046782f9b69bd1990dd4b4cb174162d125740f7829e183425ba0079078f58fbed2d0b560c138014f517de5c30f4f60b522803777da82c3756eab'
// );

// getETHBalance('binance-testnet', '0x275e400c6f8b1cee71060c2c5C1AbbE0b72bBB60');
// getETHBalance('binance-testnet2', '0x275e400c6f8b1cee71060c2c5C1AbbE0b72bBB60');
