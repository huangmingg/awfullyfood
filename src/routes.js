import Buyer from "@/pages/buyer/Buyer";
import HomePage from '@/pages/buyer/HomePage'
import BrowsePage from '@/pages/buyer/BrowsePage'
import HistoryPage from '@/pages/buyer/HistoryPage'
import LoginPage from "@/pages/common/LoginPage";
import RegistrationPage from "@/pages/common/RegistrationPage";
import VueRouter from 'vue-router'
import {authService} from "@/firebase";


const route = [
    {
        path: '/login',
        component: LoginPage,
    },
    {
        path: '/register',
        component: RegistrationPage
    },
    {
        path: '/buyer',
        component: Buyer,


    },
    {
        path: '/',
        component: HomePage,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/browse',
        component: BrowsePage,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/history',
        component: HistoryPage,
        meta: {
            requiresAuth: true
        }
    },
];

const router = new VueRouter({
    routes: route,
    mode: 'history'
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
    if (requiresAuth && !authService.currentUser) {
        next('/login')
    } else {
        next()
    }
})

export {
    router
}

