import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'group',
    component: () => import('@/views/authorization/group/index.vue'),
    meta: { title: '授权组',icon:'me-icon-group'},
  },
];
