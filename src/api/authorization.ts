import request from "@/api/request";

export function personnel_group(plotId: number, page: any, size: any, name?: string ) {

    let url = `/operation/cloud/web/sys/api/person/group/actions/page?plotId=${plotId}&page=${page}&size=${size}`;

    if (name !== undefined) {
        url += `&name=${name}`;
    }

    return request({
        url: url,
        method: 'GET',
    });
}
//添加授权组
export function add_group (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/group',
        method:'post',
        data
    })
}
//编辑授权组
export function edit_group (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/group',
        method:'put',
        data
    })
}
//删除授权组
export function del_group (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/group',
        method:'delete',
        data
    })
}
//分页查询人员组通行规则列表
export function traffic_rules (plotId:number) {
    let url = `/operation/cloud/web/sys/api/person/group/rule/actions/page?plotId=${plotId}`;

    return request({
        url:url,
        method:'GET',

    })
}
//新增人员组（授权组）通行规则
export function group_rule (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/group/rule',
        method:'post',
        data
    })
}
//编辑人员组（授权组）通行规则
export function eidt_rule (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/group/rule',
        method:'put',
        data
    })
}
//删除人员组（授权组）通行规则
export function del_rule (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/group/rule',
        method:'DELETE',
        data
    })
}

//分页查询人员列表    弹框查询是否排除已加入人员组的人员
export function personnel_groupList(organizationId: number, page: number, size: number, status: number, organizationPath: string,isExcludeAddedGroupPerson:boolean, name: string ) {

    let url = `/operation/cloud/web/sys/api/person/actions/page?organizationId=${organizationId}&page=${page}&size=${size}&status=${status}&organizationPath=${organizationPath}&isExcludeAddedGroupPerson=${isExcludeAddedGroupPerson}`;

    if (name !== undefined) {
        url += `&name=${name}`;
    }

    return request({
        url: url,
        method: 'GET',
    });
}
// 人员组新增人员
export function add_person (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/group/action/add/person',
        method:'post',
        data
    })
}
//分页查询人员列表   人员组Id得
export function personnel_personGroup(page: number, size: number,personGroupId:string, name: string ) {

    let url = `/operation/cloud/web/sys/api/person/actions/page?page=${page}&size=${size}&personGroupId=${personGroupId}`;

    if (name !== undefined) {
        url += `&name=${name}`;
    }

    return request({
        url: url,
        method: 'GET',
    });
}
//删除人员组

export function handle_del_group (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/group/action/del/person',
        method:'POST',
        data
    })
}
//删除设备人员组

export function handle_del_device (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/group/action/del/device',
        method:'post',
        data
    })
}
//人员组新增通行规则
export function handle_add_rule (data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/group/action/rule',
        method:'post',
        data
    })
}

//分页查询人员通行记录


export function traffic_list(plotId:number,organizationId:string,page: number, size: number,startTimestamp?:number,endTimestamp?:number, name?: string ) {

    let url = `/operation/cloud/web/sys/api/person/record/actions/page?plotId=${plotId}&organizationId=${organizationId}&page=${page}&size=${size}`;
    if (startTimestamp !== undefined ) {
        url += `&startTimestamp=${startTimestamp}`;
    } if (endTimestamp !== undefined) {
        url += `&endTimestamp=${endTimestamp}`;
    }
    if (name !== undefined && name!=='') {
        url += `&name=${name}`;
    }

    return request({
        url: url,
        method: 'GET',
    });
}
