

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
          {{ t('添加设备') }}
        </div>
        <div class="dialog_buttom"></div>
      </template>
      <div class="function">
        <div class="function_left">
          <el-button    type="primary">{{ t('全选设备') }}</el-button>

        </div>
        <div class="function_right">
          <div class="search-wrapper">
            <el-input
                v-model="search_person"
                :placeholder="t('请输入')+t('设备')+t('序列号')"
            >
              <template #append>
                <el-button @click="handle_search" icon="mel-icon-search" />
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
        >
          <el-table-column type="selection" width="55"/>
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
import {useUserStore} from "@/store";
import {device_GroupDevice, device_List} from "@/api/management";
import {PropType} from "vue";
const { t } = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'person_table']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const dialog_visible = ref(false)
const group_id= ref(0)
const props = defineProps({  //父组件爱你传递过来的弹框状态
  dialog: {
    type:  Boolean as PropType<boolean>,
    default: false
  },
  group:{
    type:  Number as PropType<number>,
    default: 0
  },
  data:{
    type: Array as PropType<any>,
    default: [],
  },

})
const emit = defineEmits();   //定义子组件传递方法
const search_person = ref<string>('')//搜索对应的
const device_list = ref({
  records:[],
  total:0
})
const current_page = ref(0);//当前页数
const page_size = ref(12); //每页显示条目个数
const multipleSelection = ref<Array<any>>([]) //选中的人数 可以考虑只传id
const select_all =ref<boolean>(false) //是否全选
const multiple_Ref = ref() //当前table组建的实例
const device_type=ref('device/IPC')
const end_data = ref({})

//全部选中
const handle_all = ()=>{
  select_all.value = !select_all.value
  if (select_all.value){
    multiple_Ref.value.toggleAllSelection()
  }else  {
    multiple_Ref.value.clearSelection()

  }
}
//拿到当前列表的序号
const set_index = (index:number)=>{
  if (current_page.value >=1){
    return (current_page.value -1) * page_size.value + index + 1

  }else  {
    return (current_page.value ) * page_size.value + index + 1

  }
}
const handleSelectionChange = (val: Array<any>) => {
  multipleSelection.value = val.map(item => {
    return {
      deviceId: item.deviceId,
      devicePath: item.devicePath
    };
  })

}
//分页
const handleCurrentChange = async (val: number) => {
  current_page.value = val;
  await personnel_device_all(plotId, current_page.value, page_size.value, device_type.value, true,props.group, search_person.value)
};
//搜索
const handle_search =async ()=>{
  await personnel_device_all(plotId, 0, page_size.value, device_type.value,true,props.group, search_person.value)
}
const handle_close = () => {
  dialog_visible.value = false
  emit("save_dialog", dialog_visible.value,'cancel');

}
const handle_save = ()=>{
  end_data.value = {
    deviceGroupId: props.group,
    deviceList: multipleSelection.value
  };
  dialog_visible.value = false
  emit("save_dialog", dialog_visible.value,'save',end_data.value);

}
//获取所有数据
const personnel_device_all =async (plotId:number,page:any,size:any,deviceType:string,isExcludeAddedDeviceGroupDevice:boolean, group_id:number,serialNo?:string)=>{
  const res =await device_GroupDevice(plotId,page,size,deviceType,isExcludeAddedDeviceGroupDevice,group_id,serialNo)
  if (res.data.code === 200){
    device_list.value = res.data.data
  }
}
const toggleSelection =(list:any)=>{
  if (multiple_Ref.value){
    let filter_data = device_list.value.records.filter(itemB => list.some(itemA => itemA.devicePath === itemB.devicePath));
    filter_data.forEach((row:any)=>{
      multiple_Ref.value.toggleRowSelection(row, true); // 默认勾选
    })
  }
  }
watch(
    [() => props.dialog],
    async ([newVal]) => {
      dialog_visible.value = newVal
      await personnel_device_all(plotId, current_page.value, page_size.value, device_type.value, true, props.group)
      multipleSelection.value = props.data
      toggleSelection(props.data)
    },
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
  .pagination {
    padding: 20px 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
