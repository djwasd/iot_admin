import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'configuration',
    component: () => import('@/views/personnel/configuration/index.vue'),
    meta: { title: '人员配置',icon:'me-icon-configuration'},
  },
];
