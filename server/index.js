const serverRender = require("vue-server-renderer");
const fs = require("fs");
const path = require("path");
const Koa = require('koa')
const Router = require('koa-router')
const koastatic = require("koa-static");
const bundle = require("../dist/vue-ssr-server-bundle.json");

const clientManifest = require("../dist/vue-ssr-client-manifest.json");
const renderer = serverRender.createBundleRenderer(bundle, {
  template: fs.readFileSync(
    path.resolve(__dirname, "../src/index.ssr.html"),
    "utf-8"
  ),
  runInNewContext: false,
  clientManifest
});

// 解决第三方库中存在使用客户端专有对象如window、document
const { JSDOM } = require("jsdom");
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost"
});

global.window = dom.window;
global.document = window.document;
global.navigator = window.navigator;

function render(context) {
  return new Promise(resolve => {
    renderer.renderToString(context, (err, html) => {
      if (err) {
        console.log(err);
        if (err.url) {
          resolve({ code: 304, url: err.url });
        } else if (err.code == "404") {
          resolve({ code: 404 });
        } else {
          resolve({ code: 500 });
        }
      } else {
        resolve({ code: 200, html: html });
      }
    });
  });
}


const router = new Router();
router.get("*", async ctx => {
  const context = { url: ctx.request.url };
  let res = await render(context);
  if (res.code === 304) {
    ctx.redirect(res.url);
  } else if (res.code === 404) {
    ctx.status = 404;
    // ctx.redirect("/not-found");
    ctx.body = "Page Not Found!!!";
  } else if (res.code === 500) {
    ctx.status = 500;
    ctx.body = "Server Interval Error!!!";
  } else {
    ctx.body = res.html;
  }
});



const app = new Koa();
const port = 5054;

app.use(koastatic(path.resolve(__dirname, "../dist"))); // 前端文件
app.use(router.routes()).use(router.allowedMethods());


app.on("error", err => {
  console.log(err);
});

app.listen(port, () => {
  console.log(
    `the node server is started, it's running on port ${port}!`
  );
});