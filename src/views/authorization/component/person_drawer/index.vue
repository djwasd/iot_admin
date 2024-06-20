<template>
  <el-drawer
      v-model="props.drawer_person"
      direction="rtl"
      :before-close="handle_cancel"
      class="drawer"
      size="30%"
  >
    <template #header>
      <div class="drawer_header">
        {{t('人员授权')}}
      </div>
    </template>
    <template #default>
      <div class="drawer_buttom"></div>
      <div class="function">
        <div class="function_left">
          <el-button @click="handle_add"   type="primary">{{ t('添加人员') }}</el-button>

        </div>
        <div class="function_right">
          <div class="search-wrapper">
            <el-input
                v-model="search_person"
                :placeholder="t('请输入姓名或ID')"
            >
              <template #append>
                <el-button @click="handle_search" icon="mel-icon-search" />
              </template>
            </el-input>
          </div>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table
            :data="group_data.records"
            style="width: 100%"
            ref="multiple_Ref"
        >
          <el-table-column
              :index="set_index"
              :label="t('序号')"
              prop="Number"
              type="index"
              width="80"
          >
          </el-table-column>
          <el-table-column prop="id" label="ID"  />
          <el-table-column prop="name" :label="t('姓名')"  />
          <el-table-column prop="state" :label="t('卡号')" />
          <el-table-column prop="facePicture" :label="t('人脸')" >
            <template #default="{ row }">
              <el-image
                  style="width: 40px; height: 40px"
                  :src="git_pic(row)"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  fit="cover"
                  :preview-src-list="[git_pic(row)]"
              >
                <template #error>
                  <div class="image-slot">
                    <img :src="no_pic" style="width: 40px; height: 40px">
<!--                    <mel-icon-picture style="width: 50px; height: 50px"></mel-icon-picture>-->
                  </div>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column fixed="right" :label="t('操作')" width="100">
            <template #default="{row}">
              <el-button  type="danger" size="small"  @click="handle_selling(row)">   {{t('销权')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
            v-model:current-page="current_page"
            v-model:page-size="page_size"
            layout="prev, pager, next, jumper"
            :total="group_data.total"
            @current-change="handleCurrentChange"
        />
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="handle_cancel">{{t('取消')}}</el-button>
        <el-button type="primary" @click="handle_save">{{t('确认')}}</el-button>
      </div>
    </template>
  </el-drawer>
   <person_dialog :dialog="person_dia" @save_dialog="handle_person"></person_dialog>
</template>



<script setup lang="ts">
import {useLocalesI18n} from "@/locales/hooks";
import {PropType} from "vue";
import person_dialog from '../person_dialog/index.vue'
import {add_person, handle_del_group, personnel_personGroup} from "@/api/authorization";
import {message} from "@/utils/components/message";
import {useUserStore} from "@/store";
import {upload_person} from "@/api/glob";
import no_pic from "@/assets/images/png/no_pic.png"
const { t } = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'authorization']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId  //组织ID
const drawer =ref(false)//当前弹框的状态
const  person_dia = ref(false)
const current_page = ref(1);//当前页数
const page_size = ref(8); //每页显示条目个数
const group_data = ref({})
const props = defineProps({  //父组件爱你传递过来的弹框状态
  drawer_person: {
    type:  Boolean as PropType<boolean>,
    default: false
  },
  groupID:{
    type:  String as PropType<string>,
    default: ''
  }
})
const emit = defineEmits();   //定义子组件传递方法
const tree_node = ref('0')//当前数id 默认是组织id总的
const search_person = ref<string>('')//搜索对应的
const image_facePicture = ref('')
const git_pic =  (row) => {
  console.log(row.facePicture, '--row');
  if (row.facePicture) {
    // const res =  upload_person(row.facePicture);
    const ipAddress = window.location.host;
    const url =  `http://${ipAddress}/operation/cloud/web/sys/api/v1/attachment/actions/download?file_id=${row.facePicture}`;
    console.log(url,'--url')
    return  url
  }
  return no_pic;
};
const handle_selling =async (row)=>{
  console.log(row,'--row---')
const data:any = []
  data.push(row.id)
  ElMessageBox.confirm(
      t('将销权您所选择的人员，是否确认?'),
      t('销权确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(async () => {
        const res =await handle_del_group({
          personGroupId:props.groupID,
          personIds:data
        })
        if(res.data.code ===200){
          await   personnel_group_all(current_page.value,page_size.value,props.groupID)

          message(t('删除')+t('成功'),{type:"success"})

        }else {
          message(res.data.message,{type:"error"})
        }

      })
      .catch(() => {
        message(t('取消批量删除'),{ type: "error" })

      })

}
//搜索
const handle_search =async ()=>{
  console.log('search_person.value',search_person.value)

  console.log('搜索')
  await   personnel_group_all(0,page_size.value,props.groupID,search_person.value)
}

//切换分页
const handleCurrentChange =async (val:number) => {
  current_page.value = val;
  await   personnel_group_all(current_page.value,page_size.value,props.groupID,search_person.value)
};
const set_index = (index)=>{
  if (current_page.value >=1){
    return (current_page.value -1) * page_size.value + index + 1

  }else  {
    return (current_page.value ) * page_size.value + index + 1

  }
}
//添加人员
const handle_add =()=>{
  person_dia.value=true
}
//
const handle_person = async  (flag:boolean,status:string,data:any)=>{
  person_dia.value =false
  if (status ==='cancel')return true
 await person_add(props.groupID,data)
  await   personnel_group_all(current_page.value,page_size.value,props.groupID)

}
const person_add = async (personGroupId:any,personIds:Array<string>)=>{
  const res = await add_person({
    personGroupId:personGroupId,
    personIds:personIds
  })
  if (res.data.code ===200){
    message(t('添加')+ t('成功'), {type: "success"})
  }else  {
    message(res.data.message, {type: "error"})
  }
}
//抽屉取消
const handle_cancel = ()=>{
  console.log('取消')
  drawer.value = false
  emit("save_person", drawer.value,'cancel');
}
//抽屉确认
const handle_save = ()=>{
  drawer.value = false
  console.log('确认')
  emit("save_person", drawer.value,'save');

}

const personnel_group_all = async ( page:number, size:number,personGroupId:string, name?:string) => {
  const res = await personnel_personGroup( page, size,personGroupId, name);
  if (res.data.code === 200) {
    group_data.value = res.data.data
  }
}

watch([() => props.drawer_person, ],
   async ([new_drawer_flag]) => {
      drawer.value = new_drawer_flag
   await   personnel_group_all(current_page.value,page_size.value,props.groupID)
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
  .function {
    padding: 16px 0;
    display: flex;
    justify-content: space-between;
    .function_right {
      .search-wrapper {
        position: relative;
        display: inline-block;
        .icon {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          cursor: pointer;
        }
      }
      el-input {
        padding-right: 30px; // 调整输入框的右侧内边距以容纳图标
      }
    }
    .function_left {
      .dropdown {
        margin: 0 10px;
      }
    }


  }
  .pagination {
    padding: 16px 0;
    display: flex;
    justify-content: flex-end;
  }

}
:deep(.el-image-viewer__mask){
  background: #ffffff;
}
</style>
