import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'device',
    component: () => import('@/views/management/device/index.vue'),
    meta: { title: '设备管理',icon:'me-icon-device'},
  },
];
