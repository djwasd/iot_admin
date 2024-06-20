<template>
  <div class="container">
    <div class="left">
      <div class="company">{{t('子账号管理')}}</div>
      <div class="company_name" @click="handle_depart">
        <div class="name">
          <div class="name_left">{{depart_name.slice(0,1)}}</div>
          <div class="depart_name">{{depart_name}}</div>
        </div>
        <!--        <img class="custom_image" src="@/assets/images/png/add.png" style="cursor: pointer" @click="handle_add">-->
      </div>
      <div class="tree">
        <el-tree
            :data="departmental_date"
            :props="defaultProps"
            class="full-height"
            @node-click="handleNodeClick"
            :default-expand-all =true
            :highlight-current="true"
        >
          <template #default="{ node, data }">

            <div class="custom_top">
              <div class="custom_content">
                <me-icon-build class="custom_img"></me-icon-build>
                <div style="margin-left: 5px;">{{ node.label }}</div>
              </div>
            </div>


          </template>
        </el-tree>
      </div>
    </div>
    <div class="right" >
      <div class="company">{{ t('账号信息') }}</div>
      <div class="account" v-if="department_flag===true">
        <img class="" src="@/assets/images/png/build.png">
        <div class="account_title">
        <span>{{depart_name}}</span>
        </div>
        <div class="account_text">
          <span>{{t('主账号')}}:</span><span>{{plotParentName ===null?t('无'):plotParentName}}</span>
        </div>
        <div class="account_bottom">
          <el-button v-if="plotParentId !=='0'" type="primary" @click="handle_unbinding">{{t('申请解绑')}}</el-button>
          <el-button type="primary" @click="handle_password">{{t('修改密码')}}</el-button>
        </div>
      </div>
      <div v-else>
        <el-table
            :data="user_data.records"
            style="width: 100%"
            ref="multiple_Ref"
        >
          <el-table-column prop="nickname" label="账户信息"  />
          <el-table-column prop="username" label="用户账号"  />
          <el-table-column prop="nickname" label="用户密码"  />
          <el-table-column fixed="right" :label="t('操作')" width="200">
            <template #default="{row}">
              <el-button  type="primary" size="small" @click="handle_reset(row)">{{t('重置密码')}}</el-button>
              <el-button  type="danger" size="small" @click="handle_Unbind(row)" >   {{t('解绑')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    </div>
  <pwd_dialog :dialog="pwd_flag" @save_dialog="handle_save_dialog"></pwd_dialog>
</template>



<script setup lang="ts">
import pwd_dialog from '../component/pwd_dialog/index.vue'
import {useLocalesI18n} from "@/locales/hooks";
import {useUserStore} from "@/store";
import {audit, plot_move, reset, seach_list, user_list} from "@/api/system";
import {message} from "@/utils/components/message";
const { t } = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'system']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const plotParentId = UserStore.user.plotParentId
console.log(typeof plotParentId,'--plotParentId')
const depart_name = UserStore.user.plotName
const plotParentName = UserStore.user.plotParentName
const departmental_date = ref({})
const defaultProps = {
  children: 'children',
  label: 'name',
  id: 'id'
}
const pwd_flag = ref<boolean>(false)
const department_flag = ref<boolean>(true) //展示数据还是公司信息的
const current_page = ref(0);//当前页数
const page_size = ref(12); //每页显示条目个数
const user_data = ref({
  records:[],
})
const handle_depart =()=>{
  department_flag.value =true
}
//点击tree
const handleNodeClick = (data: any) => {
  department_flag.value =false
  user_all(plotId, current_page.value,page_size.value)
  console.log(data,'--data')
}

//申请解绑
const handle_unbinding = async () => {
  ElMessageBox.confirm(
     t('将向主账号管理员申请账号解除绑定操作'),
      t('删除')+t('申请解绑'),
      {
        confirmButtonText: t('确认'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(async () => {
        const res = await plot_move({
          sourcePlotId: plotId,
          targetPlotName:'/0/'
        })
        if (res.data.code ===200){
          message(t('已申请解绑'),{type:"success"})
        }else {
          message(t('取消申请解绑'),{type:"error"})

        }
      })
      .catch(() => {
        message(t('取消解绑'), {type: 'error'})
      })

}
//修改密码
const handle_password = ()=>{
  pwd_flag.value = true
}
const handle_save_dialog = (falg:boolean,status:string)=>{
  pwd_flag.value = falg
  if (status==='cancel') return true
}
const depart =async (parentId:number,parentPath:string)=>{
  const res =await seach_list(parentId,parentPath)
  if (res.data.code ===200){
    departmental_date.value = res.data.data
  }
}
//重置密码
const handle_reset = async (row:any)=>{
  ElMessageBox.confirm(
      t('是否重置密码'),
      t('重置密码'),
      {
        confirmButtonText: t('确认'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(async () => {
        const res = await reset({
          id:row.id
        })
        if (res.data.code ===200){
          message(t('重置密码成功'),{type:"success"})
        }else {
          message(t('取消重置密码'),{type:"error"})

        }
      })
      .catch(() => {
        message(t('取消重置密码'), {type: 'error'})
      })

}
const handle_Unbind = (row)=>{
  console.log(111)
}
const user_all = (async (plotId: number, page: number, size: number) => {
  const res = await user_list(plotId, page, size)
  if (res.data.code ===200){
    user_data.value = res.data.data
  }
})

onMounted(()=>{
  depart(plotId, UserStore.user.plotParentPath)

})
</script>



<style scoped lang="scss">
.container {
  display: flex;
  width: 100%;
  height: 85vh;
  background-color: #ffffff;

  .left {
    //flex: 1;
    width: 380px;
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
      cursor: pointer;
      margin: 20px 0 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center; /* 添加此行 */
      height: 40px;
      width: 90%;
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
    position: relative;
    .company {
      font-size: 18px;
      font-weight: 700;
      margin: 16px 0 0 16px;
    }
    .account {
      position: absolute;
      top: 25%;
      left: 45%;
      img{
        width: 120px;
        height: 120px;
      }
      .account_title {
        font-size: 18px;
        color: #333333;
        font-weight: 700;
        //margin-top: 10px;
      }
      .account_text {
        margin: 30px 0 30px -30px;
        font-size: 16px;
        span{
          padding: 0 10px 10px;
        }
      }
      .account_bottom {
        display: flex;
        margin: 0 20px 0 -20px;
      }
    }
    //overflow-x: auto;
  }



:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content)  {
  background-color: #FFEAEB !important;
  color: #D42A30;
}

</style>
