import  request from '@/api/request'

//账户密码登录接口
export function actions_login(data:any) {
    return request({
        url:'/operation/cloud/oauth/api/oauth/actions/login',
        method:'post',
        data
    })
}
//注册账号
export function user_register (data:any) {
    return request({
        url:'/operation/cloud/web/sys/api/user/register',
        method:'post',
        data
    })
}

//退出登录
export function logout () {
    return request({
        url:'/operation/cloud/oauth/api/oauth/actions/logout',
        method:'get',
    })
}
