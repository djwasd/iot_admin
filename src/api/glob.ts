
import request from "@/api/request";


//上传附件

export function upload_attachments (data: any,type:number) {
    const url = `/operation/cloud/web/sys/api/v1/attachment/actions/upload?type=${type}`;

    return request({
        url:url,
        method:'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data', // 添加请求头
        },
        timeout: 50000, // 设置超时时间，单位为毫秒
    })
}
//获取附件的
export function upload_person(file_id: any) {
    const url = `/operation/cloud/web/sys/api/v1/attachment/actions/download?file_id=${file_id}`;
    return request({
        url:url,
        method:'GET',

    })
}

//获取附件的
export function records_photo(uuid: string) {
    console.log(uuid,'---uuid')
    const url = `/operation/cloud/web/sys/api/v1/attachment/actions/download/wcs?uuid=${uuid}`;
    return request({
        url:url,
        method:'GET',

    })
}
