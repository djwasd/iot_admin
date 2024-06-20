import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'blacklist',
    component: () => import('@/views/personnel/blacklist/index.vue'),
    meta: { title: '黑名单',icon:"me-icon-blacklist"},
  },
];
