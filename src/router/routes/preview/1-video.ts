import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
    {
        path: 'video',
        component: () => import('@/views/preview/video/index.vue'),
        meta: { title: '视频预览',icon:'me-icon-video'},
    },
];
