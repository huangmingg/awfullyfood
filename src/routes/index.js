import Vue from 'vue';
import VueRouter from 'vue-router';
import { authService } from '@/firebase';
import { store } from '@/stores';
import { getUserProfile } from '@/services/user.service';
import { routes } from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
  linkActiveClass: 'is-active',
  mode: 'history',
  routes,
});

router.beforeEach(async (to, from, next) => {
  const currentUser = authService.currentUser;
  const routeRole = to?.meta?.role;
  if (!currentUser) {
    if (to.path !== '/login') {
      next('/login');
    } else {
      next();
    }
  } else {
    await getUserProfile(currentUser.uid);
    const userRole = store?.getters?.getRole;
    if (!userRole && to.path !== '/register') {
      next('/register');
    }

    if (userRole && (to.path === '/register') || (to.path === '/login')) {
      userRole === 'Buyer' ? next('/buyer/home') : next('/seller/home');
    }

    if (routeRole && (routeRole !== userRole)) {
      next('/not-found-page');
    }
    next();
  }
});

export { router };
