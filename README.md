# jpyc-transfer-csv
You can transfer ERC20 token based on information from csv file.\
csvファイルの情報に基づいてERC20トークンを送金できます。JPYC以外も送金できます。

## Usage / 使い方
infra.ioでAPIキーを取得してください。[https://infura.io/](https://infura.io/)\
\
レポジトリをクローンしてディレクトリに移動します。
```
git clone https://github.com/jcam1/jpyc-transfer-csv.git
cd jpyc-transfer-csv
```
必要なパッケージをインストールします。
```
npm i
```
下記を参考にcsvファイルの中身を変更してください。一括で送金されます。\
./address.csvの中身
```address.csv
ex)
address,amount,
0xa443159f8F323e3BE71Ee77cb06D88d766cba596,1
0x82fC7Cbd59b931258bcD97826EFa5Fff21aA626D,2
```
./privatekey.csvの中身
```privatekey.csv
ex)
privatekey,
6ea8a9b23f...276926917c46
```
下記を参考にコマンドを実行してください。
```
// メインネットでerc20を送る場合
npm run erc20Mainnet トークンのコントラクトアドレス 送金者のアドレス InfraのAPIキー mainnet

//exsample, Ethrteum Mainnet
npm run erc20Mainnet 0x2370f9d504c7a6E775bf6E14B3F12846b594cD53 0xb4Ee570738Eb8894D333105c9F8F8Fb0a57af531 https://mainnet.infura.io/v3/APIKey mainnet

// サイドチェーンでERC20トークンを送る場合
npm run erc20Sidechain トークンのコントラクトアドレス 送金者のアドレス InfraのAPIキー chainId

//exsample, Polygon Mainnet
npm run erc20Mainnet 0x2370f9d504c7a6E775bf6E14B3F12846b594cD53 0xb4Ee570738Eb8894D333105c9F8F8Fb0a57af531 https://polygone-mainnet.infura.io/v3/APIKey 137
```
### Calculation of gas bill / ガス代の計算方法
```
var gasPrice = await web3.eth.getGasPrice()
var gasEstimate = await contract.methods.transfer(addressList[i]['address'], addressList[i]['amount']).estimateGas({ from: fromAddress })
var gasPriceHex = await web3.utils.toHex(gasPrice)
var gasLimitHex = await web3.utils.toHex(gasEstimate)
```

### List of JPYC Contract Address
| Name | Contract Address |
| -- | -- |
| Ethereum Mainnet | 0x2370f9d504c7a6E775bf6E14B3F12846b594cD53 |
| xDAI chain | 0x417602f4fbdd471A431Ae29fB5fe0A681964C11b |
| Polygon(Matic) Mainnet | 0x6AE7Dfc73E0dDE2aa99ac063DcF7e8A63265108c |


### List of Chain ID ans Network ID
| Name | Chain ID |
| -- | -- |
| Ethereum Mainnet | 1 |
| Ropsten Testnet | 3 |
| Rinkeby Testnet | 4 |
| xDai Chain | 100 |
| Polygon(Matic) Mainnet | 137 |
| Polygon(Matic) Testnet Mumbai | 80001 |


## License / ライセンス
This project is licensed under the MIT License - see the LICENSE.md file for details.\
このプロジェクトは MIT ライセンスの元にライセンスされています。 詳細は LICENSE.md をご覧ください。