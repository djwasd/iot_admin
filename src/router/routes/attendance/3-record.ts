import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'record',
    component: () => import('@/views/attendance/record/index.vue'),
    meta: { title: '考勤记录',icon:'me-icon-record'},
  },
];
