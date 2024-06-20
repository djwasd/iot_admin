export function regular(str:any,type:string,max?:any,min?:any){
    console.log(str,'-11 ')
    let value:any=str+"";
    if(type==="Int"){
        if(value===''){
            value=0;
        }else{
            value=value.replace(/[^\d]/g,'');  //只能输入数字
            value=parseInt(value);
        }
    }
    else if(type==="integer"){
        value=value.replace(/\D/g,'') ;  //只能输入正则输
    }

    if(max!==undefined){
        if(type==="char"){
            value=value.replace(/[^A-Za-z0-9\u4e00-\u9fa5!@#$^&*()=|{}':;：；,.<>/?！@￥%…（）【】‘’“”，、]/g,'');  //只能输入数字字母汉字
            let sum=0;
            for(let i=0;i<value.length;i++) {
                if ((value.charCodeAt(i)>=0) && (value.charCodeAt(i)<=255)) {
                    sum=sum+2;
                }else {
                    sum=sum+3;
                }
                if(sum>max){
                    value=value.substr(0,i);
                    break;
                }
            }
        }else if(type==="number"||type==="Int"){
            value=parseInt(value);
            if(value>max){
                value=max;
            }
        }else{
            if(value.length>max){
                value=value.substr(0,max);
            }
        }
    }
    if(min!==undefined){
        if(type==="number"||type==="Int"){
            value=parseInt(value);
            if(value<min){
                value=min;
            }
        }
    }
    return value;
}
