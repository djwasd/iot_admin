import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'list',
    component: () => import('@/views/visitor/list/index.vue'),
    meta: { title: '访客列表',icon:'me-icon-list'},
  },
];
