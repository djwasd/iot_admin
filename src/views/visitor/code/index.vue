<template>
  <div class="person">
    <div class="device">{{ t('访客登记') }}</div>
    <div class="function">
      <div class="function_left">
        <el-button type="primary" @click="handle_add">{{ t('添加访客码') }}</el-button>
      </div>
    </div>
    <div class="person_bottom">
      <div class="box-container">
        <div class="box" v-for="(item,index) in codeAll_data.records" :key="item.id">
          <div class="box-content">
            <div class="top">{{item.name}}</div>
            <qrcode-vue :id="`qrcode${item.id}`" class="qrcode" :value="'http://124.71.181.178/#/records?code=' + item.code"></qrcode-vue>
            <div>{{item.type ===1?t('永久有效'):timestamp_to_time(item.failureTimestamp)+t('失效')}}</div>
          </div>
        <div class="qrcord_image">
          <img src="@/assets/images/png/white_save.png" @click="handle_image(`qrcode${item.id}`)" class="edit-button">
          <img src="@/assets/images/png/white_del.png" @click="handle_del(item)" class="delete-button">
        </div>

        </div>
      </div>
    </div>
    <el-dialog
        v-model="dialog_visible"
        :before-close="handle_close"
        class="dialog_css"
        width="500"
    >
      <template #header>
        <div class="dialog_header">
          {{ t('添加访客码') }}
        </div>
        <div class="dialog_buttom"></div>
      </template>
      <el-form
          ref="code_ref"
          :model="code"
          :rules="rules"
          label-width="auto"
          style="max-width: 400px"
      >
        <el-form-item :label="t('名称')" class="form_item" prop="name">
          <el-input
              style="width: 220px"
              v-model="code.name"
              autocomplete="off"
              clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="t('有效期')" class="form_item" prop="type">
          <el-radio-group v-model="code.type" class="ml-4">
            <el-radio :value="1" size="large">{{t('永久')}}</el-radio>
            <el-radio :value="2" size="large">{{t('自定义')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="code.type===2" :label="t('失效日期')" class="form_item" prop="failureTimestamp">
          <el-date-picker
              v-model="code.failureTimestamp"
              type="datetime"
              value-format="x"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handle_close">{{ t('取消') }}</el-button>
          <el-button type="primary" @click="handle_save">{{ t('确认') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {useLocalesI18n} from "@/locales/hooks";
import {FormInstance, FormRules} from "element-plus";
import qrcodeVue from 'qrcode.vue'
import {code_data, visit_code_add, visit_code_del} from "@/api/visitor";
import {message} from "@/utils/components/message";
import {useUserStore} from "@/store";
import {timestamp_to_time} from "@/utils/packagingmethod/time";
import {downLoadQRcode} from "@/utils/packagingmethod/utils";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'visitor']);
const dialog_visible = ref(false)//弹框的状态
const code_ref = ref<FormInstance>(); //拿到当前ref实力
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const codeAll_data = ref({
  records:[
    {
      type:1,
      name:'code',
      failureTimestamp:0,
      id:0,
      code:0,
    }
  ]
})
const code_list = ref({
  name: '',
  type:1,
  failureTimestamp:null,
  plotId:plotId,
})
const code = ref({
  name: '',
  type:1,
  failureTimestamp:null,
  plotId:plotId,
})
const rules = computed<FormRules>(() => ({
  name: [
    {
      required: true,
      message: t('名称') + t('不能为空'),
      trigger: 'blur',
    },

  ],
  type: [
    {
      required: true,
      message: t('有效期') + t('不能为空'),
      trigger: 'blur',
    },

  ],
  failureTimestamp: [
    {
      required: true,
      message: t('失效日期') + t('不能为空'),
      trigger: 'blur',
    },
  ],
}));
const page = ref(0)
const size = ref(30)
const handle_add = () => {
  code.value = JSON.parse(JSON.stringify(code_list.value))
  dialog_visible.value = true

}
const handle_del = (item:any)=>{
  ElMessageBox.confirm(
       t('删除') +  item.name +t('是否确认?') ,
      t('删除')+t('访客码'),
      {
        confirmButtonText: t('确认'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(async () => {
        await handle_del_code(item.id)
      })
      .catch(() => {
        message(t('取消')+t('删除')+t('访客码'), {type: 'error'})
      })
}
const handle_close = () => {
  if (!code_ref.value) return
  console.log('取消')
  dialog_visible.value = false
}
//添加访客码
const handle_add_code =async (data:any)=>{
  const res =await visit_code_add(data)
  if (res.data.code === 200) {
    await  code_all(plotId,page.value,size.value)

    message(t('添加')+t('成功'),{type:'success'})
  }else {
    message(res.data.message,{type:'error'})
  }
}
//删除访客码
const handle_del_code =async (id:any)=>{
  const res =await visit_code_del({
    id:id
  })
  if (res.data.code === 200) {
    await   code_all(plotId,page.value,size.value)

    message(t('删除')+t('成功'),{type:'success'})
  }else {
    message(res.data.message,{type:'error'})
  }
}

const handle_save = () => {
  code_ref.value?.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      if (code.value.type ===1){
        delete code.value.failureTimestamp
      }
      await handle_add_code(code.value)

      console.log('确认')
      dialog_visible.value = false
    } else {
      console.log('提交错误', fields);
    }

  })
}
//获取所有通行码
const code_all = async (plotId:number,page:number,size:number) => {
  const res = await code_data(plotId,page,size)
  codeAll_data.value = res.data.data
  console.log(codeAll_data.value,'--codeAll_data.value')
}
const handle_image =(id:any)=>{
  downLoadQRcode(id)

}
onMounted(()=>{
  code_all(plotId,page.value,size.value)
})
</script>


<style lang="scss" scoped>
.person {
  width: 100%;
  height: 85vh;
  //padding: 16px;
  background-color: #ffffff;
  overflow-y: auto; /* 添加垂直滚动条 */

  .device {
    font-size: 18px;
    padding: 20px 0 0 20px;
    font-weight: 700;
  }

  .function {
    padding: 20px;
    display: flex;
    justify-content: space-between;

    .function_left {

    }
  }

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
  }
  .person_bottom {
    //padding: 11px;
    margin: 10px 20px 10px 20px;
    width: 800px;
    .box-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 5px;
    }

    .box {
      position: relative;
      border: 1px solid #eda7b8;
      padding: 0 10px;

      height: 160px;
      .box-content {
        text-align: center;
        .top {
          padding-top: 5px;
        }
        .qrcode {
          padding: 5px 0 5px 0;
        }
      }
      .qrcord_image {
      position: absolute;
        top: 0; /* 调整 top 属性的值 */
        right: 0; /* 调整 right 属性的值 */
        width: 55px;
        height: 30px;
        background-color:#7e7e7e;
        border-bottom-left-radius: 15px;
      }

      .delete-button {
        cursor: pointer;
        width: 20px;
        height: 20px;
        position: absolute;
        top: 5px;
        right:0;
      }
      .edit-button {
        cursor: pointer;
        width: 20px;
        height: 20px;
        position: absolute;
        top: 5px;
        right:25px;
      }
    }
  }
}
</style>
