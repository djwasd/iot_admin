import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'holiday',
    component: () => import('@/views/attendance/holiday/index.vue'),
    meta: { title: '节假日管理',icon:'me-icon-holiday'},
  },
];
