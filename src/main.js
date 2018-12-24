import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import { createStore } from './store';

Vue.config.productionTip = false;

// new Vue({
//   router,
//   store,
//   render: h => h(App),
// }).$mount('#app');


export function createApp() {
  const store = createStore();
  const router = createRouter();

  const app = new Vue({
    store,
    router,
    render: h => h(App),
  });
  return { app, store, router };
}
