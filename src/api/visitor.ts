

import request from "@/api/request";
//新增访客码
export function  visit_code_add(data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/visit/code',
        method:'post',
        data
    })
}
//查看所有通行码
export function code_data (plotId:number,page:number,size:number) {
    let url = `/operation/cloud/web/sys/api/person/visit/code/actions/page?plotId=${plotId}&page=${page}&size=${size}`;
    return request({
        url:url,
        method:'GET',
    })
}
//删除访客码
export function  visit_code_del(data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/visit/code',
        method:'DELETE',
        data
    })
}
// 分页查询访客记录列表
export function visitor_record(
    plotId: number,
    page: number,
    size: number,
    visitName?: string,
    interviewee?: string,
    phone?: string,
    visitorPlateNumber?: string,
    startTimestamp?: number,
    endTimestamp?: number
) {
    let url = `/operation/cloud/web/sys/api/person/visit/record/actions/page?plotId=${plotId}&page=${page}&size=${size}`;

    const queryParams: { [key: string]: string | undefined } = {
        visitName,
        interviewee,
        phone,
        visitorPlateNumber,
        startTimestamp: startTimestamp?.toString(),
        endTimestamp: endTimestamp?.toString(),
    };

    const queryString = Object.entries(queryParams)
        .filter(([_, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
        .join("&");

    url += `&${queryString}`;

    return request({
        url,
        method: 'GET',
    });
}


export function visit_list(
    plotId: number,
    page: number,
    size: number,
    source?:number,
    visitName?: string,
    intervieweeName?: string,
    attendanceStartTimestamp?: number,
    attendanceEndTimestamp?: number
) {
    let url = `/operation/cloud/web/sys/api/person/visit/actions/page?plotId=${plotId}&page=${page}&size=${size}`;

    const queryParams: { [key: string]: string | number | undefined } = {
        source,
        visitName,
        intervieweeName,
        attendanceStartTimestamp,
        attendanceEndTimestamp,
    };

    const filteredParams = Object.entries(queryParams)
        .filter(([_, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
        .join("&");

    if (filteredParams) {
        url += `&${filteredParams}`;
    }

    return request({
        url,
        method: 'GET',
    });
}
//删除人员访客
export function  action_del(data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/visit/action/del',
        method:'DELETE',
        data
    })
}


export function  action_add(data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/visit/action/add',
        method:'post',
        data
    })
}

//分页查询项目设备列表 是否排除已加入人员组的设备

export function visitor_GroupDevice (
    plotId:number,
    page:number,
    size:number,
    deviceType:string,

    serialNo?:string

) {
    let url = `/operation/cloud/web/sys/api/plot/device/actions/page?plotId=${plotId}&page=${page}&size=${size}&deviceType=${deviceType}`;
    if (serialNo !== undefined && serialNo!=='') {
        url += `&serialNo=${serialNo}`;
    }
    return request({
        url:url,
        method:'GET',
    })
}
//审批
export function  action_audit(data: any,) {
    return request({
        url:'/operation/cloud/web/sys/api/person/visit/action/audit',
        method:'post',
        data
    })
}
//
export function visitor_statistics (plotId:number) {
    return request({
        url:`/operation/cloud/web/sys/api/stat/action/visit/base?plotId=${plotId}`,
        method:'get',
    })
}
//统计图年月日等

export function visitor_pic (plotId:number,statType:number,year?:number,month?:number,day?:number) {
    let url=`/operation/cloud/web/sys/api/stat/action/visit/graph?plotId=${plotId}&statType=${statType}`
    if (year !== undefined ) {
        url += `&year=${year}`;
    }
    if (month !== undefined ) {
        url += `&month=${month}`;
    } if (day !== undefined ) {
        url += `&day=${day}`;
    }
    return request({
        url:url,
        method:'get',
    })
}
