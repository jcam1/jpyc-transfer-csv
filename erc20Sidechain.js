async function app() {
  let Web3 = require('web3'); //送金にweb3.jsを使用
  const csvtojson = require("csvtojson/v2"); //csvファイルからJSONデータを生成する
  var EthereumTx = require('ethereumjs-tx').Transaction; //ethereumjsを用いてトランザクションに署名する
  var Common = require('ethereumjs-common').default; //サイドチェーンの場合は必要

  //Infra.ioのAPIキーでweb3のインスタンを生成
  let web3 = await new Web3(new Web3.providers.HttpProvider(process.argv[4])); //Infra.ioのAPIキー（https://mainnet.infura.io/apiキー）
  
  //addressListに送金先アドレスを格納
  let addressList = [];
  await csvtojson()
  .fromFile('./address.csv') //送金先アドレスのcsvファイルのパス（./address.csvを指定）
  .then((jsonObj)=>{
    addressList = jsonObj
  })

  //pkに秘送金者の密鍵を格納
  let pk = "";
  await csvtojson()
  .fromFile('./privatekey.csv') //送金者の秘密鍵のcvsのファイルのパス（./privatekey.csvを指定）
  .then((jsonObj)=>{
    pk = jsonObj[0]['privatekey']
  })

  //fromAddressに送金者のアドレスを格納
  const fromAddress = process.argv[3]; //送金者のアドレス
  
  //web3のwalletに送金者の秘密鍵とアドレスを設定
  await web3.eth.accounts.wallet.add({
    privateKey: pk,
    address: fromAddress
  })
  //デフォルトのアカウントに送金者のアドレスを設定
  web3.eth.defaultAccount = fromAddress;

  //コントラクトを取得するためにコントラクトの情報が必要。ABI（Contract Application Binary Interface）とコントラクトアドレス。
  //コントラクトのアクセスする関数のABI情報を記述。balanceOf()とtransfer()。
  let contractABI = [
    {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}], "stateMutability":"view","type":"function","constant":true,"signature":"0x70a08231"},
    {"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function","signature":"0xa9059cbb"},
  ]
  //JPYCのコントラクトアドレス。ネットワークによって異なる。
  let tokenAddress = process.argv[2]; //Etherscanで確認
  //ABIとコントラクトアドレスによってコントラクトのインスタンスを生成
  let contract = await new web3.eth.Contract(contractABI, tokenAddress);

  //----------サイトチェーンの場合は必要----------

  const customCommon = await Common.forCustomChain(
    'mainnet',
    {
      name: 'customchain',
      chainId: Number(process.argv[5]) //chainID（Matic Mainnetの場合は137
    },
    'petersburg'
  )

  //----------サイドチェーンの場合は必要----------

  //addressListのアドレスに送金していく
  for (let i = 0; i < addressList.length; i++) {

    //送金者のアドレスから所持金を確認
    let tokenBalance = await contract.methods.balanceOf(fromAddress).call({
      from: fromAddress,
    })
    //文字列を数値に変換し、所持金が送金額より少ない場合ログを出力して終了する。
    if (Number(tokenBalance) < Number(addressList[i]['amount'])) { return console.log('Token balance insufficient') }

    //ノンスの計算
    var nonce = await web3.eth.getTransactionCount(fromAddress, 'pending')
    var nonceHex = await web3.utils.toHex(nonce)
    //ガス代の計算
    var gasPrice = await web3.eth.getGasPrice()
    var gasEstimate = await contract.methods
    .transfer(addressList[i]['address'], addressList[i]['amount'])
    .estimateGas({ from: fromAddress })
    var gasPriceHex = await web3.utils.toHex(gasPrice)
    var gasLimitHex = await web3.utils.toHex(gasEstimate)
    //コントラクトのメソッドのABIをエンコードする
    var myData = await contract.methods.transfer(addressList[i]['address'], addressList[i]['amount']).encodeABI();
    
    //取引の詳細
    var details = {
      nonce: nonceHex,
      gasPrice: gasPriceHex,
      gasLimit: gasLimitHex,
      to: tokenAddress,
      from: fromAddress,
      data: myData,
    }

    //取引詳細とcommonで作成したcustomCommonでトランザクションのインスタンを生成
    var transaction = new EthereumTx(details, { common: customCommon })
    //秘密鍵をBufferに変換
    var privatekey = Buffer.from(pk, 'hex')
    //トランザクションに秘密鍵のBufferで署名
    transaction.sign(privatekey)

    //シリアライズして16真数のバイト形式にする
    var rawdata = '0x' + transaction.serialize().toString('hex')

    //署名したデータをweb3で送信
    await web3.eth.sendSignedTransaction(rawdata)
    .on('receipt', function(receipt){
      console.log('successfully transferred tokens to ' + addressList[i]['address'] +', transactionHash is ' + receipt.transactionHash)
    })
  }
  return
}

//async/await関数のapp()を実行
app()

