<template>
  <el-dropdown class="message-box" max-height="500px" trigger="click">
    <div class="flex-center pointer">
      <el-badge :is-dot="isDot">
        <mel-icon-bell class="message-icon"></mel-icon-bell>
      </el-badge>
    </div>
    <template #dropdown>
      <div class="message-tabs">
        <div v-for="(item,index) in list "
             :key="index"

        >

          <div v-if="item.content.eventType ===4" class="unbind">
            <div class="unbind_content">
              <div class="unbind_left">
                <img src="@/assets/images/png/unbind.png">
              </div>
              <div class="unbind_right">
                <div class="unbind_top">
                  <div>{{item.content.eventName}}</div>
                  <span :style="applyStatusStyle(item.content.eventStatus)">{{item.content.eventStatus ===2?t('申请中'):item.content.eventStatus ===3?t('已同意'):t('已拒绝')}}</span>

                </div>
                <div class="unbind_text">
                  <div>申请对象:</div>
                  <span>{{item.content.targetName }}</span>
                </div>
                <div class="unbind_text">
                  <div>申请时间:</div>
                  <span>{{item.content.applyTime }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="item.content.eventType ===5" class="unbind">
            <div class="unbind_content">
              <div class="unbind_left">
                <img src="@/assets/images/png/unbind.png">
              </div>
              <div class="unbind_right">
                <div class="unbind_text">
                  <div>子账号:</div>
                  <span>{{item.content.name }}</span>
                  <span class="unbind_span"  :style="applyStatusStyle(item.content.eventStatus)">{{item.content.eventStatus ===2?t('申请中'):item.content.eventStatus ===3?t('已同意'):t('已拒绝')}}</span>

                </div>
                <div class="unbind_text">
                  <div >{{item.content.targetName }}</div>
                  <span>申请与主账号解绑</span>
                </div>
                <div class="unbind_text">
                  <div>申请时间:</div>
                  <span>{{item.content.applyTime }}</span>
                </div>
                <div class="unbind_btn">
                 <el-button class="btn" @click="handle_save('refuse',item.content)">{{t('拒绝')}}</el-button>
                  <el-button class="btn" type="primary" @click="handle_save('agree',item.content)">{{t('同意')}}</el-button>

                </div>
              </div>
            </div>
          </div>
          <div  v-if="item.content.eventType ===7" class="unbind">
            <div class="unbind_content">
              <div class="unbind_left">
                <img src="@/assets/images/png/Binding.png">
              </div>
              <div class="unbind_right">
                <div class="unbind_top">
                  <div>{{item.content.eventName}}</div>
                  <span :style="applyStatusStyle(item.content.eventStatus)">{{item.content.eventStatus ===2?t('申请中'):item.content.eventStatus ===3?t('已同意'):t('已拒绝')}}</span>
                </div>
                <div class="unbind_text">
                  <div>申请对象:</div>
                  <span>{{item.content.targetName }}</span>
                </div>
                <div class="unbind_text">
                  <div>申请时间:</div>
                  <span>{{item.content.applyTime }}</span>
                </div>
              </div>
            </div>
          </div>
          <div  v-if="item.content.eventType ===8" class="unbind">
            <div class="unbind_content">
              <div class="unbind_left">
                <img src="@/assets/images/png/Binding.png">
              </div>
              <div class="unbind_right">
                <div class="unbind_top">
                  <div>{{item.content.eventName}}</div>
                  <span :style="applyStatusStyle(item.content.eventStatus)">{{item.content.eventStatus ===2?t('申请中'):item.content.eventStatus ===3?t('已同意'):t('已拒绝')}}</span>
                </div>
                <div class="unbind_text">
                  <div >「{{item.content.targetName }}」</div>
                  <span>申请与主账号解绑</span>
                </div>
                <div class="unbind_text">
                  <div>申请时间:</div>
                  <span>{{item.content.applyTime }}</span>
                </div>
                <div class="unbind_btn">
                  <el-button class="btn" @click="handle_save('refuse',item.content)">{{t('拒绝')}}</el-button>
                  <el-button class="btn" type="primary" @click="handle_save('agree',item.content)">{{t('同意')}}</el-button>

                </div>
              </div>
            </div>
          </div>
          <div  v-if="item.content.eventType ===2 "  class="unbind">
            <div class="unbind_content">
              <div class="unbind_left">
                <img src="@/assets/images/png/interview.png">
              </div>
              <div class="unbind_right">
                <div class="unbind_top">
                  <div>姓名:{{item.content.name}}</div>
                  <span :style="applyStatusStyle(item.content.eventStatus)">{{item.content.eventStatus ===2?t('申请中'):item.content.eventStatus ===3?t('已同意'):t('已拒绝')}}</span>
                </div>
                <div class="unbind_text">
                  <div >拜访对象:</div>
                  <span>{{item.content.targetName}}</span>
                </div>
                <div class="unbind_text">
                  <div >来访事由:</div>
                  <span>{{item.content.eventName}}</span>
                </div>
                <div class="unbind_text">
                  <div >申请时间:</div>
                  <span>{{item.content.applyTime}}</span>
                </div>
                <div class="unbind_btn">
                  <el-button class="btn" @click="handle_refuse(item.content)">{{t('拒绝')}}</el-button>
                  <router-link  to="/visitor/approval" class="photo_item.content">
                    <el-button class="btn" type="primary" >{{t('查看')}}</el-button>
                  </router-link>


                </div>
              </div>
            </div>
          </div>
          <div  v-if="item.content.eventType ===3 "  class="unbind">
            <div class="unbind_content">
              <div class="unbind_left">
                <img src="@/assets/images/png/interview.png">
              </div>
              <div class="unbind_right">
                <div class="unbind_top">
                  <div>姓名:{{item.content.name}}</div>
                  <span :style="applyStatusStyle(item.content.eventStatus)">{{item.content.eventStatus ===2?t('申请中'):item.content.eventStatus ===3?t('已同意'):t('已拒绝')}}</span>
                </div>
                <div class="unbind_text">
                  <div >拜访对象:</div>
                  <span>{{item.content.targetName}}</span>
                </div>
                <div class="unbind_text">
                  <div >来访事由:</div>
                  <span>{{item.content.eventName}}</span>
                </div>
                <div class="unbind_text">
                  <div >申请时间:</div>
                  <span>{{item.content.applyTime}}</span>
                </div>
              </div>
            </div>
          </div>
        </div> <!-- 显示当前 WebSocket 的值 -->
      </div>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts" name="MessageBox">

import {useUserStore,useCommonStore} from "@/store";
import {useLocalesI18n} from "@/locales/hooks";
import {audit} from "@/api/system";
import {message} from "@/utils/components/message";
import {action_audit} from "@/api/visitor";
const { t } = useLocalesI18n({}, [(locale: string) => import(`../../../../../../lang/${locale}.json`), 'system']);

const isDot = ref(true);
const ipAddress = window.location.host;
const UserStore = useUserStore()
const UseComom = useCommonStore()
const token = UserStore.user.token
const userId =UserStore.user.userId

const socket =ref()
const socket_data = ref({
  content:{}
})
const all_data = ref<any>([])
const list =ref<any>([
  {
    content:{
    applyTime:'',
    eventName:'',
    applyTimestamp:0,
    auditTime:null,
    targetName:''
    },
    event:''
  }
])
const message_data = ref(`${userId}-message`)

const  applyStatusStyle = (applyStatus:any) => {
  const statusColors = {
    1: 'orange',
    2: 'green',
    default: 'red'
  };

  const color = statusColors.hasOwnProperty(applyStatus) ? statusColors[applyStatus] : statusColors.default;

  return { color };
}
const connectWebSocket = ()=>{
  const a:any = JSON.parse(localStorage.getItem(message_data.value) as string);
  if (a !== null && userId == a[0].content.userId) {
    // list.value =filterDuplicates(a) ;
    list.value =filterByEventId(a) ;
  } else {
    console.log(222222)
    localStorage.removeItem(message_data.value);
  }
const env =   import.meta.env.VITE_USER_NODE_ENV
  if (env ==='production'){
    const socket = `ws://${ipAddress}/ws?token=${token}`
  }else {
    socket.value = new WebSocket(`ws://115.236.167.66:10000/ws?token=${token}`);
  }

  socket.value.addEventListener('open', () => {
    console.log('WebSocket 已连接成功');

  });
  socket.value.onmessage =(e:any)=>{
    if (e.data !== "" && e.data !=='\r\n') {
      socket_data.value = JSON.parse(e.data);
      console.log( socket_data.value,'-- socket_data.value')
      all_data.value.unshift(JSON.parse(JSON.stringify(socket_data.value))); //这个是最新的数据
      all_data.value = all_data.value.concat(list.value);
      localStorage.setItem(message_data.value,JSON.stringify( all_data.value))
      list.value = JSON.parse(localStorage.getItem(message_data.value) as string);
      UseComom.init_loc()
      all_data.value = []
    }else {
      console.log('是空数组')
    }
  }

}
const handle_save =(status:string,data:any)=>{
  if (status==='refuse'){
    audit_save(data.eventId,false)
  }else {
    audit_save(data.eventId,true)

  }
  list.value = list.value.filter(v =>v.eventId !==data.eventId);

}
const audit_save =async (id:any,result:boolean)=>{
  const res = await audit({
    id:id,
    result:result
  })
  if (res.data.code ===200){
    message(t('已审批'),{type:'success'})
  }else {
    message(res.data.message,{type:'error'})

  }
}



const handle_refuse =async (item: any) => {
  const res = await action_audit({
    id: item.eventId,
    result: 4,
    devices:[]
  })
  if (res.data.code === 200) {
    localStorage.setItem(message_data.value,JSON.stringify( filterByEventId( list.value)))
    list.value = JSON.parse(localStorage.getItem(message_data.value) as string);
    message(t('审核完成'), {type: 'success'})
  } else {
    message(res.data.message, {type: 'error'})
  }
}
const filterByEventId = (array:any) => {
  return array.filter((item:any, index:number, arr:any) => {
    const isFirstItem = arr.findIndex(obj => obj.eventId === item.eventId) === index;
    return isFirstItem;
  });
}
onMounted(()=>{
  connectWebSocket()
})


</script>
<style lang="scss" scoped>
.message-box {
  .flex-center {
    padding: 0 10px;

    .message-icon {
      height: 25px;
      line-height: 25px;
      font-size: 1.3em;
    }
  }
}

.message-tabs {
  width: 300px;
  padding: 15px 10px;
  height: 500px;
  font-size: 14px;
  .unbind {
    padding: 5px 0;

    .unbind_content {
      display: flex;
      .unbind_left {
        img {
          width: 50px;
        }
      }
      .unbind_right {
        margin: 10px 0 0 10px;
        .unbind_top {
          display: flex;
          justify-content: space-between;
          span {
            padding-left: 80px;
          }
        }
        .unbind_text {
          padding-top: 10px;

          display: flex;
          span {
            padding-left: 10px;
          }
          .unbind_span {
            padding-left: 100px;

          }
        }
        .unbind_btn {
          padding: 10px 0 0 0;
          .btn{
            width: 90px;
          }
        }
      }
    }

  }
}
</style>
