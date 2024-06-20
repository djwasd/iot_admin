

<template>
  <div>
    <el-dialog
        v-model="dialog_visible"
        class="dialog_css"
        width="500"
        :before-close="handle_close"
    >
      <template #header>
        <div class="dialog_header">
          {{ t('人员列表') }}
        </div>
        <div class="dialog_buttom"></div>
      </template>
      <span>This is a message</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handle_close">{{t('取消')}}</el-button>
          <el-button type="primary" @click="handle_save">{{t('确认')}}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {defineProps, PropType} from "vue";
import {useLocalesI18n} from "@/locales/hooks";
const { t } = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'person_table']);

const dialog_visible = ref(false)
const props = defineProps({  //父组件爱你传递过来的弹框状态
  dialog: {
    type:  Boolean as PropType<boolean>,
    default: false
  },
})
const emit = defineEmits();   //定义子组件传递方法
const handle_close = () => {
  console.log('取消')
  dialog_visible.value = false
  emit("save_dialog", dialog_visible.value,'cancel');

}
const handle_save = ()=>{
  console.log('确认')
  dialog_visible.value = false
  emit("save_dialog", dialog_visible.value,'cancel');

}
watch(() => props.dialog,
    (newVal) => {
      dialog_visible.value = newVal
      console.log(  dialog_visible.value, '-- 当前弹框的状态');
    });
</script>

<style scoped lang="scss">
.dialog_css {
  .dialog_header {
    font-size: 18px;
    color: #333333;
    width: 100%;
  }
  .dialog_buttom {
    height: 1px;
    border: 1px solid #A3A6AD;
    margin: 16px 0;
    width: 100%;

  }
}
</style>
