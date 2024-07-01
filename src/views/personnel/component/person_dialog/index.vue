<template>
  <el-dialog
      v-model="dialog_visible"
      :before-close="handle_close"
      class="dialog_css"
      width="1200"
  >
    <template #header>
      <div class="dialog_header">
        {{ props.status === 'add' ? t('添加人员') : t('编辑人员') }}
      </div>
      <div class="dialog_buttom"></div>
    </template>
    <div class="content">
      <el-form
          ref="ruleForm_ref"
          :model="person"
          :rules="rules"
          class="demo-ruleForm"
          label-width="auto"
          status-icon
      >
        <div class="box">


          <div class="left-box">
            <div class="lf_title">{{ t("基础信息") }}</div>
            <div class="lf_left">
              <el-form-item :label="t('姓名')" prop="name">
                <el-input v-model="person.name"></el-input>
              </el-form-item>
              <el-form-item :label="t('性别')" prop="sex">

                <el-select v-model="person.sex" class="location_select">
                  <el-option :label="t('男')" :value="1"/>
                  <el-option :label="t('女')" :value="2"/>
                </el-select>
              </el-form-item>
              <el-form-item :label="t('有效开始时间')" prop="startTimestamp">
                <el-date-picker
                    v-model="person.startTimestamp"
                    type="datetime"

                    value-format="x"
                />

              </el-form-item>
              <el-form-item :label="t('有效结束时间')" prop="endTimestamp">
                <el-date-picker
                    v-model="person.endTimestamp"
                    type="datetime"
                    value-format="x"
                />

              </el-form-item>
              <el-form-item :label="t('密码')" prop="password">
                <el-input v-model="person.password"></el-input>
              </el-form-item>
              <el-form-item :label="t('IC卡卡号')" prop="person.personCardInfoList">
                <el-input v-model="person.personCardInfoList[0].cardNo"></el-input>
              </el-form-item>
            </div>
            <div class="lf_right">
              <el-form-item :label="t('人脸图片')">
                <SingleImage v-model:imageUrl="person_Picture" :fileSize="3" @update:image-url="handle_update">
                  <template #tip> 上传图片最大为 3M</template>
                </SingleImage>
              </el-form-item>

            </div>
          </div>
          <div class="right-box">
            <div class="rl_title">{{ t("身份证信息") }}</div>
            <div class="rl_left">
              <el-form-item :label="t('身份证号码')" prop="idNo">
                <el-input v-model="person.idNo"></el-input>
              </el-form-item>
              <el-form-item :label="t('民族')" prop="nation">
                <el-input v-model="person.nation"></el-input>
              </el-form-item>
              <el-form-item :label="t('出生日期')" prop="birthdayStamp">
                <el-date-picker
                    v-model="person.birthdayStamp"
                    type="date"
                    value-format="x"
                />
              </el-form-item>
              <el-form-item :label="t('住址')" prop="address">
                <el-input v-model="person.address"></el-input>
              </el-form-item>
              <el-form-item :label="t('签发机关')" prop="issuingAuthority">
                <el-input v-model="person.issuingAuthority"></el-input>
              </el-form-item>
              <el-form-item :label="t('职务')" prop="post">
                <el-input v-model="person.post"></el-input>
              </el-form-item>
              <el-form-item :label="t('工种')" prop="craft">
                <el-input v-model="person.craft"></el-input>
              </el-form-item>
              <el-form-item :label="t('电话号码')" prop="phone">
                <el-input v-model="person.phone"></el-input>
              </el-form-item>
            </div>
            <div class="rl_right">
              <el-form-item :label="t('有效开始时间')" prop="startTimestamp">
                <el-date-picker
                    v-model="person.idNoStartDateTimestamp"
                    type="datetime"
                    value-format="x"
                />

              </el-form-item>
              <el-form-item :label="t('有效结束时间')" prop="endTimestamp">
                <el-date-picker
                    v-model="person.idNoEndDateTimestamp"
                    type="datetime"
                    value-format="x"
                />

              </el-form-item>
              <el-form-item :label="t('银行卡号')" prop="bankCard">
                <el-input v-model="person.bankCard"></el-input>
              </el-form-item>
              <el-form-item :label="t('银行卡号物理卡号')" prop="bankPhysicsCard">
                <el-input v-model="person.bankPhysicsCard"></el-input>
              </el-form-item>
              <el-form-item :label="t('身份证图片')" prop="idNoPicture">
                <el-image
                    :close-on-press-escape="false"
                    :initial-index="4"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="[person.facePicture]"
                    :preview-teleported="true"
                    :src="person.idNoPicture"
                    :zoom-rate="1.2"
                    fit="cover"
                    style="width: 150px; height: 150px"
                >
                  <template #error>
                    <div class="image-slot">
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
        <div>
          <div class="IC_card">其他</div>
          <div class="IC_content">
            <el-form-item :label="t('等待时间')" class="content_item">
              <el-input v-model="waiting_time">
              </el-input>
            </el-form-item>
            <div class="content_delay">5~60(s)</div>
            <el-form-item :label="t('IC卡录入')" class="content_buttom">
              <el-button class="content_button">开始录入</el-button>
            </el-form-item>
            <el-form-item :label="t('拍照录入')" class="content_buttom">
              <el-button class="content_button">开始录入</el-button>
            </el-form-item>
            <el-form-item :label="t('身份证录入')" class="content_buttom">
              <el-button class="content_button">开始录入</el-button>
            </el-form-item>
          </div>

        </div>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handle_close">{{ t("取消") }}</el-button>
        <el-button type="primary" @click="handle_save ">{{ t("确认") }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {useLocalesI18n} from "@/locales/hooks";
import {FormInstance, FormRules} from "element-plus";
import {person_interface} from "@/views/personnel/interface";
import SingleImage from '@/common/UploadImgs/SingleImage.vue'
import {validateIDCard, validatePhoneNumber} from "@/utils/packagingmethod/rules";
import {filterObject} from "@/utils/packagingmethod/utils"
import {useUserStore} from "@/store";
import {upload_person} from "@/api/glob";
import {PropType} from "vue";

const ruleForm_ref = ref<FormInstance>(); //拿到当前ref实力
const UserStore = useUserStore()

const {t} = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'person_dialog']);

const dialog_visible = ref(false)
const props = defineProps({  //父组件爱你传递过来的弹框状态
  dialog: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  status: {
    type: String as PropType<string>,
    default: ''
  },
  tree_node: {
    type: String as PropType<string>,
    default: '0'
  },
  editDate: {
    type: Object as PropType<object>,
    default: {}
  }
})
const emit = defineEmits();   //定义子组件传递方法
console.log(props, '---props')
const waiting_time = ref<string>('5')//刷卡等等 等待的时间
const person_Picture = ref('')
// const person = ref({})
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
  organizationId: '',
  password: "",

  personCardInfoList: [
    {cardNo: "",}
  ],
  phone: "",
  plotId: UserStore.user.plotId,
  post: "",
  sex: 1,//性别 1男 2女
  startTimestamp: 1704038400000 //有效开始时间戳
})

const person_list = ref<person_interface>({
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
  organizationId: 0,
  password: "",

  personCardInfoList: [
    {cardNo: "",}
  ],
  phone: "",
  plotId: UserStore.user.plotId,
  post: "",
  sex: 1,//性别 1男 2女
  startTimestamp: 1704038400000 //有效开始时间戳
})
const rules = computed<FormRules>(() => ({
  idNo: [
    {validator: validateIDCard, trigger: 'blur'}
  ],
  phone: [
    {validator: validatePhoneNumber, trigger: 'blur'}
  ],
  name: [
    {
      required: true,
      message: t('姓名') + t('不能为空'),
      trigger: 'blur',
    },
  ],

}));

//弹框取消
const handle_close = () => {
  if (!ruleForm_ref.value) return
  ruleForm_ref.value.resetFields()
  console.log('关闭')
  person_Picture.value = ''
  dialog_visible.value = false
  emit("save", dialog_visible.value, 'cancel');
}


//弹框确认
const handle_save = () => {
  ruleForm_ref.value?.validate(async (valid, fields) => {
    if (valid) {
      person_Picture.value = ''
      dialog_visible.value = false
      person.value.organizationId = props.tree_node
      person.value = filterObject(person.value)
      emit("save", dialog_visible.value, 'save', person.value);
    } else {
      console.log('提交错误', fields);
    }
  });

}
//编辑的时候获取图片的
const init_edit = async () => {
  if (person.value.facePicture !== null) {
    console.log('编辑的时候获取图片')
    const res = await upload_person(person.value.facePicture)
    // console.log(res,'--res')
    // let binary = "";
    // for (let i = 0; i < res.data.length; i++) {
    //   binary += String.fromCharCode(btoa(binary).charCodeAt(i) & 0xff);
    // }
    // person_Picture.value ="data:image/jpg;base64," + btoa(binary)
    var ipAddress = window.location.host
    person_Picture.value = `http://${ipAddress}/operation/cloud/web/sys/api/v1/attachment/actions/download?file_id=${person.value.facePicture} `
    console.log(person_Picture.value, '--person_Picture.value')
  } else {
    person_Picture.value = ''
  }

}
const handle_update = (date, val) => {
  console.log(val, '--val')
  person.value.facePicture = val.id
}
watch([() => props.dialog,
      () => props.status,
      () => props.tree_node,
      () => props.editDate],
    ([newDialog, newStatus, new_tree_node, new_editDate]) => {
      props.tree_node = new_tree_node
      person_list.value.organizationId = new_tree_node.id
      dialog_visible.value = newDialog;
      if (newStatus === 'add') {
        person.value = JSON.parse(JSON.stringify(person_list.value))
        person_Picture.value = ''
      } else {
        if (new_editDate.personCardInfoList.length === 0) {
          new_editDate.personCardInfoList = [{cardNo: ''}]

        }

        person.value = JSON.parse(JSON.stringify(new_editDate))
        init_edit()
      }
      console.log(person.value, '-- person.value')
      // 执行其他操作...
    });
</script>

<style lang="scss" scoped>
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
        padding: 30px 0;

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
          padding: 0 10px 0 0;

        }

        .lf_right {
          flex: 1;
        }
      }

      .right-box {
        flex: 1;
        display: flex;
        position: relative;
        padding: 30px 0;
        margin-left: 30px;

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
          padding: 0 10px 0 0;

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
        width: 278px;
        margin-right: 13px;
      }

      .last {
        margin-left: 18px;
      }

      .content_delay {
        padding-top: 5px;
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

//:deep(.el-input el-input--default){
//  width: 174px !important;
//}
</style>
<style scoped>

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}

</style>
