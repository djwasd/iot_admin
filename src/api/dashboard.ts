import request from "@/api/request";

//获取子地区编码
export function region_codes (parentCode: number,) {
    return request({
        url:`/operation/cloud/web/sys/api/sys?parentCode=${parentCode}`,
        method:'get',
    })
}


// 查询组织详情
export function organizational (data:any) {
    return request({
        url:'/operation/cloud/web/sys/api/plot/actions/get',
        method:'post',
        data
    })
}
//更新组织
export function edit_plot (data:any) {
    return request({
        url:'/operation/cloud/web/sys/api/plot/edit',
        method:'put',
        data
    })
}
// 查询下级所有项目组织列表
export function tree_list (parentPath: string,parentId: any,name?:string) {
    let url = `/operation/cloud/web/sys/api/plot/actions/tree/list?parentPath=${parentPath}&parentId=${parentId}`
    if (name !== undefined &&  name!=='') {
        url += `&name=${name}`;
    }
    return request({
        url:url,
        method:'get',
    })
}

//获取首页基础信息
export function information (plotId:number) {
    return request({
        url:`/operation/cloud/web/sys/api/stat/actions/home/sys?plotId=${plotId}`,
        method:'get',
    })
}
//首页访客统计
export function visitor_statistics (plotId:number) {
    return request({
        url:`/operation/cloud/web/sys/api/stat/actions/home/visit?plotId=${plotId}`,
        method:'get',
    })
}
