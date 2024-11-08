import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

import TheContainer from '@/components/containers/TheContainer';
import Home from '@/view/dashboard/Home';
import Auth from '@/view/user/Auth';

function configRougtes() {
  return [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/index.html',
      redirect: '/home',
    },
    {
      path: '/login',
      name: 'Login',
      component: Auth,
    },
    {
      path: '/',
      component: TheContainer,
      children: [
        {
          path: 'home',
          name: 'Home',
          component: Home,
        }
      ],
    }
  ];
}

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_URL || '/'),
  routes: configRougtes(),
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = !!userStore.user;

  if (to.name !== 'Login' && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;