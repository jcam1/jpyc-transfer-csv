async function app() {
  let Web3 = require('web3');
  const csvtojson = require("csvtojson/v2");
  var EthereumTx = require('ethereumjs-tx').Transaction;
  var Common = require('ethereumjs-common').default;

  let addressList = [];

  await csvtojson()
  .fromFile(process.argv[2]) //./address.csv'
  .then((jsonObj)=>{
    addressList = jsonObj
  })

  let contractABI = [
    {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}], "stateMutability":"view","type":"function","constant":true,"signature":"0x70a08231"},
    {"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function","signature":"0xa9059cbb"},
  ]
  let tokenAddress = process.argv[3];

  let web3 = await new Web3(new Web3.providers.HttpProvider(process.argv[6])); //https://mainnet.infura.io
  let contract = await new web3.eth.Contract(contractABI, tokenAddress);

  const fromAddress = process.argv[4];

  let pk = "";

  await csvtojson()
  .fromFile(process.argv[5]) //./privatekey.csv'
  .then((jsonObj)=>{
    pk = jsonObj[0]['privatekey']
  })

  await web3.eth.accounts.wallet.add({
    privateKey: pk,
    address: fromAddress
  })
  web3.eth.defaultAccount = fromAddress;

  const customCommon = await Common.forCustomChain(
    'mainnet',
    {
      name: 'customchain',
      chainId: Number(process.argv[7])
    },
    'petersburg'
  )

  for (let i = 0; i < addressList.length; i++) {

    let tokenBalance = await contract.methods.balanceOf(fromAddress).call({
      from: fromAddress,
    })
    if (Number(tokenBalance) < Number(addressList[i]['amount'])) { return console.log('Token balance insufficient') }

    var myData = contract.methods.transfer(addressList[i]['address'], addressList[i]['amount']).encodeABI();

    var nonce = await web3.eth.getTransactionCount(fromAddress, 'pending')
    var nonceHex = await web3.utils.toHex(nonce)
    var gasPrice = await web3.eth.getGasPrice()
    var gasEstimate = await contract.methods
      .transfer(addressList[i]['address'], addressList[i]['amount'])
      .estimateGas({ from: fromAddress })
    var gasPriceHex = await web3.utils.toHex(gasPrice)
    var gasLimitHex = await web3.utils.toHex(gasEstimate)

    var details = await {
      nonce: nonceHex,
      gasPrice: gasPriceHex,
      gasLimit: gasLimitHex,
      to: tokenAddress,
      from: fromAddress,
      data: myData,
    }

    var transaction = await new EthereumTx(details, { common: customCommon })
    var privatekey = await Buffer.from(pk, 'hex')

    await transaction.sign(privatekey)

    var rawdata = (await '0x') + transaction.serialize().toString('hex')

    await web3.eth.sendSignedTransaction(rawdata)
    .on('receipt', function(receipt){
      console.log('successfully transferred tokens to ' + addressList[i]['address'] +', transactionHash is ' + receipt.transactionHash)
    })
  }

  return
}

app()

