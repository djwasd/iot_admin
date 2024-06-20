<template>
  <el-dropdown class="me-size-select" trigger="click" max-height="500px">
    <div class="flex-center pointer" v-bind="$attrs">
      <el-avatar size="small" class="avatar" src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif" />
      <span v-if="!globalStore.isMobile" class="ellipsis-2">{{ userStore.user.username }}</span>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <router-link to="/">
          <el-dropdown-item>
            {{ $t('首页') }}
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided @click="switch_back">
          {{ $t('切回至主账号') }}
        </el-dropdown-item>
        <el-dropdown-item divided @click="userStore.logOut()">
          {{ $t('退出登录') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="User">
import { useGlobalStore, useUserStore } from '@/store';
import {message} from "@/utils/components/message";
import {useLocalesI18n} from "@/locales/hooks";
const { t } = useLocalesI18n({}, [(locale: string) => import(`../../../../../../lang/${locale}.json`), 'person_table']);

const userStore = useUserStore();
console.log(userStore,'--userStore')
const globalStore = useGlobalStore();
const UserStore = useUserStore()

const switch_back =async () => {
  if (!localStorage.getItem('user_copy')) {
 return   message(t('当前账号为主账号'),{type:'error'})
  }
  let a: any = JSON.parse(localStorage.getItem('user_copy') as string);
  localStorage.setItem('user', JSON.stringify(a));
  await UserStore.init_dashboard();
  window.location.reload();

}
</script>
<style lang="scss" scoped>
.flex-center {
  max-width: 150px;
  padding: 0 10px;
  line-height: 120%;

  .avatar {
    margin-right: 5px;
    flex-shrink: 0;
  }

}
</style>
