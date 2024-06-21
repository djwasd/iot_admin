import {GlobalCommon} from "@/store/interface";


export default defineStore({
    id: 'common',
    state: ():GlobalCommon =>({
        localStorage_data:[
            {
                content:{},
                event:''
            }
        ]
    }),
    actions: {
        init_loc: async function () {   //项目初始化
            const user =JSON.parse(localStorage.getItem('user') as string)
            const message_data = ref(`${user.userId}-message`)
            this.localStorage_data = JSON.parse(localStorage.getItem(message_data.value) as string)
            console.log( this.localStorage_data,'-- this.localStorage_data')
        },
    },
});
