
import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
    {
        path: 'binding',
        component: () => import('@/views/intercom/binding/index.vue'),
        meta: { title: '对讲绑定',icon:'me-icon-binding'},
    },
];
