import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { concatObjectValue } from '@/utils/helper';
export const routes: RouteRecordRaw[] = [
    {
        path: '/system',
        component: Layout,
        children: concatObjectValue<RouteRecordRaw>(import.meta.glob('./system/*.ts', { eager: true, import: 'routes' })),
        meta: { title:'系统设置', icon: 'me-icon-system' ,alwaysShow: true },
    },
];
