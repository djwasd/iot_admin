import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
    {
        path: 'traffic_records',
        component: () => import('@/views/authorization/traffic_records/index.vue'),
        meta: { title: '通行记录',icon:'me-icon-traffic_records'},
    },
];
