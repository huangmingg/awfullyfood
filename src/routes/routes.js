import LoginPage from '@/pages/common/LoginPage';
import RegistrationPage from '@/pages/common/RegistrationPage';
import ProfilePage from '@/pages/common/ProfilePage';
import SearchUserPage from '@/pages/common/SearchUserPage';
import BuyerHomePage from '@/pages/buyer/BHomePage';
import BrowsePage from '@/pages/buyer/BBrowsePage';
import BookmarkPage from '@/pages/buyer/BBookmarkPage';
import TransactionPage from '@/pages/buyer/BTransactionPage';
import BListDetailPage from '@/pages/buyer/BListDetailPage';
import SellerHomePage from '@/pages/seller/SHomePage';
import SellerAddListPage from '@/pages/seller/SAddListPage';
import SellerListPage from '@/pages/seller/SListPage';
import SellerListDetailPage from '@/pages/seller/SListDetailPage';
import SellerTransactionPage from '@/pages/seller/STransactionPage';
import SellerTransactionDetailPage from '@/pages/seller/STransactionDetailPage';
import NotFoundPage from '@/pages/common/NotFoundPage';
import RouterViewWrapper from '@/pages/common/RouterViewWrapper';

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
    path: '/search',
    name: 'search',
    component: SearchUserPage,
  },
  {
    path: '/buyer',
    redirect: '/buyer/home',
    component: RouterViewWrapper,
    role: 'Buyer',
    children: [
      {
        path: 'home',
        component: BuyerHomePage,
      },
      {
        path: 'browse',
        component: RouterViewWrapper,
        children: [
          {
            path: '',
            component: BrowsePage,
          },
          {
            path: ':id',
            component: BListDetailPage,
            props: true,
          },
        ],
      },
      {
        path: 'bookmark',
        component: BookmarkPage,
      },
      {
        path: 'transaction',
        component: TransactionPage,
      },
    ],
  },
  {
    path: '/seller',
    redirect: '/seller/home',
    component: RouterViewWrapper,
    role: 'Seller',
    children: [
      {
        path: 'home',
        component: SellerHomePage,
      },
      {
        path: 'list',
        component: RouterViewWrapper,
        children: [
          {
            path: '',
            component: SellerListPage,
          },
          {
            path: 'detail/:id',
            component: SellerListDetailPage,
            props: true,
          },
          {
            path: 'add',
            component: SellerAddListPage,
          },
        ],
      },
      {
        path: 'transaction',
        component: RouterViewWrapper,
        children: [
          {
            path: '',
            component: SellerTransactionPage,
          },
          {
            path: ':id',
            component: SellerTransactionDetailPage,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    component: NotFoundPage,
  },
];
