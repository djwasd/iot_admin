import MenuModeEnum from '@/dict/menuModeEnum';
import { filterAsyncRoutes, initDynamicViewsModules } from '@/utils/permission';
import useUserStore from './user';
import { router, constantRoutes, asyncRoutes, flatteningRoutes2 } from '@/router';
import { RouteRecordRaw } from 'vue-router';
import { settingConfig } from '@/config';
import { PageEnum } from '@/dict/pageEnum';
import { Layout } from '@/router/constant';
export default defineStore('route', {
  state: () => ({
    addRoutes: [] as RouteRecordRaw[],
    cacheFullPath: new Set() as Set<string | RegExp>,
    childsRoutes: [] as RouteRecordRaw[][],
  }),
  getters: {
    routes: (state) => constantRoutes.concat(state.addRoutes),
  },
  actions: {
    //生成权限过滤后的动态路由
    async generateRoutes() {
      if (useUserStore().rules) {
        switch (settingConfig.menuMode) {
          case MenuModeEnum.STATIC:
            this.addRoutes = markRaw(filterAsyncRoutes(asyncRoutes));
            break;
          // case MenuModeEnum.API:  线上接口就是奖settingConfig.menuMode换成API在这里请求乱接就好了
          //   initDynamicViewsModules();
          //   this.addRoutes = markRaw(filterAsyncRoutes(await menuApi()(), undefined, true));
          //   break;
        }
      }
      return this.addRoutes;
    },
    //初始化路由
    async initRoutes() {
      flatteningRoutes2(
        [
          {
            path: '/',
            redirect: PageEnum.HOME,
            meta: {
              title: '',
            },
            component: Layout,
            children: await this.generateRoutes(),
          },
        ],
        constantRoutes.length,
        true,
      ).forEach((route) => router.addRoute(route));
    },
  },
});
