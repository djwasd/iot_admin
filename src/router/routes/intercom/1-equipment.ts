import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'equipment',
    component: () => import('@/views/intercom/equipment/index.vue'),
    meta: { title: '对讲设备',icon:'me-icon-equipment'},
  },
];
