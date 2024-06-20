import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'rules',
    component: () => import('@/views/attendance/rules/index.vue'),
    meta: { title: '考勤规则',icon:'me-icon-rules'},
  },
];
