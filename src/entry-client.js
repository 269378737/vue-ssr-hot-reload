const { createApp } = require('./main.js');

const { app, store, router } = createApp();

// 将数据状态替换
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

// 将 vue 实例挂载到容器元素
router.onReady(() => {
  // 注释的代码为数据预取代码
  // 添加路由钩子函数，用于处理 asyncData.
  // 在初始路由 resolve 后执行，
  // 以便我们不会二次预取(double-fetch)已有的数据。
  // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
  // router.beforeResolve((to, from, next) => {
  //     const matched = router.getMatchedComponents(to)
  //     const preMatched = router.getMatchedComponents(from)

  //     let diffed = false
  //     const activated = matched.filter((c, i) => {
  //         return diffed || (diffed = (preMatched[i] !== c))
  //     })
  //     if (!activated.length) {
  //         return next()
  //     }
  //     // 这里如果有加载指示器(loading indicator)，就触发
  //     // loading = true

  //     Promise.all(activated.map(c => {
  //         if (c.asyncData) {
  //             return c.asyncData({ store, route: to })
  //         }
  //     })).then(() => {
  //         // 停止加载指示器
  //         // loading.close

  //         next()
  //     }).catch(next)

  // })
  app.$mount('#app');
});
