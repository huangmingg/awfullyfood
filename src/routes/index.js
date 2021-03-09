import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'
import { authService } from "@/firebase";
import { store } from "@/stores";

Vue.use(VueRouter)

const router = new VueRouter({
    linkActiveClass: 'is-active',
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    // const requiresAuth = to.matched.some(x => x?.meta?.requiresAuth);
    const userRole = store?.getters?.getRole;
    const routeRole = to?.meta?.role;
    if (!authService.currentUser && to.path !== "/login") {
        next('/login');
    } else if (routeRole && (routeRole !== userRole)) {
        next('/not-found-page');
    } else if (authService.currentUser && to.path === "/login") {
        next('/home');
    } else if (authService.currentUser && !userRole && to.path !== "/register") {
        next('/register');
    } else {
        next();
    }
})

export { router }
