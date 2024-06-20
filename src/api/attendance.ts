//分页查询项目设备列表 是否排除已加入人员组的设备

import request from "@/api/request";

export function holiday_plan (plotId:number, name?:string) {
    let url = `/operation/cloud/web/sys/api/holiday/plan/actions/page?plotId=${plotId}`;
    if (name !== undefined ) {
        url += `&name=${name}`;
    }
    return request({
        url:url,
        method:'GET',
    })
}
//新增节假日计划
export function add_plan (data:any) {

    return request({
        url:'/operation/cloud/web/sys/api/holiday/plan',
        method:'POST',
        data
    })
}
//编辑节假日计划
export function edit_plan (data:any) {

    return request({
        url:'/operation/cloud/web/sys/api/holiday/plan',
        method:'PUT',
        data
    })
}
//删除节假日计划
export function del_plan (data:any) {

    return request({
        url:'/operation/cloud/web/sys/api/holiday/plan',
        method:'DELETE',
        data
    })
}
//根据节假日计划分页查询节假日列表
export function holiday_list (holidayPlanId:string, page:number,size:number,year:string,name:string) {
    let url = `/operation/cloud/web/sys/api/holiday/actions/page?holidayPlanId=${holidayPlanId}&page=${page}&size=${size}&year=${year}`;
    if (name !== undefined ) {
        url += `&name=${name}`;
    }
    return request({
        url:url,
        method:'GET',
    })
}
//新增节日

export function add_holiday (data:any) {

    return request({
        url:'/operation/cloud/web/sys/api/holiday',
        method:'post',
        data
    })
}
//编辑节日

export function eidt_holiday (data:any) {

    return request({
        url:'/operation/cloud/web/sys/api/holiday',
        method:'put',
        data
    })
}
//删除节日

export function del_holiday (data:any) {

    return request({
        url:'/operation/cloud/web/sys/api/holiday',
        method:'DELETE',
        data
    })
}
//分页查询考勤规则列表
export function rules_page (plotId:number, page:number,size:number,name:string) {
    let url = `/operation/cloud/web/sys/api/attendance/rule/actions/page?plotId=${plotId}&page=${page}&size=${size}`;
    if (name !== undefined ) {
        url += `&name=${name}`;
    }
    return request({
        url:url,
        method:'GET',
    })
}

//新增考勤规则

export function attendance_add (data:any) {

    return request({
        url:'/operation/cloud/web/sys/api/attendance/rule',
        method:'post',
        data
    })
}
//删除考勤规则

export function attendance_del (data:any) {

    return request({
        url:'/operation/cloud/web/sys/api/attendance/rule',
        method:'delete',
        data
    })
}
//编辑考勤规则

export function attendance_put (data:any) {

    return request({
        url:'/operation/cloud/web/sys/api/attendance/rule',
        method:'put',
        data
    })
}
//分页查询人员列表    弹框查询是否排除已加入人员组的人员
export function personnel_group(
    organizationId: number,
    page: number,
    size: number,
    status: number,
    organizationPath: string,
    isExcludeAddedAttendanceRulePerson: boolean,
    attendanceRuleId?: string,
    name?: string
) {
    let url = `/operation/cloud/web/sys/api/person/actions/page?organizationId=${organizationId}&page=${page}&size=${size}&status=${status}&organizationPath=${organizationPath}&isExcludeAddedAttendanceRulePerson=${isExcludeAddedAttendanceRulePerson}`;

    if (attendanceRuleId !== undefined && attendanceRuleId !== '') {
        url += `&attendanceRuleId=${encodeURIComponent(attendanceRuleId)}`;
    }

    if (name !== undefined && name !== '') {
        url += `&name=${encodeURIComponent(name)}`;
    }

    return request({
        url,
        method: 'GET',
    });
}
//查询项目设备 是否排除已加入考勤规则的设备

export function attendance_GroupDevice (
    plotId:number,
    page:number,
    size:number,
    deviceType:string,
    isExcludeAddedAttendanceRuleDevice:boolean,
    attendanceRuleId?: string,
    serialNo?:string
) {
    console.log(serialNo,'--serialNo')

    let url = `/operation/cloud/web/sys/api/plot/device/actions/page?plotId=${plotId}&page=${page}&size=${size}&deviceType=${deviceType}&isExcludeAddedAttendanceRuleDevice=${isExcludeAddedAttendanceRuleDevice}`;
    if (attendanceRuleId !== undefined && attendanceRuleId !== '') {
        url += `&attendanceRuleId=${attendanceRuleId}`;
    }
    if (serialNo !== undefined && serialNo !== '') {
        url += `&serialNo=${serialNo}`;
    }
    return request({
        url:url,
        method:'GET',
    })
}
//添加考勤班次

export function attendance_shift (data:any) {

    return request({
        url:'/operation/cloud/web/sys/api/attendance/rule/class/action/add',
        method:'post',
        data
    })
}
//分页查询考勤班次列表
export function attendance_list (plotId:number, page?:any,size?:any) {
    let url = `/operation/cloud/web/sys/api/attendance/rule/class/actions/page?plotId=${plotId}`;
    if (page !== undefined && page!== '' ) {
        url += `&page=${page}`;
    }
    if (size !== undefined && size!== '' ) {
        url += `&size=${size}`;
    }
    return request({
        url:url,
        method:'GET',
    })
}
//删除考勤班次

export function shift_del (data:any) {
    return request({
        url:'/operation/cloud/web/sys/api/attendance/rule/class/action/del',
        method:'DELETE',
        data
    })
}
//添加设备固件
export function attachment_add (data:any) {
    return request({
        url:'/operation/cloud/web/sys/api/device/firmware',
        method:'post',
        data
    })
}
//获取设备固件列表信息
export function firmware_list (plotId:number, page:any,size:any,model?:string) {
    let url = `/operation/cloud/web/sys/api/device/firmware/actions/page?plotId=${plotId}&page=${page}&size=${size}`;
    if (model !== undefined && model!== '' ) {
        url += `&model=${model}`;
    }

    return request({
        url:url,
        method:'GET',
    })
}

//添加设备固件
export function swich_init (data:any) {
    return request({
        url:'/operation/cloud/web/sys/api/device/firmware',
        method:'put',
        data
    })
}
//删除设备固件
export function  attachment_edit (data:any) {
    return request({
        url:'/operation/cloud/web/sys/api/device/firmware',
        method:'DELETE',
        data
    })
}
