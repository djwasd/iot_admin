<template>
  <div class="person">
    <div class="device">{{t('黑名单')}}</div>
    <div class="function">
      <div class="function_left">
        <el-button type="primary" @click="handle_move_black">{{ t('移出黑名单') }}</el-button>
        <el-button @click=handle_deletion> {{ t('批量删除') }}</el-button>
      </div>
      <div class="function_right">
        <div class="search-wrapper">
          <el-input
              v-model="search_person"
              :placeholder="t('请输入姓名或ID')"
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
          :data="personnel_date.records"
          style="width: 100%"
          ref="multiple_Ref"
          @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="80" />
        <el-table-column
            :index="set_index"
            :label="t('序号')"
            prop="Number"
            type="index"
            width="80"
        >
        </el-table-column>
        <el-table-column prop="id" label="ID"  />
        <el-table-column prop="name" :label="t('姓名')"  />
        <el-table-column prop="state" :label="t('卡号')" />
        <el-table-column prop="facePicture" :label="t('人脸')" >
          <template #default="{ row }">
            <span>{{ row.facePicture !== null ? t('有') : t('无') }}</span>
          </template>

        </el-table-column>
        <el-table-column fixed="right" :label="t('操作')" width="200">
          <template #default="{row}">
            <el-button  type="primary" size="small" @click="handle_edit(row)">{{t('编辑')}}</el-button>
            <el-button  type="danger" size="small" @click="handle_del(row)" >   {{t('删除')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
          v-model:current-page="current_page"
          v-model:page-size="page_size"
          layout="prev, pager, next, jumper"
          :total="personnel_date.total"
          @current-change="handleCurrentChange"
      />

    </div>
    <el-dialog
        v-model="dialog_visible"
        :before-close="handle_close"
        class="dialog_css"
        width="1200"
    >
      <template #header>
        <div class="dialog_header">
          {{ t('编辑人员')}}
        </div>
        <div class="dialog_buttom"></div>
      </template>
      <div class="content">
        <el-form
            ref="ruleForm_ref"
            :model="person"
            :rules="rules"
            label-width="auto"
            class="demo-ruleForm"
            status-icon
        >
          <div class="box">


            <div class="left-box">
              <div class="lf_title">{{t("基础信息")}}</div>
              <div class="lf_left">
                <el-form-item :label="t('姓名')"  prop="name">
                  <el-input v-model="person.name"></el-input>
                </el-form-item>
                <el-form-item :label="t('性别')"  prop="sex">

                  <el-select class="location_select" v-model="person.sex" >
                    <el-option :label="t('男')" :value="1" />
                    <el-option :label="t('女')" :value="2" />
                  </el-select>
                </el-form-item>
                <el-form-item :label="t('有效开始时间')"  prop="startTimestamp">
                  <el-date-picker
                      v-model="person.startTimestamp"
                      type="datetime"

                      value-format="x"
                  />

                </el-form-item>
                <el-form-item :label="t('有效结束时间')"  prop="endTimestamp">
                  <el-date-picker
                      v-model="person.endTimestamp"
                      type="datetime"
                      value-format="x"
                  />

                </el-form-item>
                <el-form-item :label="t('密码')"  prop="password">
                  <el-input  v-model="person.password"></el-input>
                </el-form-item>
                <el-form-item :label="t('IC卡卡号')"  prop="person.personCardInfoList">
                  <el-input  v-model="person.personCardInfoList[0].cardNo"></el-input>
                </el-form-item>
              </div>
              <div class="lf_right">
                <el-form-item :label="t('人脸图片')" >
                  <SingleImage @update:image-url="handle_update" v-model:imageUrl="person_Picture" :fileSize="3">
                    <template #tip> 上传图片最大为 3M </template>
                  </SingleImage>
                </el-form-item>

              </div>
            </div>
            <div class="right-box">
              <div class="rl_title">{{t("身份证信息")}}</div>
              <div class="rl_left">
                <el-form-item :label="t('身份证号码')"  prop="idNo">
                  <el-input v-model="person.idNo"></el-input>
                </el-form-item>
                <el-form-item :label="t('民族')"  prop="nation">
                  <el-input v-model="person.nation"></el-input>
                </el-form-item>
                <el-form-item :label="t('出生日期')"  prop="birthdayStamp">
                  <el-date-picker
                      v-model="person.birthdayStamp"
                      type="date"
                      value-format="x"
                  />
                </el-form-item>
                <el-form-item :label="t('住址')"  prop="address">
                  <el-input v-model="person.address"></el-input>
                </el-form-item>
                <el-form-item :label="t('签发机关')"  prop="issuingAuthority">
                  <el-input v-model="person.issuingAuthority"></el-input>
                </el-form-item>
                <el-form-item :label="t('职务')"  prop="post">
                  <el-input v-model="person.post"></el-input>
                </el-form-item>
                <el-form-item :label="t('工种')"  prop="craft">
                  <el-input v-model="person.craft"></el-input>
                </el-form-item>
                <el-form-item :label="t('电话号码')"  prop="phone">
                  <el-input v-model="person.phone"></el-input>
                </el-form-item>
              </div>
              <div class="rl_right">
                <el-form-item :label="t('有效开始时间')"  prop="startTimestamp">
                  <el-date-picker
                      v-model="person.idNoStartDateTimestamp"
                      type="datetime"
                      value-format="x"
                  />

                </el-form-item>
                <el-form-item :label="t('有效结束时间')"  prop="endTimestamp">
                  <el-date-picker
                      v-model="person.idNoEndDateTimestamp"
                      type="datetime"
                      value-format="x"
                  />

                </el-form-item>
                <el-form-item :label="t('银行卡号')"  prop="bankCard">
                  <el-input v-model="person.bankCard"></el-input>
                </el-form-item>
                <el-form-item :label="t('银行卡号物理卡号')"  prop="bankPhysicsCard">
                  <el-input v-model="person.bankPhysicsCard"></el-input>
                </el-form-item>
                <el-form-item :label="t('身份证图片')"  prop="idNoPicture">
                  <el-image
                      style="width: 150px; height: 150px"
                      :src="person.idNoPicture"
                      :zoom-rate="1.2"
                      :max-scale="7"
                      :min-scale="0.2"
                      :preview-src-list="[person.facePicture]"
                      :initial-index="4"
                      fit="cover"
                  >
                    <template #error>
                      <div class="image-slot" >
                        <mel-icon-picture></mel-icon-picture>
                      </div>
                    </template>
                  </el-image>
                </el-form-item>
              </div>
            </div>
          </div>
          <!--        <div >-->
          <!--          <div class="IC_card">IC卡信息</div>-->
          <!--          <div class="IC_content">-->
          <!--            <el-form-item class="content_item" :label="t('卡号1')"  prop="ID">-->
          <!--              <el-input v-model="person.name"></el-input>-->
          <!--            </el-form-item >-->
          <!--            <el-form-item class="content_item" :label="t('卡号2')"  prop="number">-->
          <!--              <el-input v-model="person.name"></el-input>-->
          <!--            </el-form-item >-->
          <!--            <el-form-item class="content_item last" :label="t('ID')"  prop="ID">-->
          <!--              <el-input v-model="person.name"></el-input>-->
          <!--            </el-form-item>-->
          <!--          </div>-->
          <!--        </div>-->
          <div >
            <div class="IC_card">其他</div>
            <div class="IC_content">
              <el-form-item class="content_item" :label="t('等待时间')"  >
                <el-input v-model="waiting_time">
                </el-input>
              </el-form-item >
              <div class="content_delay">5~60(s)</div>
              <el-form-item class="content_buttom"  :label="t('IC卡录入')" >
                <el-button  class="content_button">开始录入</el-button>
              </el-form-item >
              <el-form-item  class="content_buttom" :label="t('拍照录入')" >
                <el-button class="content_button">开始录入</el-button>
              </el-form-item >
              <el-form-item class="content_buttom"  :label="t('身份证录入')" >
                <el-button class="content_button">开始录入</el-button>
              </el-form-item >
            </div>

          </div>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handle_close">{{t("取消")}}</el-button>
          <el-button type="primary" @click="handle_save ">{{t("确认")}}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import type {FormInstance, FormRules} from 'element-plus';
import {blacklist, personnel_edit, personnel_list} from '@/api/person'
import {useLocalesI18n} from "@/locales/hooks";
import {message} from "@/utils/components/message";
import {actions_list,personnel_del} from "@/api/person";
import {useUserStore} from "@/store";
import SingleImage from "@/common/UploadImgs/SingleImage.vue";
import {person_interface} from "@/views/personnel/interface";
import {validateIDCard, validatePhoneNumber} from "@/utils/packagingmethod/rules";
import {upload_person} from "@/api/glob";
import {filterObject} from "@/utils/packagingmethod/utils";

const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'personnel']);
const rule_ref = ref<FormInstance>(); //拿到当前ref实力
const search_person = ref<string>('')
const current_page = ref(0);//当前页数
const page_size = ref(12); //每页显示条目个数
const parentPath =ref<string>('0/0')
const  personnel_date = ref({
  "records": [

    {
      "id": "122",
      "name": "2",
      "sex": 1,
      "password": null,
      "facePicture": null,
      "idNo": null,
      "phone": null,
      "birthdayStamp": 0,
      "startTimestamp": 1704038400000,
      "endTimestamp": 2082643200000,
      "address": null,
      "issuingAuthority": null,
      "craft": null,
      "idNoStartDateTimestamp": 0,
      "idNoEndDateTimestamp": 0,
      "idNoPicture": "0",
      "nation": null,
      "post": null,
      "bankCard": null,
      "bankPhysicsCard": null,
      "personCardInfoList": []
    }
  ],
  "total": 15,
  "size": 12,
  "current": 1,
  "orders": [],
  "optimizeCountSql": true,
  "searchCount": true,
  "maxLimit": null,
  "countId": null,
  "pages": 1
}) //当前列表所有数据
 const multipleSelection = ref([])  //点击多选框 拿到当前选中的table列
const treeNode = ref<any>('0')
const dialog_visible = ref(false)
const ruleForm_ref = ref<FormInstance>(); //拿到当前ref实力
const person_Picture = ref('')//人脸图片
const person = ref<person_interface>({
  address: "",
  bankCard: "",
  bankPhysicsCard: "",
  birthdayStamp: 0,//出生日期
  craft: "",
  endTimestamp: 2082643200000,  //有效结束时间戳   目前期望不超过2037年
  facePicture: '',  //暂定人脸图片
  idNo: "", //身份证号码
  idNoEndDateTimestamp: 0,
  idNoPicture: 0,
  idNoStartDateTimestamp: 0,
  issuingAuthority: "",
  name: "", //姓名
  nation: "", //名族
  organizationId:'',
  password: "",

  personCardInfoList: [
    {cardNo: "",}
  ],
  phone: "",
  plotId: plotId,
  post: "",
  sex: 1,//性别 1男 2女
  startTimestamp: 1704038400000 //有效开始时间戳
})
const rules = computed<FormRules>(() => ({
  idNo: [
    { validator: validateIDCard, trigger: 'blur' }
  ],
  phone: [
    { validator: validatePhoneNumber, trigger: 'blur' }
  ],
  name: [
    {
      required: true,
      message: t('姓名')+t('不能为空'),
      trigger: 'blur',
    },
  ],

}));
const waiting_time = ref<string>('5')//刷卡等等 等待的时间


const handleSelectionChange = (val:any) => {
  multipleSelection.value =val.map(item => item.id);
  console.log(  multipleSelection.value,'--  multipleSelection.value')
}
const handleCurrentChange = (val:number) => {
  console.log(val,'--val')
  current_page.value = val;
  personnel_list_all(  treeNode.value, val, 12,parentPath.value)  //默认查询第一页
};
//删除
const  handle_del = (row:any)=>{
  const data:Array<string> = []
  data.push(row.id)
  ElMessageBox.confirm(
      t('将删除您所勾选的人员，是否确认?'),
      t('删除确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(async () => {
        await  personnel_del_all(data)

      })
      .catch(() => {
        message(t('取消删除'), {type: "error"})

      })


}
const handle_edit = async (row: any) => {
  if (row.personCardInfoList.length ===0){
    row.personCardInfoList = [{cardNo:''}]

  }
  person.value = JSON.parse(JSON.stringify(row))
  if (person.value.facePicture !== null) {
    console.log('编辑的时候获取图片')
    const res = await upload_person(person.value.facePicture)
    var ipAddress = window.location.host
    person_Picture.value = `http://${ipAddress}/operation/cloud/web/sys/api/v1/attachment/actions/download?file_id=${person.value.facePicture} `
    console.log(person_Picture.value, '--person_Picture.value')
  } else {
    person_Picture.value = ''
  }
  dialog_visible.value = true
}
const handle_update = (date,val)=>{
  console.log(val,'--val')
  person.value.facePicture = val.id
}
//批量删除
const handle_deletion = ()=>{
  ElMessageBox.confirm(
      t('将删除您所勾选的人员，是否确认?'),
      t('批量删除确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(async () => {
        console.log(  multipleSelection.value,'--  multipleSelection.value')
        if( multipleSelection.value.length ===0){
          return   message(t('删除人员不能为空'),{ type: "success" })

        }
        await   personnel_del_all(multipleSelection.value)

      })
      .catch(() => {
        message(t('取消批量删除'),{ type: "error" })

      })
}
//删除人员接口
const personnel_del_all =async (id:Array<string>)=>{
  const  res =await personnel_del({
    ids:id
  })
  if (res.data.code === 200){
    message(t('删除')+ t('成功'), {type: "success"})
    await personnel_list_all(treeNode.value, current_page.value, 12, parentPath)  //默认查询第一页        // ElMessage({

  }else  {
    message(res.data.message, {type: "error"})
  }
}
const set_index = (index)=>{
  if (current_page.value >=1){
    return (current_page.value -1) * page_size.value + index + 1

  }else  {
    return (current_page.value ) * page_size.value + index + 1

  }
}
const handle_department = async (plotId: any) => {
  const res = await actions_list( plotId)
  if (res.data.code === 200) {
    treeNode.value =   res.data.data[0].id
    parentPath.value =   res.data.data[0].parentPath

  }
}
const handle_move_black = ()=>{
  ElMessageBox.confirm(
      t('将您所勾选的人员，移动至黑名单，是否确认?'),
      t('移至黑名单确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText:t('取消'),
        type: 'warning',
      }
  )
      .then(async () => {
        if( multipleSelection.value.length ===0){
          return   message(t('人员不能为空'),{ type: "error" })

        }
        const res = await blacklist({
          operate:false,
          personIds:multipleSelection.value
        })
        if (res.data.code ===200){
          message(t('移出黑名单成功'),{ type: "success" })
          await  personnel_list_all( treeNode.value, current_page.value, 12,parentPath.value)  //默认查询第一页
        }

      })
      .catch(() => {
        message(t('取消移至黑名单'),{ type: "error" })

      })
}
//获取人员列表
const personnel_list_all = async (organizationId:number, page:number, size:number, parentPath:string, name = undefined) => {
  const res = await personnel_list(organizationId, page, size, 3, parentPath, name);
  if (res.data.code === 200) {
    personnel_date.value = res.data.data;
    console.log( personnel_date.value,'-- personnel_date.value')
  }
}
//弹框取消
const handle_close = ()=> {
  if (!ruleForm_ref.value) return
  ruleForm_ref.value.resetFields()
  console.log('关闭')
  person_Picture.value = ''
  dialog_visible.value = false
}
const handle_save = ()=>{
  ruleForm_ref.value?.validate(async (valid, fields) => {
    if (valid) {
      person_Picture.value = ''
      dialog_visible.value=false
      person.value.organizationId =  treeNode.value
      person.value = filterObject(person.value)
      await personnelEdit(person.value)
      await personnel_list_all(treeNode.value, current_page.value, 12, parentPath.value); // 默认查询第一页

    } else {
      console.log('提交错误', fields);
    }
  });

}
const personnelEdit =async (date)=>{
  const res =await personnel_edit(date)
  if (res.data.code ===200){
    message(t('编辑')+ t('成功'), {type: "success"})

  }else {
    message(res.data.message, {type: "error"})

  }
}
const route = useRoute();
watch(
    route,
    async () => {
      await handle_department(plotId); // 获取初始部门列表
      await personnel_list_all(treeNode.value, current_page.value, 12, parentPath.value); // 默认查询第一页
    },
    { immediate: true },
);
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
  .dialog_css {
    .dialog_header {
      font-size: 18px;
      color: #333333;
      width: 100%;
      //border-bottom: 1px solid #333333;
    }
    .dialog_buttom {
      height: 1px;
      border: 1px solid #333333;
      margin: 16px 0;
      width: 100%;

    }
    .content {
      display: flex;
      justify-content: center;
      align-items: center;
      .box {
        width: 100%;
        display: flex;
        .left-box {
          flex: 1;
          display: flex;
          position: relative;
          padding: 30px 0 ;
          .lf_title {
            position: absolute;
            top: -10px;
            left: 0;
            width: 100%;
            text-align: left;
            font-size: 16px;
            font-weight: 700;

          }
          .lf_left {
            flex: 1;
            padding:  0 10px 0 0;

          }
          .lf_right {
            flex: 1;
          }
        }
        .right-box {
          flex: 1;
          display: flex;
          position: relative;
          padding: 30px 0 ;
          margin-left:30px;

          .rl_title {
            position: absolute;
            top: -10px;
            left: 0;
            width: 100%;
            text-align: left;
            font-size: 16px;
            font-weight: 700;
          }
          .rl_left {
            flex: 1;
            padding:  0 10px 0 0;

          }
          .rl_right {
            flex: 1;

          }
        }
      }
      .IC_card {
        font-size: 16px;
        font-weight: 700;
      }
      .IC_content {
        display: flex;
        padding: 30px 0;
        .content_item {
          width:278px;
          margin-right: 13px;
        }
        .last {
          margin-left: 18px;
        }
        .content_delay {
          padding-top: 5px ;
        }
        .content_buttom {
          padding-left: 30px;
          .content_button {
            border: 1px solid #0062FF;
          }
        }
      }
    }
  }

}
</style>
