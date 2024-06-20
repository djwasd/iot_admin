
import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
    {
        path: 'firmware',
        component: () => import('@/views/management/firmware/index.vue'),
        meta: { title: '固件管理',icon:'me-icon-device'},
    },
];
