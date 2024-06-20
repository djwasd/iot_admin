

<template>
  <div>
    <el-dialog
        v-model="dialog_visible"
        class="dialog_css"
        width="700"
        :before-close="handle_close"
    >
      <template #header>
        <div class="dialog_header">
          {{ t('添加') }}{{t('通行周期')}}
        </div>
        <div class="dialog_buttom"></div>
      </template>
      <el-form
          ref="travel_ref"
          :model="travel_form"
          label-width="auto"
          style="max-width: 460px"
          :rules="rules"
      >
        <el-form-item :label="t('通行周期')+t('名称')" class="form_item"  prop="name">
          <el-input
              :placeholder="t('请输入') + t('名称') "
              v-model="travel_form.name"
              autocomplete="off"
              clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="t('周期模式')" class="form_item"  prop="type">
          <el-radio-group v-model="travel_form.type"  class="ml-4">
            <el-radio :value="1" size="large">{{t('每日')}}</el-radio>
            <el-radio :value="2" size="large">{{t('每周')}}</el-radio>
          </el-radio-group>

        </el-form-item>
        <el-form-item v-if="travel_form.type===1" :label="t('选择时间')" class="form_item"  >
          <el-time-picker
              v-model="travel_time"
              is-range
              range-separator="-"
              :start-placeholder="t('开始')+t('时间')"
              :end-placeholder="t('结束')+t('时间')"
              value-format="x"
          />
        </el-form-item>
        <el-form-item v-if="travel_form.type===2" :label="t('选择时间')" class="form_item"  >
          <time_table :edit_data="edit_time_data" :traverStatus="traver_status" @save_time="handle_time_save"></time_table>
        </el-form-item>

      </el-form>
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

import time_table from '../time_table/index.vue'
import {useLocalesI18n} from "@/locales/hooks";
import {type FormInstance, FormRules} from "element-plus";
import {useUserStore} from "@/store";
import {formatTimes, transformTimeStamps,timeToTimestamp} from "@/utils/packagingmethod/time";
const { t } = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'authorization']);

const dialog_visible = ref(false)
const props = defineProps({  //父组件爱你传递过来的弹框状态
  dialog: {
    type:  Boolean as PropType<boolean>,
    default: false
  },
  editDate:{
    type:  Object as PropType<object>,
    default: {}
  },
  traverStatus:{
    type:  Boolean as PropType<boolean>,
    default: {}
  }
})
const emit = defineEmits();   //定义子组件传递方法
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const travel_form =ref({
  name:'',
  type:1, //【1-每日；2-每周】
  times:[
    {
      endTime:"00:00:00",
      startTime:'23:59:59'
    }
  ]
})
const travel_date = ref({
  name:'',
  type:1, //【1-每日；2-每周】
  times:[
    {
      endTime:"00:00:00",
      startTime:'23:59:59'
    }
  ]
})
const travel_ref = ref<FormInstance>(); //拿到当前ref实力
const travel_tow =ref([])//状态2的数据
const rules = computed<FormRules>(() => ({
  name: [
    {
      required: true,
      message: t('通行周期')+t('不能为空'),
      trigger: 'blur',
    },
  ],
  type: [
    {
      required: true,
      message: t('周期模式')+t('不能为空'),
      trigger: 'blur',
    },
  ],
}));
const traver_status =ref('')//当前状态
const travel_time = ref([
  1704038400000,2082643199999
])
const edit_time_data = ref([])//编辑的时候接手的数组
const handle_close = () => {
  if (!travel_ref.value) return
  travel_ref.value.resetFields()
  dialog_visible.value = false
  emit("save_dialog", dialog_visible.value,'cancel');
}

const handle_save = ()=>{
  travel_ref.value?.validate(async (valid, fields) => {
    if (valid) {
      if (travel_form.value.type ===1 ){
        console.log('走这里')
      const  convertedTime = travel_time.value.map(timestamp => formatTimes(timestamp));
        console.log(convertedTime,'---convertedTime')
        travel_form.value.times = []
        travel_form.value.plotId =plotId
        if (travel_form.value.times.length ===0){
          travel_form.value.times.push( {
            endTime:"00:00:00",
            startTime:'23:59:59'
          })
        }
        console.log( travel_form.value,'-- travel_form.value')
        travel_form.value.times[0].endTime =convertedTime[1]
        travel_form.value.times[0].startTime =convertedTime[0]
      }else {
        travel_form.value.times = travel_tow.value
        travel_form.value.plotId =plotId
      }
      console.log(travel_form.value,'---travel_form.value')
      dialog_visible.value = false
      emit("save_dialog", dialog_visible.value,'save',travel_form.value);
    } else {
      console.log('提交错误', fields);
    }
  });


}
const handle_time_save = (data:any)=>{
  travel_tow.value = transformTimeStamps(data);
  console.log('表格传上来的数据')
}
watch(
    [() => props.dialog, () => props.editDate,()=>props.traverStatus],
    async ([newVal, new_editDate,new_status]) => {
      dialog_visible.value = newVal
      traver_status.value = new_status
      if ( new_status ==='add'){
        travel_form.value = JSON.parse(JSON.stringify( travel_date.value))
        travel_time.value = [1704038400000,2082643199999]
      }else {
        travel_form.value = JSON.parse(JSON.stringify(new_editDate))
        if ( travel_form.value.type ===1){
          console.log('111----11111')
          console.log( travel_form.value,'-- travel_form.value')
          travel_time.value[0] = timeToTimestamp( travel_form.value.times[0].startTime);
          travel_time.value[1] = timeToTimestamp( travel_form.value.times[0].endTime);
          edit_time_data.value = []
          travel_form.value.times = []
        }else  {
          travel_time.value = [1704038400000,2082643199999]
          edit_time_data.value = travel_form.value.times
        }

      }
    },
    { immediate: true }
);


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
