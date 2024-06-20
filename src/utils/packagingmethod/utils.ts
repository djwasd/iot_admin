// 生成唯一的uuid
export function generateUUID() {
    if (typeof crypto === "object") {
        if (typeof crypto.randomUUID === "function") {
            return crypto.randomUUID();
        }
        if (typeof crypto.getRandomValues === "function" && typeof Uint8Array === "function") {
            const callback = (c: any) => {
                const num = Number(c);
                return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(16);
            };
            return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, callback);
        }
    }
    let timestamp = new Date().getTime();
    let performanceNow = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        let random = Math.random() * 16;
        if (timestamp > 0) {
            random = (timestamp + random) % 16 | 0;
            timestamp = Math.floor(timestamp / 16);
        } else {
            random = (performanceNow + random) % 16 | 0;
            performanceNow = Math.floor(performanceNow / 16);
        }
        return (c === "x" ? random : (random & 0x3) | 0x8).toString(16);
    });
}


//选择数组中null  空字符串 空数组的项

export function filterObject(obj:any) {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) =>
            value !== "" && value !== null && !(Array.isArray(value) && value.length === 0)
        )
    );
}
//选择数组中null  空字符串
export function filter_data(obj:any) {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) =>
            value !== "" && value !== null)

    );
}

//下载压缩包
export function download_excel(data: any, filename: string) {
    const blob = new Blob([data], { type: 'application/vnd.ms-excel' }); // 创建 Blob 对象
    const url = URL.createObjectURL(blob); // 创建下载链接
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    // 清理资源
    URL.revokeObjectURL(url);
}
export function download_zip(data: any, filename: string) {
    const blob = new Blob([data], { type: 'application/zip' }); // 创建 Blob 对象
    const url = URL.createObjectURL(blob); // 创建下载链接
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    // 清理资源
    URL.revokeObjectURL(url);
}
//下载图片
export const downLoadQRcode = (id: string, title = '二维码'): void => {
    const canvas = document.getElementById(id) as HTMLCanvasElement
    const url = canvas.toDataURL('image/png') // 通过 toDataURL 返回一个包含图片展示的 data URI
    const aDom = document.createElement('a')
    aDom.download = title // 设置下载的文件名
    aDom.href = url
    document.body.appendChild(aDom)
    aDom.click()
    aDom.remove()
}
