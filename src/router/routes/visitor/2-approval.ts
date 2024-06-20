import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'approval',
    component: () => import('@/views/visitor/approval/index.vue'),
    meta: { title: '访客审批',icon:'me-icon-approval'},
  },
];
