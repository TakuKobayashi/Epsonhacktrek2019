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

