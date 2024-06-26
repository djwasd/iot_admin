import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { PageEnum } from '@/dict/pageEnum';
import { App } from 'vue';
import { setupRouterGuard } from './guard';
import { concatObjectValue } from '@/utils/helper';
import { Layout } from '@/router/constant';
export const asyncRoutes = concatObjectValue<RouteRecordRaw>(
  import.meta.glob('./routes/*.ts', { eager: true, import: 'routes' }),
);
import { isExternal } from '@/utils/validate';
import { resolve } from 'path-browserify';

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: PageEnum.LOGIN,
    component: async () => await import('@/views/login/login_interface.vue'),
    meta: {
      hideMenu: true,
      title: '登录',
    },
  },

  {
    path: PageEnum.REGISTER,
    component: async () => await import('@/views/login/login_register.vue'),
    meta: {
      hideMenu: true,
      title: '注册',
    },
  },
  {
    path: PageEnum.FORGET,
    component: async () => await import('@/views/login/login_forget.vue'),
    meta: {
      hideMenu: true,
      title: '忘记密码',
    },
  },
  {
    path: '/redirect',
    component: Layout,
    children: [
      {
        name: 'redirect',
        path: '/redirect/:path(.*)',
        component: async () => await import('@/views/redirect.vue'),
      },
    ],
    meta: {
      hideMenu: true,
      title: '',
      noCache: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    component: async () => await import('@/views/404.vue'),
    meta: { hideMenu: true, title: '404' },
  },
];

//路由地址转为绝对地址
export const resolvePath = (routePath: string, basePath = '') => {
  if (isExternal(routePath) || isExternal(basePath)) {
    return routePath;
  }
  return resolve(basePath, routePath);
};

//扁平化路由
export const flatteningRoutes = (
  routes: RouteRecordRaw[],
  basePath = '',
  menuIndex: number[] = [],
  newRoutes: RouteRecordRaw[] = [],
  baseIndex = 0,
) => {
  routes.forEach((route, index) => {
    route.path = resolvePath(route.path, basePath);
    if (!route.meta) {
      route.meta = { title: '' };
    }
    route.meta.menuIndex = [...menuIndex, index + baseIndex];
    newRoutes.push(Object.assign({ ...route }, { children: [] }));
    if (route.children) {
      flatteningRoutes(route.children, route.path, route.meta.menuIndex, newRoutes);
    }
  });
  return newRoutes;
};
//扁平化为2级路由
export const flatteningRoutes2 = (routes: RouteRecordRaw[], startIndex = 0, ignoreFirst = false) => {
  const newRoutes = [] as RouteRecordRaw[];
  routes.forEach((route, index) => {
    if (!route.meta) {
      route.meta = { title: '' };
    }
    route.meta.menuIndex = [index + startIndex];
    newRoutes.push(
      Object.assign(
        { ...route },
        {
          children: route.children
            ? flatteningRoutes(
                route.children,
                route.path,
                ignoreFirst ? [] : [index + startIndex],
                [],
                ignoreFirst ? index + startIndex : 0,
              )
            : [],
        },
      ),
    );
  });
  return newRoutes;
};

export const router = createRouter({
  history: createWebHashHistory(), //createWebHistory(),
  routes: flatteningRoutes2(constantRoutes),
});

export const jump = (route: Pick<RouteRecordRaw, 'path' | 'meta'>) => {
  if (route.meta?.isLink) {
    window.open(route.path, '_blank');
  } else {
    router.push(route.path);
  }
};

/**
 *
 * @param app
 * @param addRoutes
 */
export function installRoute(app: App) {
  setupRouterGuard(router);
  app.use(router);
}
