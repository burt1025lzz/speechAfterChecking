# 后检语音纠错系统

+ 本项目通过录入数据字典后, 通过文本比对最优替换方式来优化语音识别结果
+ 使用浏览器 web speech api 做语音识别方案
+ 使用 pinyin 库及 nodejieba 分词库和 chatgpt 做分词方案
+ 文本比对使用了 levenshtein 算法

## 环境要求

需要 NodeJS 16.19+ 环境

## 安装

```shell
$ npm install
```

## 运行
首先去 `.env` 中修改数据库连接地址,然后执行以下命令:
```shell
$ npm run start
```
或者
```shell
$ node bin/www
```
服务器启动默认端口为 12580,若不想使用 12580 端口,可使用以下命令: Mac/Linux

```shell
$ PORT=4000 node bin/www
```

windows 下使用 git-bash 或者 cmder 等终端执行以下命令:

```shell
$ set PORT=4000 && node bin/www
```

或修改 `.env` 文件中
```shell
PORT=4000
```

如需使用智能模式需配置 `.env` 中 `CHATGPT_KEY`, 获取 key 请参考 [openapi](https://platform.openai.com/account/api-keys)
