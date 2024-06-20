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
          {{ t('考勤设备') }}
        </div>
        <div class="dialog_buttom"></div>
      </template>
      <div class="person">
        <div class="function">
          <div class="function_left">
            <el-button > {{ t('全选') }}</el-button>
          </div>
          <div class="function_right">
            <div class="search-wrapper">
              <el-input
                  v-model="search_person"
                  :placeholder="t('请输入设备序列号')"
              >
                <template #append>
                  <el-button icon="mel-icon-search" @click="handle_search"/>
                </template>
              </el-input>


            </div>
          </div>
        </div>
        <div class="table-wrapper">
          <el-table
              ref="multiple_Ref"
              :data="device_list.records"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              :row-key="getRowKey"

          >
            <el-table-column
                :reserve-selection="true"
                type="selection" width="55"
            />
            <el-table-column
                :index="set_index"
                :label="t('序号')"
                prop="Number"
                type="index"
                width="80">
            </el-table-column>
            <el-table-column prop="deviceName" show-overflow-tooltip :label="t('设备')+t('名称')" />
            <el-table-column prop="serialNo" show-overflow-tooltip :label="t('设备序列号')" />
            <el-table-column prop="address"  show-overflow-tooltip :label="t('设备位置')" />

          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
              v-model:current-page="current_page"
              v-model:page-size="page_size"
              layout="prev, pager, next, jumper"
              :total="device_list.total"
              @current-change="handleCurrentChange"
          />

        </div>
      </div>

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
import {useLocalesI18n} from "@/locales/hooks";
import {attendance_GroupDevice} from "@/api/attendance";
import {useUserStore} from "@/store";
import {PropType} from "vue";
const { t } = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'person_table']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const dialog_visible = ref(false)
const device_type=ref('device/master/AccessController')
const search_person = ref<string>('')
const attendanceRuleId = ref('') //当前考勤规则id
const multiple_Ref = ref() //当前table组建的实例
const new_status = ref('') //当前考勤设备的状态
const edit_selection = ref<any>()

const props = defineProps({  //父组件爱你传递过来的弹框状态
  equipment_dia: {
    type:  Boolean as PropType<boolean>,
    default: false
  },
  status:{
    type: String as PropType<string>,
    default: '',
  },
  data:{
    type: Array as PropType<any>,
    default: [],
  },
  id:{
    type: String as PropType<string>,
    default: '',
  }
})
const device_list = ref({
  records:[],
  total:0
})
const current_page = ref(0);//当前页数
const page_size = ref(12); //每页显示条目个数
const emit = defineEmits();   //定义子组件传递方法
const multipleSelection = ref([]) //选中的人数 可以考虑只传id
//拿到当前列表的序号
const set_index = (index)=>{
  if (current_page.value >=1){
    return (current_page.value -1) * page_size.value + index + 1

  }else  {
    return (current_page.value ) * page_size.value + index + 1

  }
}
const getRowKey = (row:any)=>{
  return row.id
}
const handleSelectionChange = (val:any) => {
  multipleSelection.value =val.map(item => ({ "deviceId": item.deviceId ,'devicePath':item.devicePath}));
  console.log( multipleSelection.value,'-- multipleSelection.value')

}

const handle_close = () => {
  console.log('取消')
  dialog_visible.value = false
  emit("save_equipment_dia", dialog_visible.value,'cancel');

}
const handle_save = ()=>{
  console.log('确认')
  dialog_visible.value = false
  emit("save_equipment_dia", dialog_visible.value,'save',multipleSelection.value);
}
const handleCurrentChange = (val:number) => {
  current_page.value = val;
  attendance_device_all(plotId,current_page.value,page_size.value,device_type.value,true,'',search_person.value)
  toggleSelection(edit_selection.value,new_status.value)

};
//搜索
const handle_search = () => {
  console.log('搜素',)
  attendance_device_all(plotId,0,page_size.value,device_type.value,true,'',search_person.value)
}
//获取所有数据
const attendance_device_all =async (
    plotId:number,
    page:any,
    size:any,
    deviceType:string,
    isExcludeAddedAttendanceRuleDevice:boolean,
    attendanceRuleId?:string,
    serialNo?:string
)=>{
  const res =await attendance_GroupDevice(plotId,page,size,deviceType,isExcludeAddedAttendanceRuleDevice,attendanceRuleId,serialNo)
  if (res.data.code === 200){
    device_list.value = res.data.data
  }
}
const toggleSelection = (list:any,status:string)=>{

  if (multiple_Ref.value){
    console.log('在的')
    console.log(list,'--list------------')
    console.log(status,'--status------------')
    if (status === 'add'){
      device_list.value.records.forEach((row: any) => {
        multiple_Ref.value.toggleRowSelection(row, false); // 默认勾选
      })
    }
    else  {
      console.log('走这里')
      console.log(device_list.value.records,'---device_list.value.records')
      let filter_data = device_list.value.records.filter(v => list.some(itemA => itemA.deviceId == v.deviceId));
      console.log(filter_data,'--filter_data')
      filter_data.forEach((row:any)=>{
        multiple_Ref.value.toggleRowSelection(row, true); // 默认勾选
      })
    }

  }
}

watch([() => props.equipment_dia,()=>props.status,()=>props.data,()=>props.id],
    async  ([newDia, newStatus, newData]) => {
      dialog_visible.value = newDia
      new_status.value = newStatus
      if (newStatus === 'add') {
        attendanceRuleId.value = ''
        edit_selection.value = []
        console.log( attendanceRuleId.value,'---aaaaaaaaaa')
      await  attendance_device_all(
            plotId,
            current_page.value,
            page_size.value,
            device_type.value,
            true,
            attendanceRuleId.value,
            search_person.value
        )
        toggleSelection(edit_selection.value, newStatus)
        multipleSelection.value = []

      } else {
        edit_selection.value = newData  //当前的数据
        attendanceRuleId.value = props.id  //考勤规则id
         await attendance_device_all(
        plotId,
        current_page.value,
        page_size.value,
        device_type.value,
        true,
        attendanceRuleId.value,
        search_person.value
    )
        toggleSelection(edit_selection.value, newStatus)
        multipleSelection.value = newData


      }


    },
    // { deep: true },
);
</script>

<style scoped lang="scss">
.dialog_css {
  .dialog_header {
    font-size: 18px;
    color: #333333;
    width: 100%;
  }
  .form {
    padding-top: 30px;
    .form_icon {
      padding: 0 20px 0 10px;
    }
    .form_minus {
      padding-left: 10px ;
    }
  }

}
.person {
  width: 100%;
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

    .function_right {
      .search-wrapper {

        position: relative;
        display: flex;

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

  .table-wrapper {
    padding-left: 20px;
  }

  .pagination {
    padding: 20px 20px;
    display: flex;
    justify-content: flex-end;
  }

  .demo_ruleForm {
    .dialog_header {
      font-size: 18px;
      color: #333333;
      //border-bottom: 1px solid #333333;
    }

    .dialog_buttom {
      height: 1px;
      border: 1px solid #333333;
      margin: 16px 0;
      width: 680px;

    }

    .big-box {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      border: 1px solid rgba(0, 0, 0, 0.16);

      .small-box {
        width: 150px;
        height: 40px;
        margin: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 1px solid #ebedf0;

        .icon {
          width: 30px;
          height: 40px;
          margin: -3px 0 0 0
        }
      }

      .active {
        background-color: #3B81F4;
        color: #ffffff
      }
    }
    .equipment_box {
      display: inline-flex;
      flex-wrap: wrap;

      .equipment {
        display: flex;
        width: 100%;
      }
    }



  }


}
</style>
