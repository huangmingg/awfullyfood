import LoginPage from "@/pages/common/LoginPage";
import RegistrationPage from "@/pages/common/RegistrationPage";
import HomePage from "@/pages/buyer/HomePage";
import BrowsePage from "@/pages/buyer/BrowsePage";
import HistoryPage from "@/pages/buyer/HistoryPage";
import SellerHomePage from "@/pages/seller/SellerHomePage";
import NotFoundPage from "@/pages/common/NotFoundPage";

export const routes = [
    {
        path: '/login',
        component: LoginPage,
    },
    {
        path: '/register',
        name: 'register',
        component: RegistrationPage,
        props: true,
    },
    {
        path: '/home',
        component: HomePage,
        meta: {
            requiresAuth: true,
            role: 'buyer'
        }
    },
    {
        path: '/browse',
        component: BrowsePage,
        meta: {
            requiresAuth: true,
            role: 'buyer'
        }
    },
    {
        path: '/history',
        component: HistoryPage,
        meta: {
            requiresAuth: true,
            role: 'buyer'
        }
    },
    {
        path: '/seller-home',
        component: SellerHomePage,
        meta: {
            requiresAuth: true,
            role: 'seller'
        }
    },
    {
        path: '*',
        component: NotFoundPage,
    }
];
