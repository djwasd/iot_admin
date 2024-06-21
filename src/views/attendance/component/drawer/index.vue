<template>
  <div class="drawer">
    <el-drawer
        v-model="drawer"
        :before-close="handle_cancel"
        :direction="direction"
        size="45%"
    >
      <template #header>
        <div class="drawer_header">
          {{drawer_status ==='add'?t('新建'):t('编辑')}}{{ t('规则') }}
        </div>
      </template>
      <template #default>
        <div class="drawer_buttom"></div>
        <el-form
            ref="rule_ref"
            :model="rule_form"
            :rules="rules"
            class="demo-ruleForm"
            label-width="auto"
            status-icon
            style="max-width: 700px"
        >
          <el-form-item :label="t('规则名称')" prop="name">
            <el-input
                v-model="rule_form.name"
                :placeholder="t('请输入规则名称') "
                autocomplete="off"
                clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item :label="t('考勤类型')" prop="radio">
            <div>
              <el-radio-group v-model="rule_form.type" @change="handle_radio_group">
                <div class="drawer_radio">
                  <el-radio :value="1">{{ t('固定班制') }}<span class="box">{{ t('(所有人按照相同时间打卡)') }}</span>
                  </el-radio>
                  <span class="box"></span>
                </div>
                <div class="drawer_radio">
                  <el-radio :value="2">{{ t('排版制') }}<span class="box">{{ t('(不同人员按照各自排班打卡)') }}</span>
                  </el-radio>
                  <span class="box"></span>
                </div>
                <div class="drawer_radio">
                  <el-radio :value="3">{{ t('自由班制') }}<span
                      class="box">{{ t('(上下班时间不固定,可随时打卡)') }}</span></el-radio>
                  <span class="box"></span>
                </div>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item :label="t('考勤人员')">
            <el-button class="item_btn" @click="handle_personnel">{{drawer_status ==='add'? t('添加人员'):t('编辑人员') }}</el-button>
          </el-form-item>

          <el-form-item v-if="rule_form.type===2" :label="t('考勤班次')">
<!--            <el-button class="item_btn" @click="handle_shift">{{drawer_status ==='add'? t('添加班次'):t('编辑班次')  }}</el-button>-->
            <el-button class="item_btn" @click="handle_shift">{{t('添加班次')  }}</el-button>

            <el-table
                ref="table_ref"
                :data="shift_all.records"
                style="width: 100%"
                height="300"
                @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"/>
              <el-table-column :label="t('班次名称')" prop="name" width="80">
              </el-table-column>
              <el-table-column :label="t('上班时间')" prop="startTime" width="100"></el-table-column>
              <el-table-column :label="t('下班时间')" prop="endTime" width="100"></el-table-column>
              <el-table-column :label="t('操作')" fixed="right" width="120">
                <template #default="{row}">
                  <el-button link size="small" type="primary" @click="handle_shift_del(row)">{{ t('删除') }}</el-button>
                </template>

              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item v-if="rule_form.type===2" :label="t('自动对班')">
            <el-switch v-model="rule_form.isAutomaticShiftAlignment"></el-switch>
            <span class="item_switch">{{ t('开启后,系统根据打卡时间自动匹配最接近的班次') }}</span>
          </el-form-item>
          <el-form-item v-if="rule_form.type===1 || rule_form.type===3" :label="t('考勤时间')">
            <time_table :data="rule_form.attendanceRuleSchedulingList" @save_time="handle_save_time" :status="drawer_status" ></time_table>
          </el-form-item>
<!--          <el-form-item v-if="rule_form.type===3" :label="t('考勤时间')">-->
<!--            <free_table></free_table>-->
<!--          </el-form-item>-->
          <el-form-item v-if="rule_form.type===3" :label="t('最小工作时间')">

            <el-input
                v-model.number="rule_form.minWorkTime"
                :placeholder="t('最小工作时间单位:小时')"
                style="width:100px"
            >
            </el-input>
            <span>(h)</span>
          </el-form-item>
          <el-form-item v-if="rule_form.type===3" :label="t('工作时长限制')">

            <el-switch v-model="rule_form.isWorkingHoursLimit"/>
          </el-form-item>
          <el-form-item v-if="rule_form.type=== 1 || rule_form.type===3 " :label="t('节假日排休')">
            <el-switch v-model="rule_form.isHolidayOff"/>
            <el-select
                v-model="rule_form.holidayPlanId"
                class="holiday_select"
            >
              <el-option
                  v-for="(item,index) in plans_data.records"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              >
              </el-option>

            </el-select>
          </el-form-item>
          <el-form-item v-if="rule_form.type===1 || rule_form.type===3" :label="t('特殊日期')">
            <el-button class="item_btn" @click="handle_check_dialog('special_work')">{{drawer_status ==='add'? t('添加'):t('编辑')}}{{ t('必须打卡日期') }}
            </el-button>
            <el-button class="item_btn" @click="handle_check_dialog('special_not_work')" >{{drawer_status ==='add'?t('添加'):t('编辑')}}{{ t('不用打卡日期') }}
            </el-button>
          </el-form-item>
          <el-form-item :label="t('考勤设备')">
            <el-button class="item_btn" @click="handle_equipment">{{drawer_status ==='add'? t('添加'):t('编辑')}}{{ t('考勤设备') }}</el-button>
          </el-form-item>
          <el-form-item :label="t('加班统计')">
            <el-switch v-model="rule_form.isOvertimeStat"/>
            <span class="Overtime" @click="handle_overtime">{{ t('加班规则') }}</span>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="handle_cancel">{{ t('取消') }}</el-button>
          <el-button type="primary" @click="handle_save">{{ t('确认') }}</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
  <!--  选择人员和部门-->
  <personnel_dialog :id="rule_form.id" :data="rule_form.personList" :status="drawer_status" :dialog="person_dialog" @save_dialog='handle_save_dialog'></personnel_dialog>
  <!-- 必须打卡日期-->
  <special_work   :data="rule_form.specialWorkDateList" :status="drawer_status" :check_dialog="check_date_dia" @check_dialog="handle_check"></special_work>
  <!-- 不打卡日期-->
  <special_not_work  :data="rule_form.specialNotWorkDateList"  :status="drawer_status" :special_not_dialog="special_not_dia" @not_work_dialog="handle_not_work"></special_not_work>
  <!--选择考勤设备-->
  <equipment_dialog :status="drawer_status" :id="rule_form.id" :data=" rule_form.attendanceRuleDeviceList"  :equipment_dia="equipment" @save_equipment_dia="handle_save_equipment"></equipment_dialog>
  <!--  加班规则-->

  <overtime_dialog :data="rule_form.overtimeRuleList"   :status="drawer_status" :overtime="overtime_dia" @overtime_dialog="handle_overtime_dialog"></overtime_dialog>
  <!--添加班次的弹框-->
  <shift_dialog :shift_dialog="shift_dia" @save_shift_dialog="handle_shift_dialog"></shift_dialog>
</template>

<script lang="ts" setup>

import {shiftTimestamp} from "@/utils/packagingmethod/time";
import time_table from '../time_table/index.vue'
// import free_table from '../free_table/index.vue'

import personnel_dialog from '../personnel_dialog/index.vue'
import equipment_dialog from '../equipment_dialog/index.vue'
import overtime_dialog from '../overtime_dialog/index.vue'
import shift_dialog from '../shift_dialog/index.vue'

import special_work from '@/views/attendance/component/special_work/index.vue'
import special_not_work from '@/views/attendance/component/special_not_work/index.vue'
import {DrawerProps, type FormInstance, FormRules} from 'element-plus'
import {useLocalesI18n} from "@/locales/hooks";
import {attendance_list, holiday_plan, shift_del} from "@/api/attendance";
import {useUserStore} from "@/store";
import {message} from "@/utils/components/message";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'attendance']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId //组织id
const plans_data =ref({
  "records": [
    {
      "id": "1",
      "name": "中国大陆法定节假日",
      "sort": 0
    }
  ],

})// 当前假日计划列表
const person_dialog = ref(false)  //考勤人员弹框状态
const check_date_dia = ref(false) //必须打卡日期的弹框
const drawer = ref(false)  //当前抽屉的状态
const special_not_dia = ref(false)
const rule_ref = ref<FormInstance>(); //拿到当前ref实力
const equipment = ref(false)//考勤弹框的状态
const overtime_dia = ref(false)//加班规则弹框状态
const shift_dia = ref(false)//添加班次的弹框
const direction = ref<DrawerProps['direction']>('rtl')  //抽屉开启的方向
const props = defineProps({  //父组件爱你传递过来的弹框状态
  drawer_flag: {
    type: Object as PropType<object>,
    default: {}
  },
})
const emit = defineEmits();   //定义子组件传递方法.
const table_ref =ref(null)//当前考勤班次的示例
const rule_form = ref<any>({
  name: '',//*规则名称:
  type: 1, //*规则名称:
  holidayPlanId: 0, //节假日计划Id
  isHolidayOff: false, //是否节假日排休
  specialWorkDateList: [],//考勤规则打卡日期数组
  specialNotWorkDateList: [],//考勤规则不用打卡日期数组
  personList: [],//人员集合
  orgList: [],//(考勤规则的部门(组织)DTO) 部门(组织)集合
  attendanceRuleDeviceList: [],//考勤规则设备DTO) {2}]
  isOvertimeStat: false,//是否开启加班统计
  overtimeRuleList: [],//考勤规则加班规则新增DTO)
  classIds: [], //班次Id集合[排版制特有]
  isAutomaticShiftAlignment: false,//自动对班
  minWorkTime: 0,//最小工作时间[单位: 小时
  isWorkingHoursLimit: false,//是否开启工作时长限制
})  //真是数据
const rules = computed<FormRules>(() => ({
  name: [
    {required: true, message: t('规则名称') + t('不能为空'), trigger: 'blur'},
  ],
  type: [
    {required: true, message: t(' ') + t('不能为空'), trigger: 'blur'},
  ],


}));
const multipleSelection = ref([])//添加班次选中的数据
const drawer_status = ref('') //当前抽屉是编辑还是添加
const shift_all = ref({
  "records": [
    {
      "name": "1",
      "week": null,
      "startTime": "11:42:46",
      "endTime": "18:42:46"
    }
  ],}
)
//点击考勤人员按钮 弹出dialog
const handle_personnel = () => {
  person_dialog.value = true
}
//personnel_dialog 考勤人员组建回调上来的数据
const handle_save_dialog = (dialog_status: boolean, status: string,data:any) => {
  person_dialog.value = dialog_status
  if (status ==='cancel')return true
  rule_form.value.personList = data
}
//打卡组建传上来的数据
const handle_check = (dialog_status: boolean, status: string, date: Array<number>) => {
  check_date_dia.value = dialog_status
  if (status ==='cancel')return true
  rule_form.value.specialWorkDateList = date  //考勤规则不用打卡日期数组
}

const handle_not_work = (dialog_status: boolean, status: string, date: Array<number>) => {
  special_not_dia.value = dialog_status
  if (status ==='cancel')return true

  rule_form.value.specialNotWorkDateList = date  //考勤规则打卡日期数组
}
// 添加必须打卡日期
const handle_check_dialog = (status: string) => {
  if (status === 'special_work') {
    check_date_dia.value = true //打卡日期弹框
  } else {
    special_not_dia.value = true
  }
}
//点击添加考勤设备
const handle_equipment = () => {
  equipment.value = true //改变考勤弹框的状态
}
//点击考勤弹框传递上来的数据
const handle_save_equipment = (dialog_status: boolean, status: string,data:any) => {
  equipment.value = dialog_status
  if (status ==='cancel')return true
  rule_form.value.attendanceRuleDeviceList = data

}
//考勤时间组建返回上来的数据
const handle_save_time = (data:any)=>{
  rule_form.value.attendanceRuleSchedulingList = data
}

//抽屉取消
const handle_cancel = () => {
  if (!rule_ref.value) return
  rule_ref.value.resetFields()
  drawer.value = false
  emit("save", drawer.value, 'cancel');
}
//抽屉确认
const handle_save = () => {
  rule_ref.value?.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      drawer.value = false
      emit("save", drawer.value, 'save',rule_form.value,drawer_status.value);
    } else {
      console.log('提交错误', fields);
    }
  })
}
//点击加班规则
const handle_overtime = () => {
  overtime_dia.value = true
}
//加班统计返回上来的状态数据
const handle_overtime_dialog = (dialog_status: boolean, status: string,list:any) => {
  overtime_dia.value = dialog_status
  if (status == 'cancel') return true
  rule_form.value.overtimeRuleList = list
}
//添加班次
const handle_shift = () => {
  shift_dia.value = true
}
//添加班次返回的数据
const handle_shift_dialog =async (dialog_status: boolean, status: string) => {
  shift_dia.value = dialog_status
  if (status == 'cancel') return true
  await shift_init(plotId)

}
//添加班次table选中的框
const handleSelectionChange = (val: any) => {
  multipleSelection.value =val.map(item => item.id);
  // classIds
  rule_form.value.classIds =  multipleSelection.value
}

const handle_shift_del = (row: any) => {
  ElMessageBox.confirm(
      t('将删除您所勾选的班次，是否确认?'),
      t('删除确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(async () => {

        await  del_shift(row.id)

      })
      .catch(() => {
        message(t('取消批量删除'),{ type: "error" })

      })
}
//点击修改考勤类型
const handle_radio_group = async (value: number) => {

  rule_form.value.attendanceRuleDeviceList = []//点击切换让考勤时间为空数据
  rule_form.value.isHolidayOff = false // 是否节假日排休
  rule_form.value.specialWorkDateList = [] //考勤规则打卡日期数组
  rule_form.value.specialNotWorkDateList = []   //考勤规则不用打卡日期数组
  rule_form.value.classIds = []  //切换的时候考勤班次也为空
  rule_form.value.isAutomaticShiftAlignment = false //是否自动对班
  rule_form.value.minWorkTime = 0 //最小工作时间[单位: 小时
  rule_form.value.isWorkingHoursLimit = false //是否开启工作时长限制
  if (value === 2) {
    await shift_init(plotId)
  }

}
//获取节假日列表
const holiday_plan_all = async  (plotId:number,name?:string)=>{
  const res =await holiday_plan(plotId,name)
  if (res.data.code===200){
    plans_data.value = res.data.data

  }
}
const shift_init =async (plotId:number, page?:any,size?:any)=>{
  const res =await attendance_list(plotId,page,size)
   shift_all.value = res.data.data
}
const del_shift = async (id:string) => {
  const res = await shift_del({
    id: id
  })
  if (res.data.code ===200){
    await shift_init(plotId)
    message(t('删除成功'),{type:'success'})
  }else {
    message(res.data.message,{type:'error'})

  }
}
const toggleSelection =(list:any,status:string)=>{
  if (table_ref.value){
    if (status === 'add'){
        shift_all.value.records.forEach((row: any) => {
        table_ref.value.toggleRowSelection(row, false); // 默认勾选
      })
    }else {
      let filter_data = shift_all.value.records.filter(itemB => list.some(itemA => itemA.id === itemB.id));
      filter_data.forEach((row:any)=>{
        table_ref.value.toggleRowSelection(row, true); // 默认勾选
      })
    }
  }
}
const init_toggleSelection =(data:any,status:string)=>{
  nextTick(() => {
    toggleSelection(data,status)
  })
}

onMounted(async ()=>{
 await  holiday_plan_all(plotId)//获取初始部门列表
})
watch(() => props.drawer_flag,
  async  (newVal) => {
      drawer.value = newVal.drawer;
      rule_form.value = JSON.parse(JSON.stringify(newVal.attendance))
      drawer_status.value = newVal.status
    if ( rule_form.value.type === 2 && drawer_status.value ==='edit'){
     await shift_init(plotId)
      init_toggleSelection( rule_form.value.attendanceRuleSchedulingList,'edit')
      multipleSelection.value = rule_form.value.attendanceRuleSchedulingList
    }else if (rule_form.value.type === 2 && drawer_status.value ==='add'){
      init_toggleSelection( rule_form.value.attendanceRuleSchedulingList,'add')
    }
    },
    {deep: true},
);


</script>

<style lang="scss" scoped>
.drawer {
  .drawer_header {
    font-size: 18px;
    color: #333333;
    //border-bottom: 1px solid #333333;
  }

  .drawer_buttom {
    height: 1px;
    border: 1px solid #ebedf0;
    margin: -20px 0 16px 0;
    width: 100%;

  }

  .demo-ruleForm {
    .drawer_radio {
      display: flex;
      flex-direction: column;

      .box {
        margin-left: 5px;
        color: #999999;
        font-size: 12px;
      }

    }

    .holiday_select {
      width: 200px;
      padding-left: 20px;
    }

    .item_btn {
      width: 120px;
      border: 1px solid #3B81F4;
      color: #3B81F4;

    }

    .item_switch {
      font-size: 12px;
      color: #999999;
      padding-left: 5px;
    }

    .Overtime {
      padding-left: 20px;
      color: #3b81f4;
      cursor: pointer;
    }
  }
}
</style>
