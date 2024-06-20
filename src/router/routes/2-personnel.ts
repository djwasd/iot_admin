import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { concatObjectValue } from '@/utils/helper';
export const routes: RouteRecordRaw[] = [
  {
    path: '/personnel',
    component: Layout,
    children: concatObjectValue<RouteRecordRaw>(import.meta.glob('./personnel/*.ts', { eager: true, import: 'routes' })),
    meta: { title: '人员管理' ,icon: 'me-icon-personnel'},
  },
];
