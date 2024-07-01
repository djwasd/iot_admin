

<template>
  <div>
    <el-dialog
        v-model="dialog_visible"
        class="dialog_css"
        width="900"
        :before-close="handle_close"
    >
      <template #header>
        <div class="dialog_header">
          {{ t('人员列表') }}
        </div>
        <div class="dialog_buttom"></div>
        <div class="container">
          <div class="left">
            <div class="company">{{t('部门选择')}}</div>
            <div class="company_name">
              <div class="name">
                <div class="depart_name" >{{t('所有人员')}}          {{personnel_date.total}}</div>
              </div>
              <!--        <img class="custom_image" src="@/assets/images/png/add.png" style="cursor: pointer" @click="handle_add">-->
            </div>
            <div class="tree">
              <el-tree
                  :data="departmental_date"
                  :props="defaultProps"
                  class="full-height"
                  @node-click="handleNodeClick"
                  :default-expand-all =true
                  :highlight-current="true"
              >
                <template #default="{ node, data }">

                  <div class="custom_top">
                    <div class="custom_content">
                      <mel-icon-menu class="custom_img"></mel-icon-menu>
                      <div style="margin-left: 5px;">{{ node.label }}</div>
                    </div>
                  </div>


                </template>
              </el-tree>
            </div>
          </div>
          <div class="right">
            <div class="function">
              <div class="function_left">
                <el-button @click="handle_all">{{ t('全选') }}</el-button>
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
                  :data="personnel_date.records"
                  style="width: 100%"
                  ref="multiple_Ref"
                  @selection-change="handleSelectionChange"
                  :row-key="getRowKey"

              >
                <el-table-column
                    :reserve-selection="true"
                    fixed type="selection"
                    width="80"
                />
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
              </el-table>
            </div>
            <div class="pagination">
              <el-pagination
                  v-model:current-page="current_page"
                  v-model:page-size="page_size"
                  layout="prev, pager, next, jumper"
                  :total="personnel_date.total"
                  @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handle_close">{{t('取消')}}</el-button>
          <el-button type="primary" v-if="props.view !=='view'" @click="handle_save">{{t('确认')}}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {useLocalesI18n} from "@/locales/hooks";
import {personnel_groupList} from "@/api/authorization";
import {actions_list} from "@/api/person";
import {useUserStore} from "@/store";
import {message} from "@/utils/components/message";
import {personnel_group} from "@/api/attendance";
import {PropType, watch} from "vue";

const { t } = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'person_table']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const dialog_visible = ref(false)
const parentPath = ref('/0/')  //
const tree_node = ref('0')//当前数id 默认是组织id总的
const new_status = ref('')

const props = defineProps({  //父组件爱你传递过来的弹框状态
  dialog: {
    type:  Boolean as PropType<boolean>,
    default: false
  },
  status:{
    type: String as PropType<string>,
    default: '',
  },
  data:{
    type: Array as PropType<any>,
    default: [],
  },
  id:{
    type: String as PropType<string>,
    default: '',
  },
  view:{
    type: String as PropType<string>,
    default: '',
  }
})
const defaultProps = {
  children: 'children',
  label: 'name',
  id: 'id'
}
const emit = defineEmits();   //定义子组件传递方法
const departmental_date = ref([])//初始化部门列表
const  personnel_date = ref({
  "records": [

    {
      "id": "122",
      "name": "2",
      "sex": 1,
      "password": null,
      "facePicture": null,
      "idNo": null,
      "phone": null,
      "birthdayStamp": 0,
      "startTimestamp": 1704038400000,
      "endTimestamp": 2082643200000,
      "address": null,
      "issuingAuthority": null,
      "craft": null,
      "idNoStartDateTimestamp": 0,
      "idNoEndDateTimestamp": 0,
      "idNoPicture": "0",
      "nation": null,
      "post": null,
      "bankCard": null,
      "bankPhysicsCard": null,
      "personCardInfoList": []
    }
  ],
  "total": 2,
  "size": 12,
  "current": 1,
  "orders": [],
  "optimizeCountSql": true,
  "searchCount": true,
  "maxLimit": null,
  "countId": null,
  "pages": 1
}) //当前列表所有数据
const multipleSelection = ref([])  //点击多选框 拿到当前选中的table列
const current_page = ref(0);//当前页数
const page_size = ref(10); //每页显示条目个数
const select_all =ref<boolean>(false) //是否全选
const multiple_Ref = ref() //当前table组建的实例
const search_person = ref<string>('')//搜索
const attendanceRuleId = ref('')
const edit_selection = ref<any>()
//全部选中
const handle_all = ()=>{
  select_all.value = !select_all.value
  if (select_all.value){
    multiple_Ref.value.toggleAllSelection()
  }else  {
    multiple_Ref.value.clearSelection()
  }
}

//搜索
const handle_search =async ()=>{

  await personnel_list_all(tree_node.value, 0, page_size.value, 1,parentPath.value,true,attendanceRuleId.value,search_person.value)
}
const set_index = (index:number)=>{
  if (current_page.value >=1){
    return (current_page.value -1) * page_size.value + index + 1

  }else  {
    return (current_page.value ) * page_size.value + index + 1

  }
}
//切换分页
const handleCurrentChange = async (val: number) => {
  current_page.value = val;
  select_all.value = false
  await personnel_list_all(tree_node.value,  current_page.value, page_size.value, 1,parentPath.value,true,attendanceRuleId.value,search_person.value)
  if (new_status.value ==='edit'){
    toggleSelection(edit_selection.value,new_status.value)
  }

};
//点击table选择框
const handleSelectionChange = (val:any) => {
  multipleSelection.value =val.map(item => ({ "personId": item.id ,'personOrganizationId':tree_node.value}));
}
const handle_close = () => {
  if (multiple_Ref.value){
    personnel_date.value.records.forEach((row: any) => {
      multiple_Ref.value.toggleRowSelection(row, false); // 默认勾选
    })
  }
  dialog_visible.value = false
  emit("save_dialog", dialog_visible.value,'cancel');
}
//点击树拿到需要的信息
const handleNodeClick =async (data: any) => {
  tree_node.value = data.id
  parentPath.value = data.parentPath
 await  personnel_list_all(tree_node.value,  current_page.value, page_size.value, 1,parentPath.value,true,attendanceRuleId.value,search_person.value)

}
const handle_save = ()=>{
  dialog_visible.value = false
  emit("save_dialog", dialog_visible.value,'save',multipleSelection.value);

}
//初始化获取部门列表
const handle_department = async (plotId: any) => {
  const res = await actions_list( plotId)
  if (res.data.code === 200) {
    departmental_date.value = res.data.data
    tree_node.value =   departmental_date.value[0].id
  }
}
const personnel_list_all = async (
    organizationId:any,
    page:number,
    size:number,
    status:number,
    parentPath:string,
    isExcludeAddedAttendanceRulePerson:boolean,
    attendanceRuleId?:string,
    name?:string) => {
  const res = await personnel_group(organizationId, page, size, status, parentPath,isExcludeAddedAttendanceRulePerson,attendanceRuleId, name);
  if (res.data.code === 200) {
    personnel_date.value = res.data.data;
  }
}

const getRowKey = (row:any)=>{
  return row.id
}
const toggleSelection = (list:any,status:string)=>{
  console.log(list,'--list')
  if (multiple_Ref.value){
    if (status === 'add'){
      if (list.length !==0){
        let filter_data = personnel_date.value.records.filter(itemB => list.some(itemA => itemA.personId === itemB.id));
        filter_data.forEach((row:any)=>{
          multiple_Ref.value.toggleRowSelection(row, true); // 默认勾选
        })
      }else {
        personnel_date.value.records.forEach((row: any) => {
          multiple_Ref.value.toggleRowSelection(row, false); // 默认勾选
        })
      }


    }
    else  {
      let filter_data = personnel_date.value.records.filter(itemB => list.some(itemA => itemA.personId === itemB.id));
      filter_data.forEach((row:any)=>{
        multiple_Ref.value.toggleRowSelection(row, true); // 默认勾选
      })
    }

  }
}
//二次修改了添加时候设备的状态
watch(
    [ () => props.dialog,()=>props.status,()=>props.data,()=>props.id],
    async ([newVal, newStatus,newData]) => {
      console.log(newData,'--newData')
      dialog_visible.value = newVal;
      new_status.value = newStatus
      await handle_department(plotId)//获取初始部门列表
      if (newStatus ==='add'){
        attendanceRuleId.value = ''
        edit_selection.value = newData
        await personnel_list_all(tree_node.value, 0, page_size.value, 1,parentPath.value,true,attendanceRuleId.value,search_person.value)
        toggleSelection(edit_selection.value,new_status.value)
        multipleSelection.value = newData

      }else  {
        edit_selection.value = newData
        attendanceRuleId.value = props.id
        await personnel_list_all(tree_node.value, 0, page_size.value, 1,parentPath.value,true,attendanceRuleId.value,search_person.value)
        toggleSelection(edit_selection.value,new_status.value)
        multipleSelection.value = newData

      }
    }
);

</script>

<style scoped lang="scss">
.dialog_css {
  .dialog_header {
    font-size: 18px;
    color: #333333;
    width: 100%;
  }
  .dialog_buttom {
    height: 1px;
    border: 1px solid #A3A6AD;
    margin: 16px 0;
    width: 100%;

  }
  .container{
    display: flex;
    width: 100%;
    height: 60vh;
    background-color: #ffffff;
    .left {
      //flex: 1;
      width: 280px;
      //width: 30%;
      height: 100%;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 3px 6px #D6E2FE;

      .company {
        font-size: 18px;
        font-weight: 700;
        margin: 16px 0 0 16px;
      }

      .company_name {
        margin: 20px 0 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center; /* 添加此行 */
        height: 40px;
        width: 240px;
        padding: 0 0 0 19px;
        background: #EBF3FF;
        color: #3b81f4;

        .name {
          display: flex;
          padding-left: 40px;
          .name_left {
            width: 20px;
            height: 20px;
            color: #ffffff;
            background: #3B81F4;
            margin: 0 auto;
            display: flex;
            justify-content: center; /* 添加此行 */
            align-items: center; /* 添加此行 */
          }
          .depart_name {
            padding-left: 10px;
          }
        }

        img {
          width: 20px;
          height: 20px;
          padding-right: 10px;
        }
      }

      .tree {
        flex-grow: 1; /* 添加 flex-grow: 1 属性 */
        margin-top: 16px;

        .custom_top {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          padding-right: 8px;

          .custom_content {
            display: flex;

            .custom_img {
              width: 15px;
              height: 15px;
              padding: 2px 5px 0 0;
            }
          }

        }
      }
    }
    .right {
      flex: 1;
      overflow: hidden;
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
  }
}
:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content)  {
  background-color: #FFEAEB !important;
  color: #D42A30;
}
</style>
