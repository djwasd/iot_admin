<template>
  <div>
    <el-dialog
        v-model="dialog_visible"
        :before-close="handle_close"
        class="dialog_css"
        width="500"
    >
      <template #header>
        <div class="dialog_header">
          {{ t('重置密码') }}
        </div>
        <div class="dialog_buttom"></div>
      </template>
      <el-form
          ref="register_ref"
          :model="register_params"
          :rules="rules"
          label-width="auto"
          style="max-width: 400px"
      >
        <el-form-item :label="t('旧密码')" class="form_item" prop="oldPassword">
          <el-input v-model="register_params.oldPassword" :placeholder="t('请输入密码') " show-password></el-input>
        </el-form-item>
        <el-form-item :label="t('新密码')" class="form_item" prop="password">
          <el-input v-model="register_params.password" :placeholder="t('请输入密码') " show-password></el-input>
        </el-form-item>
        <el-form-item :label="t('确认密码')" class="form_item" prop="confirm_pwd">
          <el-input v-model="register_params.confirm_pwd" :placeholder="t('确认密码') " show-password></el-input>
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
import {validatePassword} from "@/utils/packagingmethod/rules";
import md5 from "js-md5";
import {message} from "@/utils/components/message";
import {update_pwd} from "@/api/system";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'person_table']);
const register_ref = ref<FormInstance>(); //拿到当前ref实力

const dialog_visible = ref(false)
const props = defineProps({  //父组件爱你传递过来的弹框状态
  dialog: {
    type: Boolean as PropType<boolean>,
    default: false
  },
})
const emit = defineEmits();   //定义子组件传递方法
interface RuleForm {
  oldPassword: string
  password: string,
  confirm_pwd: string,
}

const register_params = ref<RuleForm>({
  oldPassword: '',
  password: '',
  confirm_pwd: ''
})
const register_params_data = ref<RuleForm>({
  oldPassword: '',
  password: '',
  confirm_pwd: ''
})
const rules = computed<FormRules>(() => ({
  oldPassword: [
    {
      required: true,
      message: t('密码必须填写!'),
      trigger: 'blur',
    },
    {validator: validatePassword, trigger: 'blur'}
  ],
  password: [
    {
      required: true,
      message: t('密码必须填写!'),
      trigger: 'blur',
    },
    {validator: validatePassword, trigger: 'blur'}
  ],
  confirm_pwd: [
    {
      required: true,
      message: t('请确认密码'),
      trigger: 'blur',
    },
    {validator: twice_nconsistent, trigger: 'blur'}
  ]
}));
//校验两次密码是否一致
const twice_nconsistent = (rule: any, value: string, callback: (error?: Error) => void) => {
  const confirmPassword = register_params.value.password; // 假设确认密码字段名为 confirmPassword
  if (value !== confirmPassword) {
    callback(new Error(t('两次输入的密码不一致')));
  } else {
    callback();
  }
};
const handle_close = () => {
  console.log('取消')
  if (!register_ref.value) return
  register_ref.value.resetFields()
  dialog_visible.value = false
  emit("save_dialog", dialog_visible.value, 'cancel');

}
const handle_save = () => {
  register_ref.value?.validate(async (valid, fields) => {
    if (valid) {
      console.log(valid)
      console.log('确认')
      await update(register_params.value)
      dialog_visible.value = false
      emit("save_dialog", dialog_visible.value, 'save');
    } else {
      console.log('提交错误', fields);
    }
  });

}
const update = async (data: any) => {
  const res = await update_pwd({
    oldPassword: md5(data.oldPassword).toUpperCase(),
    newPassword: md5(data.password).toUpperCase()
  })
  if (res.data.code === 200) {
    message(t('修改成功'), {type: 'success'})
  } else {
    message(res.data.message, {type: "error"})
  }
}
watch(() => props.dialog,
    (newVal) => {
      dialog_visible.value = newVal
      console.log(dialog_visible.value, '-- 当前弹框的状态');
      register_params.value = JSON.parse(JSON.stringify(register_params_data.value))
    });
</script>

<style lang="scss" scoped>
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
</style>
