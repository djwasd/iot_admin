import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
    {
        path: 'playback',
        component: () => import('@/views/preview/playback/index.vue'),
        meta: { title: '视频回放',icon:'me-icon-video',hideMenu:true},
    },
];
