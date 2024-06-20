import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { concatObjectValue } from '@/utils/helper';
export const routes: RouteRecordRaw[] = [
    {
        path: '/intercom',
        component: Layout,
        children: concatObjectValue<RouteRecordRaw>(import.meta.glob('./intercom/*.ts', { eager: true, import: 'routes' })),
        meta: { title:'对讲管理', icon: 'me-icon-intercom' },
    },
];
