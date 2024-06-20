<template>
  <div class="container">
    <div class="left"></div>
    <div class="right">
      <div class="right_content">
        <div class="content_top">
          {{ t('欢迎登录') }}
        </div>
        <div class="text_container">
          <span :class="{ active: activeTab === 'password' }" @click="setActiveTab('password')">{{ t('密码登录') }}</span>
          <!--          <span :class="{ active: activeTab === 'verification' }" @click="setActiveTab('verification')">{{ t('验证码登录') }}</span>-->

        </div>
        <div class="login_form" >
          <el-form
              ref="login_ref"
              :model="loginParams"
              label-width="auto"
              style="max-width: 400px"
              :rules="rules"
          >
            <el-form-item class="form_item" prop="username">
              <el-input  @keyup.enter.native="submit_login"  :placeholder="t('请输入账号') " v-model="loginParams.username"></el-input>
            </el-form-item>
            <el-form-item class="form_item" prop="password" v-if="activeTab === 'password'">
              <el-input show-password   :placeholder="t('请输入密码') " v-model="loginParams.password"></el-input>
            </el-form-item>
            <!--            <el-form-item class="form_item" prop="code" v-if="activeTab !== 'password'">-->
            <!--              <el-input :placeholder="t('请输入验证码')" v-model="loginParams.code">-->
            <!--                <template v-slot:append>-->
            <!--                  <el-button @click="getCode" :disabled="countdown > 0" type="primary"> {{ countdown > 0 ? `${countdown} s` : t('获取验证码') }}</el-button>-->
            <!--                </template>-->
            <!--              </el-input>-->
            <!--            </el-form-item>-->
          </el-form>
          <!--          <div class="login_form_buttom" v-show="activeTab === 'password'">-->
          <!--              <el-checkbox v-model="remember" :label="t('记住密码') " size="large" />-->
          <!--           <span class="Forgot" @click="handle_forgot">   {{ t('忘记密码') }}</span>-->

          <!--          </div>-->
        </div>
        <div class="login_buttom">
          <el-button
              @keyup="checkEnterKey"
              @click="submit_login" class="button" type="primary">  {{ t('登录') }}</el-button>
          <div class="tips">
            {{ t('你还没有账号？点击') }}<span @click="register" class="tips_register">{{ t('注册') }}</span>
          </div>
        </div>

        <!-- 内容 -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import sha256 from 'sha256';
import {useRoute,useRouter} from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus';
import { useLocalesI18n } from '@/locales/i18n';
import {validateMobile, validatePassword} from "@/utils/packagingmethod/rules";
import { useUserStore } from '@/store';
import {actions_login} from "@/api/login";
import {message} from "@/utils/components/message";
import md5 from "js-md5";
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const { t } = useLocalesI18n({}, [(locale: string) => import(`./lang/${locale}.json`), 'login']);
const activeTab = ref('password');//默认密码登录
const login_ref = ref<FormInstance>(); //拿到当前ref实力
const countdown = ref<number>(0) //验证码倒计时
//点击切换选择登录的方式
const setActiveTab = (tabName: string) => {
  activeTab.value = tabName;
}
const remember = ref<boolean>(false)
interface RuleForm {
  signature:string,
  username:string,
  clientType:number,
  nonce:string,
  password:string,

}
const loginParams = ref<RuleForm>({
  username:'18111111111', //用户名
  password:'a123456789',
  signature:'',//密码
  nonce:'',
  clientType:1
})

const rules = computed<FormRules>(() => ({
  username: [
    {
      required: true,
      message: t('账号必须填写!'),
      trigger: 'blur',
    },
    { validator: validateMobile, trigger: 'blur' }
  ],
  password: [
    {
      required: true,
      message: t('密码必须填写!') ,
      trigger: 'blur',
    },
    { validator: validatePassword, trigger: 'blur' }
  ],
  code: [
    {
      required: true,
      message: t('验证码必须填写!') ,
      trigger: 'blur',
    },
    // { validator: validatePassword, trigger: 'blur' }
  ],
}));

const checkEnterKey =(event)=>{
  if (event.keyCode === 13) {
    submit_login();
  }
}
//忘记密码
const handle_forgot = async () => {
  await router.replace('/forget');

}
//登录
const generateRandomNumberString = (length:any) => {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
const submit_login = async () => {
  login_ref.value?.validate(async (valid:boolean, fields:any) => {
    if (valid) {
      let date = JSON.parse(JSON.stringify(loginParams.value))
      date.nonce = generateRandomNumberString(5)
      date.password = md5(date.password).toUpperCase()
      let sha256_date = sha256(`${ date.username}:${date.password}`)
      date.signature =sha256( `${sha256_date}:${ date.nonce}`) ;
      delete date.password
      const res =await actions_login(date)
      if (res.data.code ===200){
        const date = res.data.data
        await userStore.login(date);  //这里点击登录  username password ;captcha 三个参数
        await  message(t('登录成功'), {type: "success"})
        await router.replace((route.query.redirect as string) || '/');
      }else  {
        await  message(res.data.message, {type: "error"})
      }

    } else {
      console.log('提交错误', fields);
    }
  });
};
//获取验证码
const getCode = () => {
  let timer:any = null;
  countdown.value = 60;
  clearInterval(timer); // 清除之前的定时器
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value === 0) {
      clearInterval(timer);
    }
  }, 1000);
};
//点击注册
const register = async () => {
  await router.replace( '/register');

}
onMounted(async()=>{
  window.addEventListener('keyup',checkEnterKey);

})
onBeforeMount(()=>{
  window.addEventListener('keyup',checkEnterKey);

})

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
      //border: 1px solid #000000;
      /* 其他样式属性 */
      .content_top {
        height: 50px;
        text-align: center;
        font-size: 32px;
        color: #000;
        font-weight: 600;
        margin-bottom: 30px;
      }
      .text_container {
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
        font-size: 24px;
        color: #4a4a4a;
        font-weight: 400;
        padding-bottom: 6px;
        cursor: pointer;
        span {
          margin: 0 10px; /* 可以调整文字之间的间距 */
          cursor: pointer;
          transition: color 0.3s; /* 添加颜色过渡效果 */
          &.active {
            color: #000;
            position: relative;
            //border-bottom: 1px solid blue;
            &::after {
              content: "";
              position: absolute;
              bottom: -20%;
              left: 50%;
              transform: translateX(-50%);
              width: 30px; /* 调整边的长度 */
              height: 3px;
              background-color: blue;
              transition: width 0.3s; /* 添加宽度过渡效果 */
            }
          }
        }
      }
      .login_form {
        margin-left: 35px;
        .form_item {
          margin-bottom: 25px;
        }
        .login_form_buttom {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          width: 400px;
          .Forgot {
            margin-top: 10px;
            //font-weight: 700;
            color:rgb(34, 40, 224);
            cursor: pointer;

          }
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
