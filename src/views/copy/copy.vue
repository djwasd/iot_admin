<template>
  <div class="person">
    <div class="device">{{ t('访客登记') }}</div>
    <div class="function">
      <div class="function_left">
        <el-button type="primary">{{ t('添加授权组') }}</el-button>
      </div>

    </div>
  </div>
</template>



<script setup lang="ts">
import {useLocalesI18n} from "@/locales/hooks";
import {useUserStore} from "@/store";
const { t } = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'authorization']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
</script>



<style scoped lang="scss">
.person {
  width: 100%;
  height: 85vh;
  //padding: 16px;
  background-color: #ffffff;
  .device {
    font-size: 18px;
    padding: 20px 0 0 20px;
    font-weight: 700;
  }
  .function {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    .function_left {
      .dropdown {
        margin: 0 10px;
      }
    }


  }
}
</style>
