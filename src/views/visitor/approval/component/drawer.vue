<template>
  <div>
    <el-drawer
        v-model="props.list_dia"
        direction="rtl"
        :before-close="handle_cancel"
        class="drawer"
        size="35%"
    >
      <template #header>
        <div class="drawer_header">
          {{t('访客审批')}}
        </div>
      </template>
      <template #default>
        <div class="drawer_buttom"></div>
        <el-form
            ref="rule_ref"
            :model="rule_form"
            :rules="rules"
            class="form_css"
            label-width="auto"

        >
          <div class="form_text">{{t('访客信息')}}</div>
          <div class="visitor">
            <div class="visitor_left">
              <el-form-item  :label="t('姓名')" prop="visitorName">
                <el-input
                    v-model="rule_form.visitorName"
                    :placeholder="t('请输入')+t('姓名') "
                    autocomplete="off"
                    clearable
                    disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item :label="t('性别')"  prop="visitorSex">

                <el-select style="width: 175px" class="location_select"   disabled v-model="rule_form.visitorSex" >
                  <el-option :label="t('男')" :value="1" />
                  <el-option :label="t('女')" :value="2" />
                </el-select>
              </el-form-item>
              <el-form-item :label="t('公司')" prop="visitorCompany">
                <el-input
                    v-model="rule_form.visitorCompany"
                    :placeholder="t('请输入')+t('公司') +t('名称')"
                    autocomplete="off"
                    clearable
                    disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item :label="t('手机号')" prop="visitorPhone">
                <el-input
                    v-model="rule_form.visitorPhone"
                    autocomplete="off"
                    clearable
                    disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item :label="t('身份证号码')" prop="visitorIdNo">
                <el-input
                    v-model="rule_form.visitorIdNo"
                    autocomplete="off"
                    clearable
                    disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item :label="t('邮箱')" prop="visitorEmail">
                <el-input
                    v-model="rule_form.visitorEmail"
                    autocomplete="off"
                    clearable
                    disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item :label="t('车牌号')" prop="visitorPlateNumber">
                <el-input
                    v-model="rule_form.visitorPlateNumber"
                    autocomplete="off"
                    clearable
                    disabled
                >
                </el-input>
              </el-form-item>
            </div>
            <div class="visitor_right">
              <el-form-item :label="t('通行照片')" prop="visitorFacePicture">
                <SingleImage   disabled @update:image-url="handle_update" v-model:imageUrl="list_picture" :fileSize="3">
                  <template #tip> 分辨率不大于1080*1920 </template>
                </SingleImage>
              </el-form-item>
            </div>
          </div>
          <div class="form_text">{{t('访问信息')}}</div>
          <div class="accessing">
            <div class="accessing_left">
              <el-form-item :label="t('被访人')" prop="interviewee">
                <el-input
                    v-model="rule_form.interviewee"
                    :placeholder="t('请输入')+t('姓名') "
                    autocomplete="off"
                    clearable
                    disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item :label="t('拜访事由')" prop="visitReason">
                <el-input
                    v-model="rule_form.visitReason"
                    autocomplete="off"
                    clearable
                    disabled
                >
                </el-input>
              </el-form-item>

            </div>
            <div class="accessing_right">
            </div>

          </div>
          <el-form-item :label="t('访问日期')" >
            <el-date-picker
                v-model="access_date"
                type="datetimerange"
                :start-placeholder="t('开始日期')"
                :end-placeholder="t('结束日期')"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="x"
                disabled
            />
          </el-form-item>

        </el-form>
        <div class="form_text" style="padding-bottom: 10px">{{t('审批')}}
        </div>
                    <el-radio-group v-model="approval.result">
                      <el-radio :value="3">{{t('同意')}}</el-radio>
                      <el-radio :value="4">{{t('拒绝')}}</el-radio>
                    </el-radio-group>
       <div class="buttom">
         <span>
           {{t('通行设备')}}
         </span>
       <el-button @click="handle_device">{{t('添加通行设备')}}</el-button>
       </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="handle_cancel">{{ t('取消') }}</el-button>
          <el-button type="primary" @click="handle_save">{{ t('确认') }}</el-button>
        </div>
      </template>
    </el-drawer>
    <approval_dialog :dialog="dialog_flag" @save_dialog="handle_save_dia"></approval_dialog>

  </div>

</template>


<script setup lang="ts">
import approval_dialog from '../component/dialog.vue'
import {useLocalesI18n} from "@/locales/hooks";
import {FormInstance, FormRules} from "element-plus";
import {validateIDCard, validatePhoneNumber} from "@/utils/packagingmethod/rules";
import SingleImage from "@/common/UploadImgs/SingleImage.vue";
import {upload_person} from "@/api/glob";
import {message} from "@/utils/components/message";
const { t } = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'authorization']);
const drawer =ref(false)//当前弹框的状态
const rule_form = ref<any>({
  visitorName:'',
  visitorSex:1,
  visitorCompany:'',
  visitorPhone:'',
  visitorIdNo:'',
  visitorEmail:'',
  visitorPlateNumber:'',
  visitorFacePicture:'',
  interviewee:'',
  visitReason:'',
  startTimestamp:0,
  endTimestamp:0,
  applyTimestamp:0,
})
const approval = ref({
  result:2,
  devices:[]
})
const list_picture = ref('')
const access_date =ref([1704038400000,2082643200000])
const rules = computed<FormRules>(() => ({
  visitorName: [
    {required: true, message: t('姓名') + t('不能为空'), trigger: 'blur'},
  ],
  interviewee: [
    {required: true, message: t('被访人') + t('不能为空'), trigger: 'blur'},
  ],

  visitorFacePicture: [
    {required: true, message: t('通行照片') + t('不能为空'), trigger: 'blur'},
  ],
  visitorPhone: [
    { validator: validatePhoneNumber, trigger: 'blur' }
  ],
  visitorIdNo: [
    { validator: validateIDCard, trigger: 'blur' }
  ],

}));
const rule_ref = ref<FormInstance>(); //拿到当前ref实力
const dialog_flag = ref<boolean>(false)
const props = defineProps({  //父组件爱你传递过来的弹框状态
  list_dia: {
    type:  Boolean as PropType<boolean>,
    default: false
  },
  show_status:{
    type:String as  PropType<string>,
    default:''
  },
  editDate:{
    type:  Object as PropType<object>,
    default: {}
  }
})
const emit = defineEmits();   //定义子组件传递方法
//选择图片调用组建 返回
const handle_update = (date,val)=>{
  console.log(val,'--val')
  rule_form.value.visitorFacePicture = val.id
}

//抽屉取消
const handle_cancel = ()=>{
  console.log('取消')
  drawer.value = false
  emit("save_list", drawer.value,'cancel');
}
const handle_device = ()=>{
  console.log('添加设备')
  dialog_flag.value = true
}
const handle_save_dia = (flag:boolean,status:string,data:any)=>{
  dialog_flag.value = flag
  if (status==='cancel')return true
  console.log(data,'--data')
  approval.value.devices = data
}
const handle_save = ()=>{
  rule_ref.value?.validate( (valid:any, fields:any) => {
    if (valid) {
      console.log(approval.value,'--aaaaa')
      if (approval.value.devices.length ===0){
     return  message(t('请选择通行设备'),{type:'error'})
      }
      drawer.value = false
      emit("save_list", drawer.value,'save',approval.value);
    } else {
      console.log('提交错误', fields);
    }
  });

}
const init_edit =async ()=>{
  if ( rule_form.value.visitorFacePicture !==null){
    const res =await upload_person(rule_form.value.visitorFacePicture)
    var ipAddress = window.location.host
    list_picture.value =`http://${ipAddress}/operation/cloud/web/sys/api/v1/attachment/actions/download?file_id=${rule_form.value.visitorFacePicture} `
    console.log(list_picture.value,'--person_Picture.value')
  }else {
    list_picture.value =''
  }

}
watch( ()=>props.editDate,
    async (new_editDate) => {
      console.log(new_editDate,'--new_editDate')
        rule_form.value = JSON.parse(JSON.stringify(new_editDate))
        access_date.value[0] =   rule_form.value.startTimestamp
        access_date.value[1] =   rule_form.value.endTimestamp
        await init_edit()


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
  .form_css {
    .form_text {
      font-size: 16px;
      color: #333333;
      font-weight: 700;

    }
    .visitor {
      display: flex;
      padding: 30px 0;
      .visitor_left {
        flex: 1;
      }

      .visitor_right {
        flex: 1;
      }
    }
    .accessing {
      display: flex;
      padding-top: 20px;
      .accessing_left {
        flex: 1;
      }
      .accessing_right {
        flex: 1;
      }
    }

  }


}
.buttom {
  padding: 10px 0;
  span{
    padding-right: 20px;
  }
}
</style>
