<template>
  <div>
    <el-drawer
        v-model="props.drawer_flag"
        direction="rtl"
        :before-close="handle_cancel"
        class="drawer"
    >
      <template #header>
        <div class="drawer_header">
          {{t('添加通行周期')}}
        </div>

      </template>
      <template #default>
        <div class="drawer_buttom"></div>
        <div class="content"
             v-for="(item, index) in traffic_list.records"
             :key="item.id"
             @click="handleContentClick(index,item)"
             :class="{ 'active': selectedIndex === index }">
          <div class="content_box">
            <div class="content_box_left">{{ item.name }}</div>
            <div class="content_box_right">
              <img class="content_icon" @click="handle_edit(item)" :src="selectedIndex === index?white_edit:edit">
              <img class="content_icon" @click="handle_del(item)" :src="selectedIndex === index?white_del:del">
            </div>
          </div>
          <div class="content_time">
<!--            <div>{{t('通行周期')}}<span >{{item.type!==1?t('每周'):t('每日')}}</span></div>-->
            <div>{{t('通行周期')}}<span >{{item.times.length!==0?item.times.map(v=>getWeekLabel(v)).join(','):t('无')}}</span></div>

          </div>
        </div>

        <div class="content_add" @click="handle_add_traffic">
          <img src="@/assets/images/png/add.png">
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="handle_cancel">{{t('取消')}}</el-button>
          <el-button type="primary" @click="handle_save">{{t('确认')}}</el-button>
        </div>
      </template>
    </el-drawer>
    <traver_dialog :dialog="traver_dia" :editDate="edit_date" :traverStatus="traver_status" @save_dialog="handle_save_dialog"></traver_dialog>
  </div>

</template>



<script setup lang="ts">
import {useLocalesI18n} from "@/locales/hooks";
import {PropType} from "vue";
import {del_rule, eidt_rule, group_rule, handle_add_rule, traffic_rules} from "@/api/authorization";
import {useUserStore} from "@/store";
import  traver_dialog from '../travel_dialog/index.vue'
import edit from '@/assets/images/png/edit.png'
import del from '@/assets/images/png/delete.png'
import white_edit from '@/assets/images/png/white_edit.png'
import white_del from '@/assets/images/png/white_del.png'
import {message} from "@/utils/components/message";

const { t } = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'authorization']);
const props = defineProps({  //父组件爱你传递过来的弹框状态
  drawer_flag: {
    type:  Boolean as PropType<boolean>,
    default: false
  },
  groupID:{
    type:  String as PropType<string>,
    default: ''
  }
})
const traver_dia = ref(false)//通行周期的弹框
const emit = defineEmits();   //定义子组件传递方法
const traffic_list = ref({
  "records": [
    {
      "id": "3",
      "name": "3",
      "type": 1,
      "times": [
        {
          "week": null,
          "startTime": "00:00:00",
          "endTime": "23:59:59"
        }
      ]
    },
  ],
  "total": 0,
  "size": 10,
  "current": 1,
  "orders": [],
  "optimizeCountSql": true,
  "searchCount": true,
  "maxLimit": null,
  "countId": null,
  "pages": 0
})
const drawer = ref(false)
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const selectedIndex = ref(-1); // 初始值为 -1，表示没有选中的元素
const edit_date = ref({}); //弹框编辑的数据
const traver_status =ref('')//当前弹框的张坦
const rules_data = ref({})
const getWeekLabel = (row:object) => {
  switch (row.week) {
    case 'MONDAY':
      return t('周一');
    case 'TUESDAY':
      return t('周二');
    case 'WEDNESDAY':
      return t('周三');
    case 'THURSDAY':
      return t('周四');
    case 'FRIDAY':
      return t('周五');
    case 'SATURDAY':
      return t('周六');
    case 'SUNDAY':
      return t('周日');
    default:
      return t('每日');
  }
};
//编辑计划
const handle_edit =(list)=>{
  console.log(list,'--list')
  edit_date.value = list
  traver_status.value = 'edit'
  traver_dia.value = true
}

const handle_del =async (list)=>{
  ElMessageBox.confirm(
      t('确认')+t('删除')+t('通行周期'),
      t('删除')+t('通行周期'),
      {
        confirmButtonText: t('确认'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(async () => {
        await group_rule_del(list.id)
      })
      .catch(() => {
        message(t('取消')+t('删除')+t('通行周期'), {type: 'error'})
      })
}
const handleContentClick = (index:number,item:any) => {
  rules_data.value = item
  if (selectedIndex.value === index) {
    selectedIndex.value = -1; // 取消选中
  } else {
    selectedIndex.value = index; // 更新选中元素的索引
  }
}
//添加通行周期
const handle_add_traffic = ()=>{
  console.log('添加通行周期')
  traver_status.value = 'add'
  traver_dia.value = true

}
const handle_save_dialog =(flag:boolean,status:string,data:any)=>{
  traver_dia.value = flag
  if (status === 'cancel') return true
  console.log(status,'-status')
  if ( traver_status.value ==='add'){
    group_rule_add(data)
  }else  {
    group_rule_edit(data)
  }
}
//编辑授权组通行周期
const group_rule_edit =async (data:any)=>{
  const res =await eidt_rule(data)
  if (res.data.code ===200){
    message(t('编辑')+t('成功'),{type:'success'})
    await traffic_rules_all(plotId)
  }else {
    message(res.data.message,{type:'error'})

  }

}
//添加授权组通行周期
const group_rule_add =async (data:any)=>{
  const res =await group_rule(data)
  if (res.data.code ===200){
    message(t('添加')+t('成功'),{type:'success'})
    await traffic_rules_all(plotId)
  }else {
    message(res.data.message,{type:'error'})

  }

}
//添加通行规则
const handle_rule =async (personGroupId:any,ruleId:any)=>{
  const res =await handle_add_rule({
    personGroupId:personGroupId,
    ruleId:ruleId
  })
  if (res.data.code ===200){
     message(t('添加')+t('通行周期')+t('成功'),{type:'success'})
  }else {
    message(res.data.message,{type:'success'})

  }
}
const group_rule_del =async (data:any)=>{
  const res =await del_rule({
    id:data
  })
  if (res.data.code ===200){
    message(t('删除')+t('成功'),{type:'success'})
    await traffic_rules_all(plotId)
  }else {
    message(res.data.message,{type:'error'})

  }
}
//抽屉取消
const handle_cancel = ()=>{
  console.log('取消')
  drawer.value = false
  emit("save", drawer.value,'cancel');
}
//抽屉确认
const handle_save = ()=>{
  console.log(rules_data.value,'--rules_data.value')
  if (Object.keys(rules_data.value).length !== 0){
    handle_rule(props.groupID,rules_data.value.id)
  }
  drawer.value = false
  console.log('确认')
  emit("save", drawer.value,'save');

}
//分页查询人员组通行规则列表
const traffic_rules_all =async (plotId:number)=>{
  const res = await traffic_rules(plotId)
  if(res.data.code ===200){
    traffic_list.value = res.data.data
    console.log(traffic_list.value,'--traffic_list.value')
  }
}
onMounted(()=>{
  traffic_rules_all(plotId)
})
watch([() => props.drawer_flag, ],
    ([new_drawer_flag]) => {
      drawer.value = new_drawer_flag
      selectedIndex.value = -1
      traffic_rules_all(plotId)
    });
</script>


<style scoped lang="scss">
.drawer {
  .drawer_header {
    font-size: 18px;
    color: #333333;
  }

  .drawer_buttom {
    height: 1px;
    border: 1px solid #ebedf0;
    margin: -20px 0 16px 0;
    width: 100%;
  }

  .content {
    width: 312px;
    height: 100px;
    background: #ffffff;
    border-radius: 8px;
    margin-bottom: 5px;
    border: 1px solid #ebf2ff;
    cursor: pointer;

    .content_box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0 0 20px;

      .content_box_left {
        color: #333333;
        font-size: 18px;
      }

      .content_box_right {
        .content_icon {
          width: 20px;
          padding-left: 5px;
        }
      }
    }

    .content_time {
      padding: 0 0 0 20px;
      span {
        padding-left: 10px;
      }

      div {
        font-size: 16px;
        color: #666666;
        padding-top: 5px;
      }
    }
  }

  .content_add {
    width: 312px;
    height: 100px;
    background: #ffffff;
    margin-top: 10px;
    border: 1px solid #ebf2ff;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}

.content.active {
  background-color: #3b81f4;
.content_box {
  .content_box_left {
    color: #ffffff;
  }
}


  .content_time div {
    color: #ffffff;
  }
}
</style>
