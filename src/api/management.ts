//分页查询项目设备列表
import request from "@/api/request";

export function device_List (plotId:number, page:number, size:number,status:number,serialNo?:string) {
    let url = `/operation/cloud/web/sys/api/plot/device/actions/page?plotId=${plotId}&page=${page}&size=${size}&status=${status}`;
    if (serialNo !== undefined ) {
        url += `&serialNo=${serialNo}`;
    }
    return request({
        url:url,
        method:'GET',
    })
}
//分页查询项目设备列表 是否排除已加入人员组的设备

export function device_GroupDevice (
    plotId:number,
    page:number,
    size:number,
    deviceType:string,
    isExcludeAddedDeviceGroupDevice:boolean,
    deviceGroupId:number,
    serialNo?:string

) {
    let url = `/operation/cloud/web/sys/api/plot/device/actions/page?plotId=${plotId}&page=${page}&size=${size}&deviceType=${deviceType}&isExcludeAddedDeviceGroupDevice=${isExcludeAddedDeviceGroupDevice}&deviceGroupId=${deviceGroupId}`;
    if (serialNo !== undefined ) {
        url += `&serialNo=${serialNo}`;
    }
    return request({
        url:url,
        method:'GET',
    })
}
//添加设备
export function device_add (data:any) {

    return request({
        url:'/operation/cloud/web/sys/api/plot/device',
        method:'POST',
        data
    })
}
//添加设备
export function device_edit (data:any) {

    return request({
        url:'/operation/cloud/web/sys/api/plot/device',
        method:'PUT',
        data
    })
}
//删除设备
export function device_del (data:any) {

    return request({
        url:'/operation/cloud/web/sys/api/plot/device',
        method:'DELETE',
        data
    })
}
//人员组新增设备
export function add_device (data:any) {

    return request({
        url:'/operation/cloud/web/sys/api/person/group/action/add/device',
        method:'POST',
        data
    })
}
//分页查询项目设备列表 是否排除已加入人员组的设备

export function device_list ( page:number, size:number,personGroupId:string,serialNo?:string) {
    console.log(serialNo,'--serialNo')
    let url = `/operation/cloud/web/sys/api/plot/device/actions/page?page=${page}&size=${size}&personGroupId=${personGroupId}`;
    if (serialNo !== undefined ) {
        url += `&serialNo=${serialNo}`;
    }
    return request({
        url:url,
        method:'GET',
    })
}
