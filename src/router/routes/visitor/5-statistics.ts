import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'statistics',
    component: () => import('@/views/visitor/statistics/index.vue'),
    meta: { title: '访客统计',icon:'me-icon-statistics'},
  },
];
