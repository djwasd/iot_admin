import request from "@/api/request";

//查询下级所有项目组织列表
export function actions_list(plotId:string) {
    const url = `/operation/cloud/web/sys/api/organization/actions/tree/list?plotId=${plotId}`;
    return request({
        url: url,
        method: 'GET'
    });
}

//新增部门组织
export function department_add (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/organization',
        method:'post',
        data
    })
}
//编辑部门组织
export function department_edit (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/organization',
        method:'put',
        data
    })
}
//删除部门组织
export function department_del (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/organization',
        method:'DELETE',
        data
    })
}
//分页查询人员列表
export function personnel_list(organizationId: number, page: number, size: number, status: number, organizationPath: string, name: string ) {

    let url = `/operation/cloud/web/sys/api/person/actions/page?organizationId=${organizationId}&page=${page}&size=${size}&status=${status}&organizationPath=${organizationPath}`;

    if (name !== undefined) {
        url += `&name=${name}`;
    }

    return request({
        url: url,
        method: 'GET',
    });
}
//新增人员列表

export function personnel_add (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/actions/add',
        method:'post',
        data
    })
}
//删除人员列表

export function personnel_del (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person',
        method:'DELETE',
        data
    })
}
//删除人员列表

export function personnel_edit (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person',
        method:'PUT',
        data
    })
}

//移至黑名单
export function blacklist (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/action/blacklist',
        method:'POST',
        data
    })
}

export function export_template () {
    return request({
        url:'/operation/cloud/web/sys/api/person/action/export/template',
        method:'get',
        responseType: "blob",
    })
}
export function person_export(organizationId:any,status:number) {
   const url = `/operation/cloud/web/sys/api/person/action/export?organizationId=${organizationId}&status=${status}`
    return request({
        url:url,
        method:'get',
        responseType: "blob",

    })
}
// 批量导入人员
export function action_import (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/action/import',
        method:'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data', // 添加请求头
        }
    })
}
