<template>
  <div>
    <el-drawer
        v-model="props.device_dia"
        :before-close="handle_cancel"
        class="drawer"
        direction="rtl"
        size="45%"
    >
      <template #header>
        <div class="drawer_header">
          {{ t('设备授权') }}
        </div>
      </template>
      <template #default>
        <div class="drawer_buttom"></div>
        <div class="function">
          <div class="function_left">
            <el-button type="primary">{{ t('添加人员') }}</el-button>

          </div>
          <div class="function_right">
            <div class="search-wrapper">
              <el-input
                  v-model="search_person"
                  :placeholder="t('请输入姓名或ID')"
              >
                <template #append>
                  <el-button icon="mel-icon-search"/>
                </template>
              </el-input>
            </div>
          </div>
        </div>


      </template>
    </el-drawer>
  </div>
</template>


<script lang="ts" setup>
import {PropType} from "vue";
import {useLocalesI18n} from "@/locales/hooks";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'authorization']);
const drawer = ref(false)//当前弹框的状态
const props = defineProps({  //父组件爱你传递过来的弹框状态
  device_dia: {
    type: Boolean as PropType<boolean>,
    default: false
  },
})
const emit = defineEmits();   //定义子组件传递方法
const search_person = ref<string>('')//搜索对应的


//抽屉取消
const handle_cancel = () => {
  console.log('取消')
  drawer.value = false
  emit("save_device", drawer.value, 'cancel');
}
watch([() => props.device_dia,],
    async ([new_drawer_flag]) => {
      drawer.value = new_drawer_flag
    });
</script>


<style lang="scss" scoped>
.drawer {
  .drawer_header {
    font-size: 18px;
    color: #333333;
  }

  .drawer_buttom {
    height: 1px;
    border: 1px solid #ebedf0;
    margin: -20px 0 16px 0;
    width: 100%;
  }

  .function {
    padding: 16px 0;
    display: flex;
    justify-content: space-between;

    .function_right {
      .search-wrapper {
        position: relative;
        display: inline-block;

        .icon {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          cursor: pointer;
        }
      }

      el-input {
        padding-right: 30px; // 调整输入框的右侧内边距以容纳图标
      }
    }

    .function_left {
      .dropdown {
        margin: 0 10px;
      }
    }


  }


}

</style>
