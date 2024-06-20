<template>
  <div class="person">
    <div class="device">{{t('设备管理')}}</div>
    <div class="function">
      <div class="function_left">
        <el-button type="primary" @click="handle_add">{{ t('添加设备') }}</el-button>
        <!--        <el-button >{{ t('导入/导出') }}</el-button>-->
        <el-button @click=handle_deletion> {{ t('批量删除') }}</el-button>
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

          <el-button icon="mel-icon-refresh" style="margin-left: 10px" @click="handle_refresh"/>

        </div>
      </div>
    </div>
    <div class="table-wrapper">
      <el-table
          ref="multipleTableRef"
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
        <el-table-column prop="address" show-overflow-tooltip :label="t('设备状态')" >
          <template #default="{row}">
            {{row.status ==='online'?t('在线'):t('离线')}}

          </template>

        </el-table-column>

        <el-table-column fixed="right" :label="t('操作')" width="340">
          <template #default="{row}">
            <el-button link size="small"  type="primary" @click="handle_edit(row)">{{ t('编辑') }}</el-button>
            <el-button link size="small" type="primary" @click="handle_del(row)"> {{ t('删除') }}</el-button>
            <el-button link size="small" type="primary" @click="handle_upgrade"> {{ t('升级') }}</el-button>
            <el-button link size="small" type="primary" @click="handle_restart"> {{ t('重启') }}</el-button>
            <el-button link size="small" type="primary" @click="handle_restore"> {{ t('恢复出厂') }}</el-button>
            <el-button link size="small" type="primary" @click="handle_remote"> {{ t('远程开门') }}</el-button>

          </template>
        </el-table-column>
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
    <el-dialog
        v-model="dialog_visible"
        :before-close="handle_close"
        class="demo_ruleForm"
        width="700"
    >
      <template #header>
        <div class="dialog_header">
          {{ t('编辑基本信息') }}
        </div>
        <div class="dialog_buttom"></div>
      </template>
      <el-form
          ref="rule_ref"
          :model="rule_form"
          :rules="rules"
          class="demo-ruleForm"
          label-width="auto"
          status-icon
          style="max-width: 700px"
      >
        <el-form-item :label="t('设备类型')">
          <div class="big-box">
            <div
                v-for="(item, index) in box_items"
                :key="index"
                :class="{ 'small-box': true, active: item.isActive }"
                @click="item.disabled ? null : highlight_box(item.id)"
            >
              <component :is="item.icon" class="icon" />{{ item.label }}
            </div>
          </div>

        </el-form-item>
        <el-form-item :label="t('设备序列号')" prop="serialNo">
          <el-input :disabled="device_status==='edit'" v-model="rule_form.serialNo"/>
        </el-form-item>
        <el-form-item :label="t('设备名称')" prop="deviceName">
          <el-input v-model="rule_form.deviceName"/>
        </el-form-item>
        <el-form-item :label="t('设备位置')" prop="address">
          <el-input v-model="rule_form.address"/>
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handle_close">{{ $t('取消') }}</el-button>
          <el-button type="primary" @click="handle_save">{{ $t('确认') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import type {FormInstance, FormRules} from 'element-plus';

import {useLocalesI18n} from "@/locales/hooks";
import {message} from "@/utils/components/message";
import {validate_serial} from "@/utils/packagingmethod/rules";
import {device_add, device_del, device_edit, device_List} from "@/api/management";
import {useUserStore} from "@/store";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'management']);
const rule_ref = ref<FormInstance>(); //拿到当前ref实力
const dialog_visible = ref<boolean>(false)  //dialog谈控制按钮
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const search_person = ref<string>('')
const current_page = ref(0);//当前页数
const page_size = ref(12); //每页显示条目个数


interface RuleForm {
  serialNo: string
  deviceName: string,
  address: string
  deviceType:string,

}
const rule_form_data = ref<RuleForm>({
  serialNo: '',
  deviceName: '',
  address: '',
  deviceType:'',
  plotId:plotId
})
const rule_form = ref<RuleForm>({
  serialNo: '',
  deviceName: '',
  address: '',
  deviceType:'',
  plotId:plotId

})
const equipment_type = ref('Face')
const device_list = ref({
  records:[],
  total:0
})

//dialog表单校验
const rules = computed<FormRules>(() => ({
  serialNo: [
    {required: true, message: t('设备序列号不能为空'), trigger: 'blur'},
    {validator: validate_serial, trigger: 'blur'}
  ],
  deviceName: [
    {required: true, message: t('设备名称不能为空'), trigger: 'blur'},
  ],
  address: [
    {required: true, message: t('设备位置不能为空'), trigger: 'blur'},
  ],
}));
const box_items = ref([
  { label: '网络摄像机', value: "device/master/IPC", isActive: false, id: 0, icon: 'me-icon-IPC', disabled: false },
  { label: '录像机', value: "device/master/NvR", isActive: false, id: 1, icon: 'me-icon-IPC', disabled: false },
  { label: '人脸识别终端', value: "device/master/AccessController", isActive: false, id: 2, icon: 'me-icon-phone', disabled: false },
  { label: '网关', value: "device/master/vbox", isActive: false, id:3, icon: 'me-icon-phone', disabled: false },

]);

const device_status = ref('')
//序列号正则校验
const highlight_box = (index: number) => {
  console.log(index,'--index')
  box_items.value.forEach((item, i) => {
    console.log(item, i)
    item.isActive = i === index;
    rule_form.value.deviceType = box_items.value[index].value
  });
}


const handle_add = () => {
  device_status.value = 'add'
  rule_form.value = JSON.parse(JSON.stringify(rule_form_data.value))
  dialog_visible.value = true
  box_items.value = box_items.value.map(item => ({ ...item, isActive: false,disabled:false }));

}
//分页
const handleCurrentChange = (val:number) => {
  console.log(val,'--val')
  current_page.value = val;
  personnel_device_all(plotId,current_page.value,page_size.value,1,search_person.value)
};
//搜索
const handle_search = () => {
  console.log('搜素',)
  personnel_device_all(plotId,0,page_size.value,1,search_person.value)
}
//刷新
const handle_refresh = () => {
  console.log('刷新',)
  personnel_device_all(plotId,current_page.value,page_size.value,1)

}
const multipleSelection = ref([]) //选中的人数 可以考虑只传id
const handleSelectionChange = (val: any) => {
  multipleSelection.value =val.map(item => item.id);
  console.log( multipleSelection.value, '--val')
}

const handle_edit = (row) => {
  console.log('编辑')
  device_status.value = 'edit'
  box_items.value.forEach(item => {
    item.disabled =true
    item.isActive = item.value === row.deviceType;
  });
  rule_form.value = JSON.parse(JSON.stringify(row))
  dialog_visible.value = true
}
//删除
const handle_del = (row) => {
  console.log('删除')
  const data =[]
  data.push(row.id)
  ElMessageBox.confirm(
      t('将删除设备,是否确认?'),
      t('删除确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(() => {
        del_device(data)

      })
      .catch(() => {
        message(t('取消删除'), {type: "error"})

      })
}
//升级
const handle_upgrade = () => {
  ElMessageBox.confirm(
      t('将升级最新版本固件程序，是否确认?'),
      t('升级确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(() => {
        message(t('设备升级指令已下发'), {type: "success"})
        // ElMessage({
        //   type: 'success',
        //   message: 'Delete completed',
        // })
      })
      .catch(() => {
        message(t('取消升级'), {type: "error"})

      })
}
//重启  需要球盖
const handle_restart = () => {
  ElMessageBox.confirm(
      t('将对该设备进行重启，是否确认?'),
      t('重启确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(() => {
        message(t('设备重启指令已下发'), {type: "success"})
        // ElMessage({
        //   type: 'success',
        //   message: 'Delete completed',
        // })
      })
      .catch(() => {
        message(t('取消重启'), {type: "error"})

      })
}
//恢复出厂
const handle_restore = () => {
  ElMessageBox.confirm(
      t('将对该设备进行恢复出厂，是否确认?'),
      t('恢复出厂确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(() => {
        message(t('设备恢复出厂指令已下发'), {type: "success"})
        // ElMessage({
        //   type: 'success',
        //   message: 'Delete completed',
        // })
      })
      .catch(() => {
        message(t('取消恢复出厂设置'), {type: "error"})

      })
}
//批量删除
const handle_deletion = () => {
  ElMessageBox.confirm(
      t('将删除您所勾选的设备，是否确认?'),
      t('批量删除确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(() => {
        del_device(multipleSelection.value)
        message(t('删除成功'), {type: "success"})
        // ElMessage({
        //   type: 'success',
        //   message: 'Delete completed',
        // })
      })
      .catch(() => {
        message(t('取消删除'), {type: "error"})

      })
}
//远程开门
const handle_remote = () => {
  ElMessageBox.confirm(
      t('将对该设备进行远程开门，是否确认?'),
      t('远程开门确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(() => {
        message(t('设备远程开门指令已下发'), {type: "success"})
        // ElMessage({
        //   type: 'success',
        //   message: 'Delete completed',
        // })
      })
      .catch(() => {
        message(t('取消远程开门设置'), {type: "error"})

      })
}
//获取所有设备列表
//拿到当前列表的序号
const set_index = (index)=>{
  if (current_page.value >=1){
    return (current_page.value -1) * page_size.value + index + 1

  }else  {
    return (current_page.value ) * page_size.value + index + 1

  }
}
//获取所有数据
const personnel_device_all =async (plotId:number,page:any,size:any,status:number,serialNo?:string)=>{
  const res =await device_List(plotId,page,size,status,serialNo)
  if (res.data.code === 200){
    device_list.value = res.data.data
  }
}
//添加设备
const add_device =async (data)=>{
  const res = await device_add(data)
  if (res.data.code === 200){
    await personnel_device_all(plotId, current_page.value, page_size.value,1)
    message(t('添加')+t('设备')+t('成功'),{type:"success"})
  }else  {
    message(res.data.message,{type:"error"})

  }
}
//删除设备
const del_device =async (id)=>{
  const res = await device_del({
    ids:id,
  })
  if (res.data.code === 200){
    await personnel_device_all(plotId, current_page.value, page_size.value,1)
    message(t('删除')+t('设备')+t('成功'),{type:"success"})
  }else  {
    message(res.data.message,{type:"error"})

  }
}
//编辑设备
const edit_device =async (data)=>{
  const res = await device_edit({
    address:data.address,
    deviceName:data.deviceName,
    id:data.id
  })
  if (res.data.code === 200){
    await personnel_device_all(plotId, current_page.value, page_size.value,1)
    message(t('编辑')+t('设备')+t('成功'),{type:"success"})
  }else  {
    message(res.data.message,{type:"error"})

  }
}

const handle_save = async () => {
  rule_ref.value?.validate(async (valid, fields) => {
    if (valid) {
      if (rule_form.value.deviceType === ''){
        return message(t('设备类型')+t('不能为空'),{type:"error"})
      }
      if (device_status.value ==='add'){
       await add_device(rule_form.value)
      }else {
        await edit_device(rule_form.value)

      }

      console.log(valid, '--valid--登录成功')
      dialog_visible.value = false
    } else {
      console.log('提交错误', fields);
    }
  });
};
const handle_close = () => {
  if (!rule_ref.value) return
  rule_ref.value.resetFields()
  dialog_visible.value = false
}
const getRowKey = (row:any)=>{
  return row.id
}
onMounted(()=>{
  personnel_device_all(plotId,current_page.value,page_size.value,1)
})
</script>


<style lang="scss" scoped>
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
