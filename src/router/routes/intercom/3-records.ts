

import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
    {
        path: 'records',
        component: () => import('@/views/intercom/records/index.vue'),
        meta: { title: '对讲绑定',icon:'me-icon-records'},
    },
];
