import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { concatObjectValue } from '@/utils/helper';
export const routes: RouteRecordRaw[] = [
    {
        path: '/preview',
        component: Layout,
        children: concatObjectValue<RouteRecordRaw>(import.meta.glob('./preview/*.ts', { eager: true, import: 'routes' })),
        meta: { title:'视频预览', icon: 'me-icon-video',alwaysShow: true },
    },
];
