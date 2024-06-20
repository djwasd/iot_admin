<template>
  <div class="container">
    <div class="left"></div>
    <div class="right">
      <div class="right_content">
        <div class="content_top">
          {{ t('欢迎注册') }}
        </div>
        <div class="register_form" >
          <el-form
              ref="register_ref"
              :model="register_params"
              label-width="auto"
              style="max-width: 400px"
              :rules="rules"
          >
            <el-form-item class="form_item" prop="phone">
              <el-input
                  :placeholder="t('请输入手机号') "
                  v-model="register_params.phone"
                  autocomplete="off"
                  clearable
              >
              </el-input>
            </el-form-item>


            <el-form-item class="form_item" prop="password" >
              <el-input   show-password  :placeholder="t('请输入密码') " v-model="register_params.password"></el-input>
            </el-form-item>
            <el-form-item class="form_item" prop="confirm_pwd" >
              <el-input  show-password   :placeholder="t('确认密码') " v-model="register_params.confirm_pwd"></el-input>
            </el-form-item>
            <el-form-item class="form_item" prop="plotName" >
              <el-input    :placeholder="t('请输入组织名称') " v-model="register_params.plotName"></el-input>
            </el-form-item>
            <el-form-item class="form_item" prop="code" >
              <el-input    :placeholder="t('请输入邀请码') " v-model="register_params.code"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="login_buttom">
          <el-button @click="submit_login" class="button" type="primary">  {{ t('注册') }}</el-button>
          <div class="tips">
            {{ t('已有账号，直接') }}<span @click="login" class="tips_register">{{ t('登录') }}</span>
          </div>
        </div>
        <!-- 内容 -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import md5 from "js-md5";
import { useLocalesI18n } from '@/locales/i18n';
import {FormInstance, FormRules} from "element-plus";
import {validatePassword} from "@/utils/packagingmethod/rules";
import {useRoute, useRouter} from "vue-router";
import {user_register} from "@/api/login";
import {message} from "@/utils/components/message";
const { t } = useLocalesI18n({}, [(locale: string) => import(`./lang/${locale}.json`), 'login_register']);
const register_ref = ref<FormInstance>(); //拿到当前ref实力
const route = useRoute();
const router = useRouter();
interface RuleForm {
  password:string,
  phone:string,
  confirm_pwd:string,
  plotName:string,
  code:string,
}
const countdown = ref<number>(0)
const register_params = ref<RuleForm>({
  phone:'15397119758',
  password:'a123456789',
  confirm_pwd:'a123456789',
  plotName:'浙江华屹物联',
  code:''
})
const rules = computed<FormRules>(() => ({
  phone: [
    {
      required: true,
      message: t('账号必须填写!'),
      trigger: 'blur',
    },
    { validator: validateMobile, trigger: 'blur' }
  ],

  plotName: [
    {
      required: true,
      message: t('组织名称不能为空!'),
      trigger: 'blur',
    },
  ],

  password: [
    {
      required: true,
      message: t('密码必须填写!') ,
      trigger: 'blur',
    },
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirm_pwd:[
    {
      required: true,
      message: t('请确认密码') ,
      trigger: 'blur',
    },
    { validator: twice_nconsistent, trigger: 'blur' }
  ]
}));
//获取验证码

//手机号校验
const validateMobile = (rule: any, value: string, callback: (error?: Error) => void) => {
   if (!/^1(3|4|5|6|7|8|9)[0-9]\d{8}$/.test(value)) {
    callback(new Error(t('请输入正确的账号，必须是手机号!')));
  } else {
    callback();
  }
};
//校验两次密码是否一致
const twice_nconsistent = (rule: any, value: string, callback: (error?: Error) => void) => {
  const confirmPassword = register_params.value.password; // 假设确认密码字段名为 confirmPassword
  if (value !== confirmPassword) {
    callback(new Error(t('两次输入的密码不一致')));
  } else {
    callback();
  }
};
//注册
const submit_login = async () => {
  register_ref.value?.validate(async (valid:boolean, fields:any) => {
    if (valid) {
      console.log(valid,'--valid--登录成功')
      console.log(register_params,'--register_params')
     let date = JSON.parse(JSON.stringify(register_params.value))
      delete date.confirm_pwd
      date.password = md5(date.password).toUpperCase()
      console.log(date,'--date')
      const res= await  user_register(date)
      if (res.data.code ===200){
        message(t('注册成功'), {type: "success"})
        await router.replace('/login');
      }else  {
        message(res.data.message, {type: "error"})
      }
      // await userStore.login(loginParams);  //这里点击登录  username password ;captcha 三个参数
      // await router.replace((route.query.redirect as string) || '/');
    } else {
      console.log('提交错误', fields);
    }
  });
};
//登录
const login = async () => {
  await router.replace('/login');

}

</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  background-color: #ffffff;

  .left {
    flex: 1;
    background-image: url("@/assets/images/bg_login.png");
  }

  .right {
    width: 600px;
    display: flex;
    justify-content: center;

    .right_content {
      width: 480px;
      height: 480px;
      margin: auto;
      border: 1px solid #000000;
      /* 其他样式属性 */
      .content_top {
        height: 50px;
        text-align: center;
        font-size: 32px;
        color: #000;
        font-weight: 600;
        margin-bottom: 30px;
      }
      .register_form {
        margin-left: 35px;
        .form_item {
          margin-bottom: 25px;
        }
      }
      .login_buttom {
        display: flex;
        flex-direction: column;
        align-items: center;
        //width: 400px;
        margin:30px 0 0  0;
        .button {
          width: 400px;
          background-color: rgb(34, 40, 224);
        }
        .tips {
          margin-top: 10px;
          .tips_register {
            color:rgb(74, 84, 237) ;
            cursor: pointer;

          }
        }
      }

    }
  }
}
</style>
