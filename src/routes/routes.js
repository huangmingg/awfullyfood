import LoginPage from "@/pages/common/LoginPage";
import RegistrationPage from "@/pages/common/RegistrationPage";
import ProfilePage from "@/pages/common/ProfilePage";
import Buyer from "@/pages/buyer/Buyer";
import BuyerHomePage from "@/pages/buyer/BHomePage";
import BrowsePage from "@/pages/buyer/BBrowsePage";
import BookmarkPage from "@/pages/buyer/BBookmarkPage";
import Seller from "@/pages/seller/Seller";
import SellerHomePage from "@/pages/seller/SHomePage";
import SellerListPage from "@/pages/seller/SListPage";
import NotFoundPage from "@/pages/common/NotFoundPage";

export const routes = [
    {
      path: '/',
      redirect: '/login',
    },
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
        path: '/profile',
        name: 'profile',
        component: ProfilePage,
    },
    {
        path: '/buyer*',
        redirect: '/buyer/home',
        component: Buyer,
        role: 'Buyer',
        children: [
            {
                path: 'home',
                component: BuyerHomePage,
            },
            {
                path: 'browse',
                component: BrowsePage,
            },
            {
                path: 'bookmark',
                component: BookmarkPage,
            }
        ]
    },
    {
        path: '/seller*',
        redirect: '/seller/home',
        component: Seller,
        role: 'Seller',
        children: [
            {
                path: '/home',
                component: SellerHomePage,
            },
            {
                path: '/list',
                component: SellerListPage,
            },
        ]
    },
    {
        path: '*',
        component: NotFoundPage,
    }
];
