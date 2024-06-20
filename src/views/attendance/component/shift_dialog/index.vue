<template>
  <div>
    <el-dialog
        v-model="dialog_visible"
        :before-close="handle_close"
        class="dialog_css"
        width="700"
    >
      <template #header>
        <div class="dialog_header">
          {{ t('添加班次') }}
        </div>
        <div class="dialog_buttom"></div>
      </template>
      <el-form
          ref="shift_ref"
          :model="shift_list"
          :rules="rules"
          label-width="auto"
          style="max-width: 400px"
      >
        <el-form-item :label="t('班次名称')" class="form_item" prop="name">
          <el-input
              style="width: 220px"
              v-model="shift_list.name"
              autocomplete="off"
              clearable
          >
          </el-input>
        </el-form-item>


        <el-form-item :label="t('上班时间')" class="form_item" prop="startTime">
          <el-time-picker v-model="shift_list.startTime"  value-format="x" />
        </el-form-item>
        <el-form-item :label="t('下班时间')" class="form_item" prop="endTime">
          <el-time-picker v-model="shift_list.endTime" value-format="x"    />
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handle_close">{{ t('取消') }}</el-button>
          <el-button type="primary" @click="handle_save">{{ t('确认') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {computed, defineProps, PropType} from "vue";
import {useLocalesI18n} from "@/locales/hooks";
import {FormInstance, FormRules} from "element-plus";
import {message} from "@/utils/components/message";
import {attendance_shift} from "@/api/attendance";
import {useUserStore} from "@/store";
import {
  convertArrayToTimestamps,
  convertTimeToTimestamp, format_time,
  formatendTime,
  formatstartTime
} from "@/utils/packagingmethod/time";

const shift_ref = ref<FormInstance>(); //拿到当前ref实力
const {t} = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'person_table']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId //组织id
const dialog_visible = ref(false)
const props = defineProps({  //父组件爱你传递过来的弹框状态
  shift_dialog: {
    type: Boolean as PropType<boolean>,
    default: false
  },
})
const emit = defineEmits();   //定义子组件传递方法
interface RuleForm {
  name: string,
  startTime: any
  endTime: any
  plotId:any

}
const shift_list = ref<RuleForm>({
  name: '',
  startTime: null,
  endTime:null,
  plotId:plotId
})
const shift_list_date = ref<RuleForm>({
  name: '',
  startTime: null,
  endTime:null,
  plotId:plotId

})

const rules = computed<FormRules>(() => ({
  name: [
    {
      required: true,
      message: t('班次名称') + t('不能为空'),
      trigger: 'blur',
    },

  ],
  startTime: [
    {
      required: true,
      message: t('上班时间') + t('不能为空'),
      trigger: 'blur',
    },

  ],
  endTime: [
    {
      required: true,
      message: t('下班时间') + t('不能为空'),
      trigger: 'blur',
    },

  ],

}));
const handle_close = () => {
  if (!shift_ref.value) return
  console.log('取消')
  dialog_visible.value = false
  emit("save_shift_dialog", dialog_visible.value, 'cancel');

}
const attendance_add =async (data:any) => {
  const res = await attendance_shift(data)
  if (res.data.code ===200){
    message(t('添加班次')+t('成功'),{type:'success'})
  }else {
    message(res.data.message,{type:'error'})
  }
}
const handle_save = () => {
  shift_ref.value?.validate( (valid:any, fields:any) => {
    if (valid) {
      if ( shift_list.value.startTime> shift_list.value.endTime){
           message(t('上班时间不能大于下班时间'),{type:'error'})
        return true
      }
      console.log('确认')
      console.log(shift_list.value,'--shift_list.value')

      shift_list.value.startTime = format_time(shift_list.value.startTime)
      shift_list.value.endTime = format_time(shift_list.value.endTime)
      attendance_add(shift_list.value)

      console.log(shift_list.value,'--shift_list.value')
      dialog_visible.value = false
      emit("save_shift_dialog", dialog_visible.value, 'save');
    } else {
      console.log('提交错误', fields);
    }

})
}
watch(() => props.shift_dialog,
    (newVal) => {
      dialog_visible.value = newVal
      shift_list.value = JSON.parse(JSON.stringify(shift_list_date.value))
    });
</script>

<style lang="scss" scoped>
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
    width: 680px;

  }
}

</style>
