import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { Routing } from './routes'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { authService } from '@/firebase'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(IconsPlugin)

const routing = new VueRouter({
  routes: Routing,
  mode: 'history'
});

routing.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  if (requiresAuth && !authService.currentUser) {
    next('/login')
  } else {
    next()
  }
})

let app
authService.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router: routing,
      render: h => h(App)
    }).$mount('#app')
  }
})
