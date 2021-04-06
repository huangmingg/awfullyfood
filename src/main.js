import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import { authService } from '@/firebase';
import App from './App.vue';
import { router } from './routes';
import { store } from './stores';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Loading);

let app;
authService.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount('#app');
  }
});

