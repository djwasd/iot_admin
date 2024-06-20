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
          {{ t('加班规则') }}
        </div>
        <div class="dialog_buttom"></div>
      </template>
      <el-form
          ref="ruleFormRef"
          :model="overtime_date"
          :rules="rules"
          class="demo-ruleForm"
          label-position='left'
          label-width="auto"
          status-icon
          style="max-width: 600px"
      >
<!--        <el-form-item :label="t('最小计时单位')" prop="minTimeUnit">-->
<!--          <el-select-->
<!--              v-model="overtime_date.minTimeUnit"-->
<!--              size="large"-->
<!--              style="width: 240px"-->
<!--          >-->
<!--            <el-option-->
<!--                v-for="item in options"-->
<!--                :key="item.value"-->
<!--                :label="item.label"-->
<!--                :value="item.value"-->
<!--            />-->
<!--          </el-select>-->
<!--          <span class="select_text">系统按半小时统计考勤报表，不足半小时的部分不计入，例如0.8小时将按0.5小时计入 </span>-->
<!--        </el-form-item>-->
        <el-form-item>
          <el-tabs v-model="overtime_date.type" class="demo_tabs" @tab-click="handleClick">
            <el-tab-pane :label="t('工作日')" class="tab_pane" :name="1">
              <el-form-item :label="t('是否统计加班')">
                <el-switch v-model="week_day.flag"/>
              </el-form-item>
              <el-form-item >
                <div class="week_div">
                  <span>{{ t('下班') }}</span>
                  <el-input v-model="week_day.offDutyPassTime"
                            style="width: 100px;padding-left: 10px"
                            @keyup="week_day.offDutyPassTime=regular(week_day.offDutyPassTime,'integer')"

                  ></el-input>

                  <span class="week_span">{{ t('分钟后开始统计加班时长') }}</span>
                </div>
              </el-form-item>


              <div class="week_div">
                <span>{{ t('最短加班时长') }}</span>
                <el-input v-model="week_day.shortestTime"
                          style="width: 100px;padding-left: 10px"

                          @keyup="week_day.shortestTime=regular(week_day.shortestTime,'integer')"

                ></el-input>
                <span class="week_span">{{ t('分钟') }}</span>
                <span class="week_span" style="color:#999999;">({{ t('当天加班不足30分钟不计为加班') }})</span>
              </div>
              <!--              <el-form-item :label="t('下班')" class="week_day"  >-->
              <!--               -->
              <!--              </el-form-item>-->
            </el-tab-pane>
            <el-tab-pane :label="t('休息日')" class="tab_pane" :name="2">
              <el-form-item :label="t('是否统计加班')">
                <el-switch v-model="Rest.flag"/>
              </el-form-item>
              <div class="week_div">
                <span>{{ t('最短加班时长') }}</span>
                <el-input v-model="Rest.shortestTime"
                          style="width: 100px;padding-left: 10px"

                          @keyup="Rest.shortestTime=regular(Rest.shortestTime,'integer')"

                ></el-input>
                <span class="week_span">{{ t('分钟') }}</span>
                <span class="week_span" style="color:#999999;">({{ t('当天加班不足30分钟不计为加班') }})</span>
              </div>

            </el-tab-pane>
            <el-tab-pane :label="t('节假日')" class="tab_pane" :name="3">
              <el-form-item :label="t('是否统计加班')">
                <el-switch v-model="Holiday.flag"/>
              </el-form-item>
              <div class="week_div">
                <span>{{ t('最短加班时长') }}</span>
                <el-input v-model="Holiday.shortestTime"
                          style="width: 100px;padding-left: 10px"

                          @keyup="Holiday.shortestTime=regular(Holiday.shortestTime,'integer')"

                ></el-input>
                <span class="week_span">{{ t('分钟') }}</span>
                <span class="week_span" style="color:#999999;">({{ t('当天加班不足30分钟不计为加班') }})</span>
              </div>
            </el-tab-pane>

          </el-tabs>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handle_close">{{ $t('取消') }}</el-button>
          <el-button type="primary" @click="handle_save">{{ $t('确认') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {useLocalesI18n} from "@/locales/hooks";
import {FormRules} from "element-plus";
import {regular} from "@/utils/packagingmethod/input_rules";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'person_table']);
const overtime_date = ref<any>({
  minTimeUnit: 1,  //最小计时单位[1-半小时;2-一小时;3-半天;4-一天]
  type: 1,//类型[1-工作日;2-休息日;3-节假日]
  offDutyPassTime:0,
  shortestTime:0
})
const overtime_date_copy = ref<any>({
  minTimeUnit: 1,  //最小计时单位[1-半小时;2-一小时;3-半天;4-一天]
  type: 1,//类型[1-工作日;2-休息日;3-节假日]
  offDutyPassTime:0,
  shortestTime:0
})
const rules = computed<FormRules>(() => ({
  // minTimeUnit: [
  //   {
  //     required: true,
  //     message: t('最小计时单位') + t('不能为空'),
  //     trigger: 'blur',
  //   },
  // ],
}));
const options = [
  {value: 1, label: t('半小时')},
  {value: 2, label: t('一小时')},
  {value: 3, label: t('半天')},
  {value: 4, label: t('一天')},
]
//工作日
const week_day = ref({
  flag: false,
  offDutyPassTime: 0,
  shortestTime: 0,
})
// 休息日
const Rest = ref({
  flag: false,
  offDutyPassTime: 0,
  shortestTime: 0,
})
// 节假日
const  Holiday = ref({
  flag: false,
  offDutyPassTime: 0,
  shortestTime: 0,
})
const dialog_visible = ref(false)
const props = defineProps({  //父组件爱你传递过来的弹框状态
  overtime: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  status:{
    type: String as PropType<string>,
    default: '',
  },
  data:{
    type: Array as PropType<any>,
    default:[],
  }
})
const emit = defineEmits();   //定义子组件传递方法
const handle_close = () => {
  console.log('取消')
  dialog_visible.value = false
  emit("overtime_dialog", dialog_visible.value, 'cancel');

}
//点击切换tab栏状态
const handleClick =()=>{
  week_day.value.flag = false
  week_day.value.offDutyPassTime = 0
  week_day.value.shortestTime = 0
  Rest.value.flag = false
  Rest.value.offDutyPassTime = 0
  Rest.value.shortestTime = 0
  Holiday.value.flag = false
  Holiday.value.offDutyPassTime = 0
  Holiday.value.shortestTime = 0
}
const handle_save = () => {
  if (overtime_date.value.type ===1 && week_day.value.flag ===true) {
    overtime_date.value.offDutyPassTime =week_day.value.offDutyPassTime
    overtime_date.value.shortestTime =week_day.value.shortestTime
  }else  if(overtime_date.value.type ===2 && Rest.value.flag ===true) {
    overtime_date.value.shortestTime =Rest.value.shortestTime
    overtime_date.value.offDutyPassTime =Rest.value.offDutyPassTime

  }else if (overtime_date.value.type ===3 && Holiday.value.flag ===true)  {
    overtime_date.value.shortestTime =Holiday.value.shortestTime
    overtime_date.value.offDutyPassTime =Holiday.value.offDutyPassTime
  }
  for (let key in overtime_date.value) {
    if (typeof overtime_date.value[key] === 'string') {
      overtime_date.value[key] = parseInt(overtime_date.value[key], 10);
      // 或者使用 Number() 构造函数进行转换
      // overtime_date.value[key] = Number(overtime_date.value[key]);
    }
  }
  const data = []
  data.push(overtime_date.value)
  console.log(data,'--111')
  console.log('确认')
  dialog_visible.value = false
  emit("overtime_dialog", dialog_visible.value, 'save',data);

}
const init_date = (status:string,list:any)=>{
  if (status ==='add'){
    overtime_date.value = JSON.parse(JSON.stringify(overtime_date_copy.value))
    week_day.value.flag = false
    week_day.value.offDutyPassTime = 0
    week_day.value.shortestTime = 0
    Rest.value.flag = false
    Rest.value.offDutyPassTime = 0
    Rest.value.shortestTime = 0
    Holiday.value.flag = false
    Holiday.value.offDutyPassTime = 0
    Holiday.value.shortestTime = 0
  }else {
    if (list.length ===0){
      overtime_date.value = JSON.parse(JSON.stringify(overtime_date_copy.value))
    }else {
      overtime_date.value = JSON.parse(JSON.stringify(list[0]))
      console.log('这')
      if (overtime_date.value.type === 1 ) {
        week_day.value.flag = true
        week_day.value.offDutyPassTime = overtime_date.value.offDutyPassTime;
        week_day.value.shortestTime = overtime_date.value.shortestTime;
      }
      else if (overtime_date.value.type === 2) {
        Rest.value.flag = true

        Rest.value.shortestTime = overtime_date.value.shortestTime;
        Rest.value.offDutyPassTime = overtime_date.value.offDutyPassTime;
      }
      else if (overtime_date.value.type === 3 ) {
        Holiday.value.flag = true
        Holiday.value.shortestTime = overtime_date.value.shortestTime;
        Holiday.value.offDutyPassTime = overtime_date.value.offDutyPassTime;
      }
      for (let key in overtime_date.value) {
        if (typeof overtime_date.value[key] === 'string') {
          overtime_date.value[key] = parseInt(overtime_date.value[key], 10);
          // 或者使用 Number() 构造函数进行转换
          // overtime_date.value[key] = Number(overtime_date.value[key]);
        }
      }
    }

  }
}
watch(
    [ () => props.overtime,()=>props.status,()=>props.data],
    ([newVal,newStatus,newData]) => {
      dialog_visible.value = newVal;
      console.log(newData,'--newData')
      init_date(newStatus,newData)
    }
);
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
    width: 100%;

  }

  .demo-ruleForm {
    .select_text {
      font-size: 12px;
      color: #999999;
    }

    .demo_tabs {
      .el-tabs__item {
        width: 130px;
      }

      .week_div {
        padding-top: 10px;

        .week_span {
          padding-left: 15px;
        }
      }

    }
  }

}

:deep(.el-tabs--top .el-tabs__item.is-top:nth-child(2)) {
  padding: 0 40px;
  width: 140px;
}

:deep(.el-tabs--top .el-tabs__item.is-top:last-child ) {
  padding: 0 50px;
  width: 140px;
}
</style>
