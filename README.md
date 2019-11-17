# Wordcloudについて

## 実行環境の構築

### pipenvのインストール

これでインストールできます

```sh
pip install pipenv
```

Macの場合python3を使うので

```sh
pip3 install pipenv
```

でインストールします。

### Mecabと辞書のインストール

次にMecabと辞書をインストールします。
Macなら以下のコマンドでインストールしてください

```sh
brew install mecab mecab-ipadic
```

Mecabがインストールできたら実行します。

### Mecab Neologdのインストール

Mecab Neologdのダウンロード

```
git clone https://github.com/neologd/mecab-ipadic-neologd.git
```

ダウンロードしたRootディレクトリに移動

```
cd mecab-ipadic-neologd
```

辞書をインストール

```sh
./bin/install-mecab-ipadic-neologd -n
```

これでMecab Neologdの辞書がダウンロードされて利用できるようになります。

### 各種インストール

これで諸々インストールします。

```sh
pipenv install
```

念の為、同期します

```sh
pipenv sync
```

### 実行

Wordcloudの画像を生成できるflask serverを起動するpythonスクリプトを実行します。
以下のコマンドを実行することでサーバーが起動します。

```sh
pipenv run python server.py
```

### Ngrokの導入

Ngrokを導入して稼働しているLocalサーバーを外部からでもアクセスできるようにします。
NgrokをMacにてインストールするには以下のコマンドを実行します。

```sh
brew cask install ngrok
```

インストールが完了したら、すでに稼働しているローカルサーバーのポートを以下のように指定してngrokを起動します。

```sh
ngrok http 5000
```

こうすることで、出てきた、`https://` URLを指定することで外部からも稼働しているサーバーにアクセスすることができます。

### .env の設定

画像を生成した後にメールを送ります。
`.env` に公開したくない情報を記述します。
`.env.sample` を `.env` にしてそれぞれの変数に値を代入してください。
それぞれの変数について以下に記載します。

```
FROM_ADDRESS = "送り主のGmailのメールアドレス"
MAIL_PASSWORD = " Googleアカウントのパスワード"
TO_ADDRESS = "送りたい相手のメールアドレス"
```

以上の値をそれぞれ入力した `.env` ファイルを作成することで、サーバーを起動して作成した画像をメールに添付して送ることができます。

### Gmail のセキュリティの設定の変更

今回の設定ではサーバーからそのままメール送ることができません。
追加で送信に利用する[Googleアカウント「セキュリティ」](https://myaccount.google.com/security)の下の方にある「安全性の低いアプリのアクセス」を許可する必要があります。
こうすることでエラーなくメールを送ることができます。