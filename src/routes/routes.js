import LoginPage from "@/pages/common/LoginPage";
import RegistrationPage from "@/pages/common/RegistrationPage";
import HomePage from "@/pages/buyer/HomePage";
import BrowsePage from "@/pages/buyer/BrowsePage";
import HistoryPage from "@/pages/buyer/HistoryPage";
import SellerHomePage from "@/pages/seller/SellerHomePage";
import SellerListPage from "@/pages/seller/SellerListPage";
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
            role: 'Buyer'
        }
    },
    {
        path: '/browse',
        component: BrowsePage,
        meta: {
            requiresAuth: true,
            role: 'Buyer'
        }
    },
    {
        path: '/history',
        component: HistoryPage,
        meta: {
            requiresAuth: true,
            role: 'Buyer'
        }
    },
    {
        path: '/seller/home',
        component: SellerHomePage,
        meta: {
            requiresAuth: true,
            role: 'Seller'
        }
    },
    {
        path: '/seller/list',
        component: SellerListPage,
        meta: {
            requiresAuth: true,
            role: 'Seller'
        }
    },
    {
        path: '*',
        component: NotFoundPage,
    }
];
