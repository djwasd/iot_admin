
import request from "@/api/request";



//查询下级所有项目组织列表

export function seach_list(parentId:number,parentPath:string) {
    const url = `/operation/cloud/web/sys/api/plot/actions/tree/list?parentId=${parentId}&parentPath=${parentPath}`;
    return request({
        url: url,
        method: 'GET'
    });
}
//解绑
export function plot_move (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/plot/move/actions/move',
        method:'POST',
        data
    })
}
//修改密码
export function update_pwd (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/user/update/password',
        method:'PUT',
        data
    })
}
// 分页查询用户列表
export function user_list(plotId:number,page:number,size:number) {

    let url = `/operation/cloud/web/sys/api/user/actions/page?plotId=${plotId}&page=${page}&size=${size}`;

    return request({
        url: url,
        method: 'GET'
    });
}
//审批项目移动请求
export function audit (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/plot/move/actions/audit',
        method:'post',
        data
    })
}

//上级重置下级密码
export function reset (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/user/reset/password',
        method:'put',
        data
    })
}
//启用或者禁用
export function user_enable (id:string,data: any,) {
    let url = `/operation/cloud/web/sys/api/user/enable?id=${id}`;

    return request({
        url:url,
        method:'post',
        data
    })
}
