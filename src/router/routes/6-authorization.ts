import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { concatObjectValue } from '@/utils/helper';
export const routes: RouteRecordRaw[] = [
    {
        path: '/authorization',
        component: Layout,
        children: concatObjectValue<RouteRecordRaw>(import.meta.glob('./authorization/*.ts', { eager: true, import: 'routes' })),
        meta: { title:'授权管理', icon: 'me-icon-authorization' },
    },
];
