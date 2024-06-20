import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'code',
    component: () => import('@/views/visitor/code/index.vue'),
    meta: { title: '访客码',icon:'me-icon-code'},
  },
];
