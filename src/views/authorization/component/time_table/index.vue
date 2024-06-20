
<template>
<div>
  <el-table
      :data="table_data"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="table"
      ref="table_ref"
  >
    <el-table-column class="table_column" type="selection" width="30" />
    <el-table-column prop="week" :label="t('工作日')" width="80" >
      <template #default="{ row }">
        {{ getWeekLabel(row) }}
      </template>
    </el-table-column>
    <el-table-column prop="startTime" :label="t('开始时间')" width="120" >
      <template #default="{ row, $index }">
        <template v-if="start_row === $index">
          <el-time-picker
              style="width: 100px"
              :clearable="false"
              v-model="row.startTime"
              @change="handle_time_change(row, 'startTime', $event)"
          ></el-time-picker>
        </template>
        <template v-else>
          {{ formatstartTime(row) }}
        </template>
      </template>
    </el-table-column>
    <el-table-column prop="endTime" :label="t('结束时间')" width="120" >
      <template #default="{ row,$index}">
        <template v-if="end_row === $index">
          <el-time-picker
              style="width: 100px"
              :clearable="false"
              v-model="row.endTime"
              @change="handle_time_change(row, 'endTime', $event)"
          ></el-time-picker>
        </template>
        <template v-else>
          {{ formatendTime(row) }}
        </template>
      </template>
    </el-table-column>
    <el-table-column fixed="right"  :label="t('操作')" width="120">
      <template #default="{row,$index}" >
          <el-button  link type="primary" size="small" @click="handle_edit(row,$index)" >{{t('更改')}}</el-button>
          <el-button  link type="primary" size="small" @click="handle_cancel(row,$index)" >{{$t('取消')}}</el-button>
      </template>

    </el-table-column>

  </el-table>

</div>
</template>

<script setup lang="ts">
import {useLocalesI18n} from "@/locales/hooks";
import {
  formatstartTime,
  formatendTime,
  timeToTimestamp,
  convertArrayToTimestamps,
  replaceItem, findDifferentItems
} from "@/utils/packagingmethod/time";
import {message} from "@/utils/components/message";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'attendance']);
const table_ref = ref()
const start_row = ref<number>(-1)//当前要修改的开始时间
const end_row = ref<number>(-1)//当前要修改的接触时间
const change_flag = ref(true) //判断当前状态是更改还是取消
interface User {
  week: string
  startTime: number
  endTime: number
}
const value1 = ref<HTMLElement | null>(null)
const props = defineProps({  //父组件爱你传递过来的弹框状态

  traverStatus:{
    type:  String as PropType<string>,
    default: ''
  },
  edit_data:{
    type:  Array as PropType<any>,
    default: []
  }
})
const emit = defineEmits();   //定义子组件传递方法

const tableData =
    [
  {
    startTime: 1704038400000,
    week: 'MONDAY',
    endTime: 2082643199999,
  },
  {
    startTime: 1704038400000,
    week: 'TUESDAY',
    endTime: 2082643199999,
  },
  {
    startTime: 1704038400000,
    week: 'WEDNESDAY',
    endTime: 2082643199999,
  },
  {
    startTime: 1704038400000,
    week: 'THURSDAY',
    endTime: 2082643199999,
  },
  {
    startTime: 1704038400000,
    week: 'FRIDAY',
    endTime: 2082643199999,
  },
  {
    startTime: 1704038400000,
    week: 'SATURDAY',
    endTime: 2082643199999,
  },
  {
    startTime: 1704038400000,
    week: 'SUNDAY',
    endTime: 2082643199999,
  },
]
const table_data = ref(
    [
      {
        startTime: 1704038400000,
        week: 'MONDAY',
        endTime: 2082643199999,
      },
      {
        startTime: 1704038400000,
        week: 'TUESDAY',
        endTime: 2082643199999,
      },
      {
        startTime: 1704038400000,
        week: 'WEDNESDAY',
        endTime: 2082643199999,
      },
      {
        startTime: 1704038400000,
        week: 'THURSDAY',
        endTime: 2082643199999,
      },
      {
        startTime: 1704038400000,
        week: 'FRIDAY',
        endTime: 2082643199999,
      },
      {
        startTime: 1704038400000,
        week: 'SATURDAY',
        endTime: 2082643199999,
      },
      {
        startTime: 1704038400000,
        week: 'SUNDAY',
        endTime: 2082643199999,
      },
    ])
const newList =ref([])
const getWeekLabel = (row:object) => {
  switch (row.week) {
    case 'MONDAY':
      return t('周一');
    case 'TUESDAY':
      return t('周二');
    case 'WEDNESDAY':
      return t('周三');
    case 'THURSDAY':
      return t('周四');
    case 'FRIDAY':
      return t('周五');
    case 'SATURDAY':
      return t('周六');
    case 'SUNDAY':
      return t('周日');
    default:
      return '';
  }
};
//当前选择的列
const multipleSelection = ref<User[]>([])

const handleSelectionChange = (val: User[]) => {
  console.log(val,'---val---------------')
  if (val.length !==0){
    const itemWithInvalidTime = val.find(item => item.startTime >= item.endTime);
    if (itemWithInvalidTime){
      return message(t('开始时间不能大于结束时间'),{type:'error'})
    }
    multipleSelection.value = val

    console.log( multipleSelection.value,'-- multipleSelection.value')
    emit("save_time", multipleSelection.value,'save');
  }


}
//修改当前行
const handle_edit = (row:any,index:any)=>{
  start_row.value = index
  end_row.value=index
  change_flag.value = false
  console.log('点击更改',row,index)
}
//取消当前行的修改
const handle_cancel = (row:any,index:any)=>{
  if (start_row.value === index ||  end_row.value === index){
    console.log('取消')
    start_row.value = -1
    end_row.value= -1
    change_flag.value = true
  }else  {
    console.log('不是当前行的点击')
  }

}
const handle_time_change = (row:any, field:string, value:any)=>{

  console.log(row)
  console.log(field)
  console.log(value)
  if (field === 'startTime') {
    row[field] = value.getTime();
    start_row.value = -1
  }else {
    row[field] = value.getTime();
    end_row.value = -1
  }
  console.log(row,'--row')
}


watch(
    [() => props.traverStatus,()=>props.edit_data],
    async ([new_status,new_edit_data]) => {
      console.log(new_status,'--new_status')
      console.log(new_edit_data,'--new_edit_data')
      if (new_status ==='add'){
        table_data.value = JSON.parse(JSON.stringify(tableData))
      }else {
        if (new_edit_data.type === 1){
          table_data.value = JSON.parse(JSON.stringify(tableData))

        }else {
          if (new_edit_data.length ===0){
            console.log('走这里了吗')
            table_data.value = JSON.parse(JSON.stringify(tableData))

          }else {
            table_data.value =   convertArrayToTimestamps(new_edit_data);
            table_data.value = replaceItem(tableData,table_data.value)
          }
        }



      }

    },
    { immediate: true }
);

</script>


<style scoped lang="scss">
.table {
}
:deep(.el-table tr ){
  height: 30px !important;
}

</style>
