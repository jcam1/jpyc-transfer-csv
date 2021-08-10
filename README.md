# jpyc-transfer-csv
You can transfer ERC20 token based on information from csv file.\
csvファイルの情報に基づいてERC20トークンを送金できます。¥JPYC以外のトークンも送金できます。

## Usage / 使い方

You can make csv file by following format below.\
下記の例に従ってcvsファイルを作成してください。
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

### リモートで使用する場合
```
// Ethereum mainnet で erc20 を送る場合
npx -p token-transfer-csv -c "erc20Mainnet 送金先アドレスのcvsファイルのパス トークンのコントラクトアドレス 送金者のアドレス 送金者の秘密鍵のcvsファイルのパス InfraのAPIキー chainId"

// サイドチェーンでERC20トークンを送る場合
npx -p jpyc-transfer-csv -c "erc20Sidechain 送金先アドレスのcvsファイルのパス トークンのコントラクトアドレス 送金者のアドレス 送金者の秘密鍵のcvsファイルのパス InfraのAPIキー chainId"

// example
npx -p jpyc-transfer-csv -c "npm run dev ./address.csv 0xA28ac1acBa964496c9A621a28ad987f19003881A 0xb4Ee570738Eb8894D333105c9F8F8Fb0a57af531 B2FC108CAB5BC897E9095CC3356DF0001112224D9DF8967F018B3E0C3CA208D8 https://mainnet.infura.io/v3/APIKey mainet"
```

### ローカルで使用する場合
```
git clone https://github.com/jcam1/jpyc-transfer-csv.git
cd jpyc-trnsfer-csv
npm i //必要なパッケージをインストール

// Ethereum mainnet で erc20 を送る場合
npm run erc20Mainnet 送金先アドレスのcvsファイルのパス トークンのコントラクトアドレス 送金者のアドレス 送金者の秘密鍵のcvsファイルのパス InfraのAPIキー chainId

// サイドチェーンでERC20トークンを送る場合
npm run erc20Sidechain 送金先アドレスのcvsファイルのパス トークンのコントラクトアドレス 送金者のアドレス 送金者の秘密鍵のcvsファイルのパス InfraのAPIキー chainId
```

### List of Chain ID
| Name | Chain ID |
| -- | -- |
| Ethereum mainnet | 1 |
| xDai Chain | 100 |
| Matic Mainnet | 137 |
| Matic Testnet Mumbai | 80001 |


## License / ライセンス
This project is licensed under the MIT License - see the LICENSE.md file for details.\
このプロジェクトは MIT ライセンスの元にライセンスされています。 詳細は LICENSE.md をご覧ください。