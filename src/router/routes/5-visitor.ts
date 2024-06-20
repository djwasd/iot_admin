import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { concatObjectValue } from '@/utils/helper';
export const routes: RouteRecordRaw[] = [
    {
        path: '/visitor',
        component: Layout,
        children: concatObjectValue<RouteRecordRaw>(import.meta.glob('./visitor/*.ts', { eager: true, import: 'routes' })),
        meta: { title:'访客管理', icon: 'me-icon-visitor' },
    },
];
