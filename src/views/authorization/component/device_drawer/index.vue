<template>
  <div>
    <el-drawer
        v-model="props.device_dia"
        direction="rtl"
        :before-close="handle_cancel"
        class="drawer"
        size="35%"
    >
      <template #header>
        <div class="drawer_header">
          {{t('设备授权')}}
        </div>
      </template>
      <template #default>
        <div class="drawer_buttom"></div>
        <div class="function">
          <div class="function_left">
            <el-button  @click="handle_add_device"  type="primary">{{ t('添加设备') }}</el-button>

          </div>
          <div class="function_right">
            <div class="search-wrapper">
              <el-input
                  v-model="search_person"
                  :placeholder="t('请输入')+t('设备')+t('序列号')"
              >
                <template #append>
                  <el-button  @click="handle_search"  icon="mel-icon-search" />
                </template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="table-wrapper">
          <el-table
              ref="multipleTableRef"
              :data="device_data.records"
              style="width: 100%"
          >
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
            <el-table-column prop="address" show-overflow-tooltip :label="t('设备状态')" >
              <template #default="{row}">
                {{row.status ==='online'?t('在线'):t('离线')}}

              </template>

            </el-table-column>

            <el-table-column fixed="right" :label="t('操作')" width="100">
              <template #default="{row}">
                <el-button link size="small" type="primary" @click="handle_selling(row)"> {{ t('删除') }}</el-button>

              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
              v-model:current-page="current_page"
              v-model:page-size="page_size"
              layout="prev, pager, next, jumper"
              :total="device_data.total"
              @current-change="handleCurrentChange"
          />

        </div>

      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="handle_cancel">{{t('取消')}}</el-button>
          <el-button type="primary" @click="handle_save">{{t('确认')}}</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
  <device_dialog :dialog="deviceDialog" @save_dialog="handle_save_dialog"></device_dialog>
</template>


<script setup lang="ts">
import {PropType} from "vue";
import {useLocalesI18n} from "@/locales/hooks";
import  device_dialog from '../device_dialog/index.vue'
import {add_device, device_list} from "@/api/management";
import {message} from "@/utils/components/message";
import {handle_add_rule, handle_del_device, handle_del_group, handle_del_rule} from "@/api/authorization";
const { t } = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'authorization']);
const drawer =ref(false)//当前弹框的状态
const props = defineProps({  //父组件爱你传递过来的弹框状态
  device_dia: {
    type:  Boolean as PropType<boolean>,
    default: false
  },
  groupID:{
    type:  String as PropType<string>,
    default: ''
  }
})
const deviceDialog = ref(false)//当前添加设备弹框的状态
const emit = defineEmits();   //定义子组件传递方法
const search_person = ref<string>('')//搜索对应的
const device_data = ref({
  records:[],
  total:0,
  status:0
})
const current_page = ref(0);//当前页数
const page_size = ref(12); //每页显示条目个数
const handle_add_device = ()=>{
      console.log('添加设备')
  deviceDialog.value = true
}
//分页
const handleCurrentChange = async (val: number) => {
  console.log(val, '--val')
  current_page.value = val;
  await device_list_all(current_page.value, page_size.value, props.groupID, search_person.value)
};
//搜索
const handle_search = async () => {
  console.log('搜素',)
  await device_list_all(0, page_size.value, props.groupID, search_person.value)
}
//拿到当前列表的序号
const set_index = (index)=>{
  if (current_page.value >=1){
    return (current_page.value -1) * page_size.value + index + 1

  }else  {
    return (current_page.value ) * page_size.value + index + 1

  }
}

const handle_save_dialog =async (flag:boolean,status:string,data)=>{
  deviceDialog.value = flag
  if (status==='cancel')return true
 await device_add(data,props.groupID)
  await device_list_all(current_page.value, page_size.value, props.groupID)

}
//删除设备人员组
// handle_del_device
const handle_selling =async (row:any)=>{
  console.log(row,'--row---')
  const data:any = []
  data.push(row.deviceId)
  ElMessageBox.confirm(
      t('将删除您所选择的设备，是否确认?'),
      t('删除确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(async () => {
        const res =await handle_del_device({
          personGroupId:props.groupID,
          deviceIds:data
        })
        if(res.data.code ===200){
          await device_list_all(current_page.value, page_size.value, props.groupID, search_person.value)

          message(t('删除')+t('成功'),{type:"success"})

        }else {
          message(res.data.message,{type:"error"})
        }

      })
      .catch(() => {
        message(t('取消批量删除'),{ type: "error" })

      })

}
//新增人员组设备
const device_add =async (devices:any,personGroupId:any)=>{
  const res = await add_device({
    devices:devices,
    personGroupId:personGroupId
  })
  if (res.data.code ===200){
    message(t('添加')+t('设备')+t('成功'),{type:'success'})
  }else {
    message(res.data.message,{type:'error'})

  }
}
//抽屉取消
const handle_cancel = ()=>{
  console.log('取消')
  drawer.value = false
  emit("save_device", drawer.value,'cancel');
}
//抽屉确认
const handle_save = ()=>{
  drawer.value = false
  console.log('确认')
  emit("save_device", drawer.value,'save');

}
const device_list_all =async (page:number,size:number,personGroupId:string,serialNo?:string)=>{
  let finalSerialNo: string | undefined;

  if (serialNo) {
    finalSerialNo = serialNo;
  } else {
    finalSerialNo = undefined;
  }

  const res =await device_list(page,size,personGroupId,finalSerialNo)
  if (res.data.code === 200){
    device_data.value = res.data.data
  }
}
watch([() => props.device_dia, ],
    async ([new_drawer_flag]) => {
      drawer.value = new_drawer_flag
      await device_list_all(current_page.value, page_size.value, props.groupID)
    });
</script>



<style scoped lang="scss">
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
  .pagination {
    padding: 20px 20px;
    display: flex;
    justify-content: flex-end;
  }

}

</style>
