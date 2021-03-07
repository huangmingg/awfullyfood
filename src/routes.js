import HomePage from '@/pages/HomePage'
import BrowsePage from '@/pages/BrowsePage'
import HistoryPage from '@/pages/HistoryPage'
import LoginPage from "@/pages/common/LoginPage";
import RegistrationPage from "@/pages/seller/RegistrationPage";

const Routing = [
    {
        path: '/login',
        name: 'login',
        component: LoginPage
    },
    {
        path: '/register',
        name: 'register',
        component: RegistrationPage
    },
    {
        path: '/',
        name: 'home',
        component: HomePage,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/browse',
        name: 'browse',
        component: BrowsePage,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/history',
        name: 'history',
        component: HistoryPage,
        meta: {
            requiresAuth: true
        }
    },
];


export {
    Routing
}

