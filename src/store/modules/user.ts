import {event, mitter} from '@/event';
import cookies from 'js-cookie';
import {loginConfig as config} from '@/config';
import {loading} from '@/utils/loading';
import {PageEnum} from '@/dict/pageEnum';
import useRouteStore from './route';
import {router} from '@/router';
import {logout} from "@/api/login";
import {message} from "@/utils/components/message";

// 获取用户详细信息
interface UserInfoResult {
  rules: string[]; // 权限
  username: string; // 用户名
  prefix: string,
  nickname: null,
  phone: string,
  type: number,
  plotParentPath:string,
  plotId:number
  plotName:string
  plotParentId:any
  userId:string
  plotParentName:string
  token:string
}
interface UserState {
  user: UserInfoResult ; // 用户信息
  rules: string[] | undefined; // 用户权限信息
  token: Ref<string>; // 用户token
}
export default defineStore({
  id: 'user',
  state: (): UserState => {
    let _token = '';
    return {
      user: {} as UserInfoResult ,
      rules: undefined,

      token: customRef<string>((track, trigger) => {
        return {
          get() {
            // track 方法放在 get 中，用于提示这个数据是需要追踪变化的
            track();
            return _token;
          },
          set(token: string) {
            _token = token;
            if (token) {
              cookies.set(config.tokenName, token, {
                expires: config.tokenExpires,  //这里设置cookie的过期时间默认为7天
                domain: config.tokenDomain,
              });
            } else {
              cookies.remove(config.tokenName, {
                domain: config.tokenDomain,
              });
            }
            trigger(); // 记得触发事件 trigger,告诉vue触发页面更新
          },
        };
      }),
    };
  },
  actions: {
    // 初始化
    init: async function (tokenValue?: string,params?:string | null) {   //项目初始化
      const token = tokenValue ?? cookies.get(config.tokenName);
      const rules =  JSON.parse(localStorage.getItem('rules') as string)
      const user =params??JSON.parse(localStorage.getItem('user') as string)
      if (token) {
        this.token = token;
        this.user = user
        this.rules = rules;
        await useRouteStore().initRoutes(); //初始化路由
      } else {
        this.token = '';
      }
    },
    init_dashboard: async function (params?:string | null) {   //项目初始化
      const rules = JSON.parse(localStorage.getItem('rules') as string);
      this.user = params ?? JSON.parse(localStorage.getItem('user') as string)
      this.rules = rules;
    },
    // 登录
    login: async function (params:any) {   //这里是登录节流
      mitter.emit(event.BEFORE_LOGIN);
      console.log(params,'---params')
      localStorage.setItem('rules',JSON.stringify(['*']))
      localStorage.setItem('user',JSON.stringify(params))

      await this.init(params.token,params);
      mitter.emit(event.AFTER_LOGIN);
    },
    // 退出
    logOut: async function () {
      loading();
      const res = await logout()
      if (res.data.code ===200){
        await Promise.allSettled(mitter.emit(event.BEFORE_LOGOUT));
        await router.replace({
          path: PageEnum.LOGIN,
        });
        this.token = ''; //token变成空的然后退回到登录界面
        cookies.remove(config.tokenName, {
          domain: config.tokenDomain,
        });
        // localStorage.clear()
        localStorage.removeItem('user')
        localStorage.removeItem('rules')
        localStorage.removeItem('me-config-locale')
        localStorage.removeItem('me-config-theme')
        localStorage.removeItem('me-config-version')
        localStorage.removeItem('me-color-dark-scheme')
        localStorage.removeItem('user_copy')

        window.location.reload();
      }else  {
        message(res.data.message, {type: "error"})
      }

    },
  },
});
