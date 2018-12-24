const { createApp } = require('./main.js');

// 该文件中主要创建应用程序实例、服务端路由匹配、数据预读取
/**
 * 当前文件处理的流程：
 * 1、获取到前端路由对象
 * 2、路由跳转到当前渲染上下文的Url
 * 3、在路由准备好后开始匹配请求的Url
 * 4、未匹配到返回404，匹配到则调用对应路由组件的asyncData方法进行数据预读取（这里的asyncData方法是路由对应组件中自定义的一个方法）
 * 5、在调用asyncData方法后将读取到的数据附加到当前渲染上下文
 * 6、返回app实例
 */

export default function (context) {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，就已经准备就绪。
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();
    // 设置服务器端 router 的位置
    router.push(context.url);

    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      // 根据请求的路由匹配相应组件
      const matchedComponents = router.getMatchedComponents();

      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject({ code: 404 });
      }

      // 对所有匹配的路由组件调用 asyncData()，即数据预读取
      return Promise.all(
        matchedComponents.map((Component) => {
          if (Component.asyncData) {
            return Component.asyncData({
              store,
              route: router.currentRoute,
            });
          }
        }),
      )
        .then(() => {
          // 在所有预取钩子(preFetch hook) resolve 后，
          // 我们的 store 现在已经填充入渲染应用程序所需的状态。
          // 当我们将状态附加到上下文，
          // 并且 `template` 选项用于 renderer 时，
          // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
          context.state = store.state;
          resolve(app);
        })
        .catch(reject);
    }, reject);
  });
}
