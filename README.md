# 概要

あらかじめキーワードと、それに対するレスポンスを記録しておき、その答えに合致したら答えを返すDiscordBotです。

## コマンド

### /create 作成

```
/create [keyword] [response]
```

keywordとresponseは必須です。
作成するとDiscordのコメントを見てその中にkeywordが入っていればresponseを返答します

### /list 一覧

```
/list
```

登録されているkeywordを一覧にして返します

### /delete 削除

```
/delete [keyword]
```

登録されているkeywordを指定し、削除します

## 環境構築

DISCORD_TOKEN を環境変数に設定してください。Botを作成するとできるTokenです。
[参照](https://discordpy.readthedocs.io/ja/latest/discord.html#:~:text=%E3%80%8CNew%20Application%E3%80%8D%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF,%E3%81%97%E3%81%A6%E7%B6%9A%E8%A1%8C%E3%81%97%E3%81%BE%E3%81%99%E3%80%82)

```
docker-compose up -d
```