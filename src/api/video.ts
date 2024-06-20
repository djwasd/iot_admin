//分页查询项目设备列表 是否排除已加入人员组的设备

import request from "@/api/request";

export function group_list (plotId:number,page:number,size:number, name?:string) {
    let url = `/operation/cloud/web/sys/api/device/group/actions/page?plotId=${plotId}&page=${page}&size=${size}`;
    if (name !== undefined ) {
        url += `&name=${name}`;
    }
    return request({
        url:url,
        method:'GET',
    })
}
//创建分组
export function add_device (data: any) {
    return request({
        url:'/operation/cloud/web/sys/api/device/group',
        method:'POST',
        data
    })
}
//编辑分组
export function put_device (data: any) {
    return request({
        url:'/operation/cloud/web/sys/api/device/group',
        method:'put',
        data
    })
}
//删除分组
export function del_device (data: any) {
    return request({
        url:'/operation/cloud/web/sys/api/device/group',
        method:'DELETE',
        data
    })
}

//分页查询项目设备列表 是否排除已加入人员组的设备

export function device_GroupDevice (
    plotId:number,
    deviceType:string,
    isExcludeAddedDeviceGroupDevice:boolean,
    serialNo?:string

) {
    console.log(serialNo,'--serialNo')
    let url = `/operation/cloud/web/sys/api/plot/device/actions/page?plotId=${plotId}&deviceType=${deviceType}&isExcludeAddedDeviceGroupDevice=${isExcludeAddedDeviceGroupDevice}`;
    if (serialNo !== undefined ) {
        url += `&serialNo=${serialNo}`;
    }
    return request({
        url:url,
        method:'GET',
    })
}
//设备组新增设备
export function batch_relevance (data: any) {
    return request({
        url:'/operation/cloud/web/sys/api/device/group/device/action/batch/relevance',
        method:'post',
        data
    })
}
//查询设备组下的设备集合
export function device_list (deviceGroupId:number) {
    let url = `/operation/cloud/web/sys/api/device/group/device/actions/group/device/list?deviceGroupId=${deviceGroupId}`;

    return request({
        url:url,
        method:'GET',
    })
}
//获取设备组下全部设备的流地址
//查询设备组下的设备集合
export function video_list (deviceGroupId:number) {
    let url = `/operation/cloud/web/sys/api/device/group/device/actions/get/group/video?deviceGroupId=${deviceGroupId}`;

    return request({
        url:url,
        method:'GET',
    })
}
//批量设备获取视频流地址集合

//透传获取当前视频流
// operation/cloud/wcs/client/api/v1/wcs/passthroughs
//设备组新增设备
export function video_address (data: any) {
    return request({
        url:'/operation/cloud/wcs/client/api/v1/wcs/passthroughs',
        method:'post',
        data
    })
}
