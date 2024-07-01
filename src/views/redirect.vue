<template>
  <span></span>
</template>
<script lang="ts" name="Redirect" setup>
import {useRouteStore} from '@/store';

const route = useRoute();
const router = useRouter();
const fullPath = route.params.path as string;
const routeStore = useRouteStore();
routeStore.cacheFullPath.delete(fullPath);
onMounted(() => router.replace(fullPath));
</script>
