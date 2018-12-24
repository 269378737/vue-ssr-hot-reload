# vue-ssr-hot-reload

该项目是一个 `vue cli 3.0` 创建的 `SSR` 并具有热更新的应用

### SSR相关代码

```
|--server
    |--index.js
|--src
    |--entry-client.js
    |--entry-server.js
    |--index.ssr.html
    |--main.js
    |--router.js
    |--store.js
|--vue.config.js
```

### 热更新相关代码

```
|--server
    |--dev.ssr.js
    |--server.js
    |--ssr.js
|--vue.config.js
```

## Project setup
```
npm install
```

### 开发环境启动
```
npm run dev
```

### 编译与生产环境部署
部署到生产环境只需将 `dist` 目录文件、`server/index.js`、`src/index.ssr.html`、`package.json` 上传到服务器，注意目录与开发环境目录需要一致，然后使用 `pm2` 启动 `server/index.js` 文件即可。
```
npm run ssr
node ./server/index.js
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```


