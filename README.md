# jpyc-transfer-csv
You can transfer ERC20 token based on information from csv file.\
csvファイルの情報に基づいてERC20トークンを送金できます。JPYC以外も送金できます。

## Usage / 使い方
Infra.ioでAPIキーを取得してください。[https://infura.io/](https://infura.io/)\
\
gitをクローンしてディレクトリに移動します。
```
git clone https://github.com/jcam1/jpyc-transfer-csv.git
cd jpyc-transfer-csv
```
必要なパッケージをインストールします。
```
npm i
```
下記を参考にcsvファイルの中身を変更してください。
```address.csv
ex)
address,amount,
0xa443159f8F323e3BE71Ee77cb06D88d766cba596,1
0x82fC7Cbd59b931258bcD97826EFa5Fff21aA626D,2
```

```privatekey.csv
ex)
privatekey,
6ea8a9b23f...276926917c46,
```
下記を参考にコマンドを実行してください。
```
// メインネットでerc20を送る場合
npm run erc20Mainnet トークンのコントラクトアドレス 送金者のアドレス InfraのAPIキー chainId

// サイドチェーンでERC20トークンを送る場合
npm run erc20Sidechain トークンのコントラクトアドレス 送金者のアドレス InfraのAPIキー chainId
```
### ガス代の計算方法
```
var gasPrice = await web3.eth.getGasPrice()
var gasEstimate = await contract.methods.transfer(addressList[i]['address'], addressList[i]['amount']).estimateGas({ from: fromAddress })
var gasPriceHex = await web3.utils.toHex(gasPrice)
var gasLimitHex = await web3.utils.toHex(gasEstimate)
```

### List of JPYC Contract Address
JPYCは現在、Ethereum mainnetとMatic MainnetとRopsten Testnetに対応しております。
| Name | Contract Address |
| -- | -- |
| Ethereum Mainnet | 0x2370f9d504c7a6E775bf6E14B3F12846b594cD53 |
| Ropsten Testnet | 0x2370f9d504c7a6E775bf6E14B3F12846b594cD53 |
| Matic Mainnet | 0x2370f9d504c7a6E775bf6E14B3F12846b594cD53 |


### List of Chain ID
JPYCは現在、Ethereum mainnetとMatic MainnetとRopsten Testnetに対応しております。
| Name | Chain ID |
| -- | -- |
| Ethereum Mainnet | 1 |
| Ropsten Testnet | 3 |
| xDai Chain | 100 |
| Matic Mainnet | 137 |
| Matic Testnet Mumbai | 80001 |


## License / ライセンス
This project is licensed under the MIT License - see the LICENSE.md file for details.\
このプロジェクトは MIT ライセンスの元にライセンスされています。 詳細は LICENSE.md をご覧ください。