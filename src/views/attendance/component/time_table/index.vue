
<template>
<div>
  <el-table
      :data="tableData"
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
          {{ formatTimestartTimestamp(row) }}
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
          {{ formatTimestamp(row) }}
        </template>
      </template>
    </el-table-column>
    <el-table-column fixed="right"  :label="t('操作')" width="120">
      <template #default="{row,$index}" >
          <el-button  link type="primary" size="small" @click="handle_edit(row,$index)" >{{t('更改')}}</el-button>
          <el-button  link type="primary" size="small" @click="handle_cancel(row,$index)" >{{t('取消')}}</el-button>
      </template>

    </el-table-column>

  </el-table>
<div class="save" @click="handle_save">{{t('保存考勤时间')}}
</div>
</div>
</template>

<script setup lang="ts">
import {useLocalesI18n} from "@/locales/hooks";
import {
  convertArrayToTimestamps,
  formatTimestamp,
  formatTimestartTimestamp,
  transformTimeStamps
} from "@/utils/packagingmethod/time";
import {message} from "@/utils/components/message";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'attendance']);
const table_ref = ref()
const start_row = ref<number>(-1)//当前要修改的开始时间
const end_row = ref<number>(-1)//当前要修改的接触时间
const change_flag = ref(true) //判断当前状态是更改还是取消
const end_date = ref([])
const time_status = ref('')
const time_data = ref<any>(null)
const result = ref()
interface User {
  week: string
  startTime: number
  endTime: number
}
const props = defineProps({  //父组件爱你传递过来的弹框状态
  status: {
    type: String as PropType<string>,
    default: ''
  },
  data:{
    type: Array as PropType<any>,
    default:[]
  }
})
const emit = defineEmits();   //定义子组件传递方法
const tableData = ref([
  {
    startTime: 1715907600000,
    week: 'MONDAY',
    endTime: 1715940000000,
  },
  {
    startTime: 1715907600000,
    week: 'TUESDAY',
    endTime: 1715940000000,
  },
  {
    startTime: 1715907600000,
    week: 'WEDNESDAY',
    endTime: 1715940000000,
  },
  {
    startTime: 1715907600000,
    week: 'THURSDAY',
    endTime: 1715940000000,
  },
  {
    startTime: 1715907600000,
    week: 'FRIDAY',
    endTime: 1715940000000,
  },
  {
    startTime: 1715907600000,
    week: 'SATURDAY',
    endTime: 1715940000000,
  },
  {
    startTime: 1715907600000,
    week: 'SUNDAY',
    endTime: 1715940000000,
  },
])
const tableData_copy = ref([
  {
    startTime: 1715907600000,
    week: 'MONDAY',
    endTime: 1715940000000,
  },
  {
    startTime: 1715907600000,
    week: 'TUESDAY',
    endTime: 1715940000000,
  },
  {
    startTime: 1715907600000,
    week: 'WEDNESDAY',
    endTime: 1715940000000,
  },
  {
    startTime: 1715907600000,
    week: 'THURSDAY',
    endTime: 1715940000000,
  },
  {
    startTime: 1715907600000,
    week: 'FRIDAY',
    endTime: 1715940000000,
  },
  {
    startTime: 1715907600000,
    week: 'SATURDAY',
    endTime: 1715940000000,
  },
  {
    startTime: 1715907600000,
    week: 'SUNDAY',
    endTime: 1715940000000,
  },
])
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
  multipleSelection.value = val
}
//修改当前行
const handle_edit = (row:any,index:any)=>{
  start_row.value = index
  end_row.value=index
  change_flag.value = false
}
//取消当前行的修改
const handle_cancel = (row:any,index:any)=>{
  if (start_row.value === index ||  end_row.value === index){
    start_row.value = -1
    end_row.value= -1
    change_flag.value = true
  }else  {
    console.log('不是当前行的点击')
  }

}
const handle_time_change = (row:any, field:string, value:any)=>{
  if (field === 'startTime') {
    if (row.startTime>row.endTime){
      message(t('开始时间')+t('不能大于')+t('结束时间'),{type:'error'})
      return true
    }
    row[field] = value.getTime();
    start_row.value = -1
  }else {
    if (row.startTime>row.endTime){
      message(t('开始时间')+t('不能大于')+t('结束时间'),{type:'error'})
      return true
    }
    row[field] = value.getTime();
    end_row.value = -1
  }

  let filter_data =   tableData.value.filter(item => multipleSelection.value.includes(item))  //直接修改时间 然后筛选数据
  edit_init(filter_data)
}
const edit_init = (val:any)=>{
  end_date.value = val
  console.log(end_date.value,'--end_date.value')
  // emit('save_time', end_date.value)
}
const handle_save =()=>{
  console.log(end_date.value,'--end_date.value')
  console.log( multipleSelection.value,'-- multipleSelection.value')
  let data =  multipleSelection.value.filter(itemA => !end_date.value.some(itemB => itemB.week === itemA.week)).concat(end_date.value);
  result.value =  transformTimeStamps(data)
  console.log(  result.value,'--  result.value')
  emit('save_time',   result.value)
  message(t('添加考勤时间成功'),{type:'success'})
  end_date.value = []
  result.value = []


}
const init_date = (list:any)=>{
  list = convertArrayToTimestamps(list)
  tableData.value =   tableData.value.map(itemA => {
    const matchingItem = list.find(itemB => itemB.week === itemA.week);
    return matchingItem ? matchingItem : itemA;
  });

}
const toggleSelection = (list: any, status: string, tableRef: any) => {
  console.log(list,'-------list-----')
  if (tableRef) {
    if (status === 'add') {
      if (list.length ===0){
        console.log(1111)
        console.log(  result.value,'--  result.value')
        tableData.value.forEach((row: any) => {
          tableRef.toggleRowSelection(row, false); // 默认勾选
        });
      }else {
        console.log('不等于0')
        console.log(222)
        let list_data = tableData.value.filter((itemB: any) =>
            list.some((itemA: any) => itemA.week === itemB.week)
        );
        console.log(tableData.value,'--tableData.value')
        console.log(list_data,'--list_data')
        list_data.forEach((row: any) => {
          tableRef.toggleRowSelection(row, true); // 默认勾选
        });
      }

    } else {
      console.log(222)
      let filter_data = tableData.value.filter((itemB: any) =>
          list.some((itemA: any) => itemA.week === itemB.week)
      );
      console.log(filter_data,'--filter_data')
      filter_data.forEach((row: any) => {
        tableRef.toggleRowSelection(row, true); // 默认勾选
      });
    }
  }
};

const initTable = () => {
  if (time_data.value.length===0){
    tableData.value = JSON.parse(JSON.stringify(tableData_copy.value));

  }else {
    init_date(props.data);

  }
  // console.log(  time_data.value,'--  time_data.value')
  nextTick(() => {
    toggleSelection(time_data.value, time_status.value, table_ref.value);
  })
};

const updateTable = () => {
  init_date(props.data);
  nextTick(() => {
    toggleSelection(time_data.value, time_status.value, table_ref.value);
  });
};

watch(
    [() => props.status, () => props.data],
    ([newStatus, newData]) => {
      time_data.value = newData;
      time_status.value = newStatus;
      if (time_status.value === 'add') {
        console.log('添加')
        initTable();
      } else {
        console.log('编辑')
        updateTable();
      }
    },
    { immediate: true }
);
</script>


<style scoped lang="scss">
.save {
  display: flex;
  padding:0 40px 0 0;
  color: #3b81f4;
  cursor: pointer;
  justify-content: flex-end;
}
:deep(.el-table tr ){
  height: 30px !important;
}

</style>
