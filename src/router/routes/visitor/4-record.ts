import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'record',
    component: () => import('@/views/visitor/record/index.vue'),
    meta: { title: '访客记录',icon:'me-icon-record_svg'},
  },
];
