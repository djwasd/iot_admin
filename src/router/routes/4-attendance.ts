import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { concatObjectValue } from '@/utils/helper';
export const routes: RouteRecordRaw[] = [
    {
        path: '/attendance',
        component: Layout,
        children: concatObjectValue<RouteRecordRaw>(import.meta.glob('./attendance/*.ts', { eager: true, import: 'routes' })),
        meta: { title: '考勤管理', icon: 'me-icon-attendance' },
    },
];
