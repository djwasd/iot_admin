import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
    {
        path: 'sub',
        component: () => import('@/views/system/sub/index.vue'),
        meta: { title: '子账号管理',icon:'me-icon-sub'},
    },
];
