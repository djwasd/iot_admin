import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { concatObjectValue } from '@/utils/helper';
export const routes: RouteRecordRaw[] = [
    {
        path: '/management',
        component: Layout,
        children: concatObjectValue<RouteRecordRaw>(import.meta.glob('./management/*.ts', { eager: true, import: 'routes' })),
        meta: { title: '设备管理',icon: 'me-icon-management'},
    },
];
