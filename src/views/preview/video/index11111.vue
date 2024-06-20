<template>
  <div class="container">
    <div class="left">
      <div class="company">{{t('视频预览')}}</div>
      <div class="company_name">
        <div class="name">
          <div class="name_left">{{depart_name.slice(0,1)}}</div>
          <div class="depart_name">{{depart_name}}</div>
        </div>
                <img class="custom_image" src="@/assets/images/png/add.png" style="cursor: pointer" @click="handle_add">
      </div>
      <div class="tree">
        <el-tree
            :data="group_data.records"
            :props="defaultProps"
            class="full-height"
            @node-click="handleNodeClick"
            :default-expand-all =true
            :highlight-current="true"
        >
          <template #default="{ node, data }">

            <div class="custom_top">
              <div class="custom_content">
                <me-icon-position class="custom_img"></me-icon-position>
                <div style="margin-left: 5px;">{{ node.label }}</div>
              </div>
              <div class="showIcon">
                <el-dropdown trigger="click" >
                  <me-icon-Ellipsis  style=" font-size:1.6em;" class="icon"/>

                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item >
                        <div class="showIcon_top" @click="handle_command_add(data)">
                          <img class="custom_image" src="@/assets/images/png/add.png">
                          <div style="margin-left: 10px">添加设备</div>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item >
                        <div class="showIcon_top" @click="handle_command_edit(data)">
                          <img class="custom_image" src="@/assets/images/png/show_edit.png">
                          <div style="margin-left: 10px">编辑名称</div>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item >
                        <div class="showIcon_top" @click="handle_command_del(data)" >
                          <img class="custom_image" src="@/assets/images/png/delete.png">
                          <div style="margin-left: 10px">删除</div>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>


          </template>
        </el-tree>
      </div>
    </div>
    <device_dia :dialog="device_flag" :data="device_data" :group="device_groupId" @save_dialog="handle_save_dialog"></device_dia>
  </div>
</template>



<script setup lang="ts">
import device_dia from '../component/device_dialog/index.vue'
import {useLocalesI18n} from "@/locales/hooks";
import {useUserStore} from "@/store";
import {message} from "@/utils/components/message";
import {add_device, batch_relevance, del_device, device_list, group_list, put_device} from "@/api/video";
const { t } = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'preview']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const depart_name = UserStore.user.plotName
const device_flag = ref(false)
const device_groupId = ref<number>(0)
const device_data = ref([])
const page_size = ref(20); //每页显示条目个数

const group_data = ref({
  records:[]
})//左侧分组列表id
const defaultProps = {
  children: 'children',
  label: 'name',
  id: 'id'
}


const handle_command_add =(data:any)=>{
  console.log('1111',data)
  device_flag.value = true

}
const handle_save_dialog = (flag:boolean,status:string,data:any)=>{
  device_flag.value = flag
  if (status==='cancel')return true
  equipment_group(data)

}
const handle_command_edit =(data:any)=>{
  ElMessageBox.prompt(t('请输入')+t('新分组')+t('名称'), t('编辑')+t('分组'), {
    confirmButtonText: t('确认'),
    cancelButtonText: t('取消'),
    inputPattern: /^[\w\u4e00-\u9fa5\!\@#\$\%\^\&\*\(\)\-\+\=\[\]\{\}\|\;\:\'\"\,\.\<\>\/\?]+$/,
    inputErrorMessage: t('不能为空'),

  })
      .then(async ({value}) => {
        await device_put(value, data.id)
      })
      .catch(() => {
        message(t('取消')+t('编辑')+t('新分组'), {type: 'error'})
      })

}
const handle_command_del =(data:any)=>{
  ElMessageBox.confirm(
      t('将删除当前分组,是否确认?'),
      t('删除确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(async () => {
        await device_del( data.id)
      })
      .catch(() => {
        message(t('取消删除'),{ type: "error" })

      })
}
//点击tree
const handleNodeClick = (data: any) => {
  console.log(data,'--data')
  device_groupId.value = data.id
  device_list_all(data.id)
}
//创建设备组
const handle_add =()=>{
  ElMessageBox.prompt(t('请输入')+t('新分组')+t('名称'), t('创建')+t('分组'), {
    confirmButtonText: t('确认'),
    cancelButtonText: t('取消'),
    inputPattern: /^[\w\u4e00-\u9fa5\!\@#\$\%\^\&\*\(\)\-\+\=\[\]\{\}\|\;\:\'\"\,\.\<\>\/\?]+$/,
    inputErrorMessage: t('不能为空'),

  })
      .then(async ({value}) => {
        await device_add(value, plotId)
      })
      .catch(() => {
        message(t('取消')+t('添加')+t('新分组'), {type: 'error'})
      })
}

const device_add = async (name: string, plotId: number) => {
  const res = await add_device({
    name: name,
    plotId: plotId
  })
  if (res.data.code ===200){
    await group_list_all(plotId,0, page_size.value)
    message(t('创建分组')+t('成功'),{type: 'success'})
  }else {
    message(res.data.message,{type:'error'})
  }
}

const device_put = async (name: string, id: number) => {
  const res = await put_device({
    name: name,
    id: id
  })
  if (res.data.code ===200){
    await group_list_all(plotId,0, page_size.value)
    message(t('编辑分组')+t('成功'),{type: 'success'})
  }else {
    message(res.data.message,{type:'error'})
  }
}
const device_del = async ( id: number) => {
  const res = await del_device({
    id: id
  })
  if (res.data.code ===200){
   await group_list_all(plotId,0, page_size.value)
    message(t('删除分组')+t('成功'),{type: 'success'})
  }else {
    message(res.data.message,{type:'error'})
  }
}
const group_list_all = async (plotId: number,page:number, size:number, name?: string) => {
  const res = await group_list(plotId,page, size, name)
  if (res.data.code ===200){
    group_data.value = res.data.data
  }
}
const equipment_group =async (data:any)=>{
  const res =await batch_relevance(data)
  if (res.data.code ===200){
    message(t('添加设备')+t('成功'),{type:'success'})
  }else {
    message(res.data.message,{type:'error'})
  }
}
const device_list_all =async (deviceGroupId:number)=>{
  const res = await device_list(deviceGroupId)
 if (res.data.code ===200){
   device_data.value = res.data.data
 }
}
onMounted(()=>{
  group_list_all(plotId,0, page_size.value)
})
</script>



<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
  height: 85vh;
  background-color: #ffffff;

  .left {
    //flex: 1;
    width: 280px;
    //width: 30%;
    height: 100%;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 3px 6px #D6E2FE;

    .company {
      font-size: 18px;
      font-weight: 700;
      margin: 16px 0 0 16px;
    }

    .company_name {
      margin: 20px 0 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center; /* 添加此行 */
      height: 40px;
      width: 240px;
      padding: 0 0 0 19px;
      background: #EBF3FF;

      .name {
        display: flex;
        padding-left: 40px;
        .name_left {
          width: 20px;
          height: 20px;
          color: #ffffff;
          background: #3B81F4;
          margin: 0 auto;
          display: flex;
          justify-content: center; /* 添加此行 */
          align-items: center; /* 添加此行 */
        }
        .depart_name {
          padding-left: 10px;
        }
      }

      img {
        width: 20px;
        height: 20px;
        padding-right: 10px;
      }
    }

    .tree {
      flex-grow: 1; /* 添加 flex-grow: 1 属性 */
      margin-top: 16px;

      .custom_top {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;

        .custom_content {
          display: flex;

          .custom_img {
            width: 15px;
            height: 15px;
            padding: 2px 5px 0 0;
          }
        }

      }
    }
  }

  .right {
    flex: 1;
    overflow: hidden;

    //overflow-x: auto;
  }


}

:deep(.el-tree-node__content) {
  &:hover {
    color: #3B81F4;
    font-weight: 700;

    .showIcon {
      opacity: 1;
    }
  }
}

.showIcon {
  opacity: 0;
}

.showIcon_top {
  display: flex;

  .custom_image {
    cursor: pointer;
    width: 20px;
    height: 20px;
  }
}
:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content)  {
  background-color: #FFEAEB !important;
  color: #D42A30;
}
</style>
