<template>
  <div class="person">
    <div class="company">
      <span>{{ depart_name }}</span>
      <span>{{ personnel_date.total }} {{ t('人') }}</span>

    </div>
    <div class="function">
      <div class="function_left">
        <el-button type="primary" @click="handle_add">{{ t('添加人员') }}</el-button>
        <el-button @click="handle_export">{{ t('导入/导出') }}</el-button>

        <el-button @click="move_blacklist">{{ t('移至黑名单') }}</el-button>

        <el-button @click="handle_deletion">{{ t('批量删除') }}</el-button>
        <!--        <el-button @click="handle_all">{{ $t('全选') }}</el-button>-->
      </div>
      <div class="function_right">
        <div class="search-wrapper">
          <el-input
              v-model="search_person"
              :placeholder="t('请输入姓名或ID')"
          >
            <template #append>
              <el-button icon="mel-icon-search" @click="handle_search"/>
            </template>
          </el-input>
        </div>
      </div>
    </div>
    <div class="table-wrapper">
      <el-table
          ref="multiple_Ref"
          :data="personnel_date.records"
          :row-key="getRowKey"
          style="width: 100%"
          @selection-change="handleSelectionChange"

      >
        <el-table-column
            :reserve-selection="true"
            fixed
            type="selection"
            width="55"
        />
        <el-table-column
            :index="set_index"
            :label="t('序号')"
            prop="Number"
            type="index"
        >
        </el-table-column>
        <el-table-column label="ID" prop="id"/>
        <el-table-column :label="t('姓名')" prop="name"/>
        <el-table-column :label="t('卡号')" prop="state"/>
        <el-table-column :label="t('人脸')" prop="facePicture">
          <template #default="{ row }">
            <span>{{ row.facePicture !== null ? t('有') : t('无') }}</span>
          </template>

        </el-table-column>
        <el-table-column :label="t('操作')" fixed="right" width="200">
          <template #default="{row}">
            <el-button size="small" type="primary" @click="handle_edit(row)">{{ t('编辑') }}</el-button>
            <el-button size="small" type="danger" @click="handle_del(row)"> {{ t('删除') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
          v-model:current-page="current_page"
          v-model:page-size="page_size"
          :total="personnel_date.total"
          layout="prev, pager, next, jumper"
          @current-change="handleCurrentChange"
      />
    </div>
    <person_dialog
        :dialog='dialog_flag'
        :editDate="edit_date"
        :status="dia_status"
        :tree_node="treeNode"
        @save="handle_dia"
    >
    </person_dialog>
    <export_dialog :export_dialog="export_dia" :tree_node="treeNode" @export_save="handle_export_save"></export_dialog>
  </div>
</template>

<script lang="ts" setup>
import export_dialog from "../export_dialog/index.vue"
import person_dialog from '../person_dialog/index.vue'
import {useLocalesI18n} from "@/locales/hooks";
// import { PropType,defineProps } from "vue";
import {message} from "@/utils/components/message";
import {blacklist, personnel_add, personnel_del, personnel_edit, personnel_list} from "@/api/person";
import {useUserStore} from "@/store";

const UserStore = useUserStore()
const plotId = computed(() => UserStore.user.plotId)
const depart_name = computed(() => UserStore.user.plotName)
console.log(plotId, '--当前组织id')
const {t} = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'person_table']);
const props = defineProps({
  treeNode: {
    type: String as PropType<string>,
    default: '0'
  },
  title: {
    type: String as PropType<string>,
    required: true
  },

  parent_path: {
    type: String as PropType<string>,
    default: '0/0'
  },
})
console.log(props, '---props-----')
const treeNode = ref<any>('0')
const parentPath = ref<string>('0/0')
const export_dia = ref(false)
const personnel_date = ref({
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
const dialog_flag = ref<boolean>(false) //用来空追子组件弹框的
const multipleSelection = ref([])  //点击多选框 拿到当前选中的table列
const multiple_Ref = ref() //当前table组建的实例
const select_all = ref<boolean>(false)
const search_person = ref<string>('')
const current_page = ref(0);//当前页数
const page_size = ref(12); //每页显示条目个数
const dia_status = ref('add')
const edit_date = ref({})//编辑的时候拿到的数据
//切换分页
const handleCurrentChange = (val: number) => {
  current_page.value = val;
  personnel_list_all(treeNode.value, val, 12, 1, parentPath.value, search_person.value)  //默认查询第一页
};
//搜索
const handle_search = async () => {
  console.log('search_person.value', search_person.value)

  console.log('搜索')
  await personnel_list_all(treeNode.value, 0, 12, 1, parentPath.value, search_person.value)  //默认查询第一页        // ElMessage({
}

const handleSelectionChange = (val: any) => {

  multipleSelection.value = val.map(item => item.id);
  console.log(multipleSelection.value, '--  multipleSelection.value')
}
//批量删除
const handle_deletion = () => {
  ElMessageBox.confirm(
      t('将删除您所勾选的人员，是否确认?'),
      t('批量删除确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(async () => {
        console.log(multipleSelection.value, '--  multipleSelection.value')
        if (multipleSelection.value.length === 0) {
          return message(t('删除人员不能为空'), {type: "success"})

        }
        await personnel_del_all(multipleSelection.value)

      })
      .catch(() => {
        message(t('取消批量删除'), {type: "error"})

      })
}
const handle_edit = (row: any) => {
  console.log('click', row)
  dia_status.value = 'edit'
  edit_date.value = row
  dialog_flag.value = true
}
//删除人员
const handle_del = (row) => {
  const data = []
  data.push(row.id)
  ElMessageBox.confirm(
      t('将删除您所勾选的人员，是否确认?'),
      t('删除确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(async () => {
        await personnel_del_all(data)

      })
      .catch(() => {
        message(t('取消删除'), {type: "error"})

      })


}
//删除人员接口
const personnel_del_all = async (id: Array<string>) => {
  const res = await personnel_del({
    ids: id
  })
  if (res.data.code === 200) {
    message(t('删除') + t('成功'), {type: "success"})
    await personnel_list_all(treeNode.value, current_page.value, 12, 1, parentPath.value)  //默认查询第一页        // ElMessage({

  } else {
    message(res.data.message, {type: "error"})
  }
}
const handle_add = () => {
  dia_status.value = 'add'
  console.log('添加人员')
  dialog_flag.value = true
}

const move_blacklist = () => {
  ElMessageBox.confirm(
      t('将您所勾选的人员，移动至黑名单，是否确认?'),
      t('移至黑名单确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(async () => {
        const res = await blacklist({
          operate: true,
          personIds: multipleSelection.value
        })
        if (res.data.code === 200) {
          message(t('移至黑名单成功'), {type: "success"})
          await personnel_list_all(treeNode.value, current_page.value, 12, 1, parentPath.value)  //默认查询第一页
        }

      })
      .catch(() => {
        message(t('取消移至黑名单'), {type: "error"})

      })
}
//全部选中
const handle_all = () => {
  select_all.value = !select_all.value
  console.log(select_all.value, '--全选')
  if (select_all.value) {
    multiple_Ref.value.toggleAllSelection()
  } else {
    multiple_Ref.value.clearSelection()

  }
}
//导入导出接口
const handle_export = () => {
  export_dia.value = true
}
const handle_export_save = async (val: any, state: string) => {
  export_dia.value = val
  await personnel_list_all(treeNode.value, current_page.value, 12, 1, parentPath.value); // 默认查询第一页

}
const handle_dia = async (val: any, state: string, date: any) => {
  dialog_flag.value = val
  if (state === 'cancel') return true
  console.log(val, '--dialog子组件传递上来的数据')
  console.log(state, '--dialog子组件传递上来的装填')
  console.log(date, '--dialog子组件传递上来的数据')
  if (dia_status.value === 'add') {
    await personnel_add_save(date)
    await personnel_list_all(treeNode.value, current_page.value, 12, 1, parentPath.value)  //默认查询第一页
  } else {
    await personnelEdit(date)
    await personnel_list_all(treeNode.value, current_page.value, 12, 1, parentPath.value)  //默认查询第一页

  }


}
//获取人员列表
const personnel_list_all = async (organizationId: number, page: number, size: number, status: number, parentPath: string, name?: string) => {
  const res = await personnel_list(organizationId, page, size, status, parentPath, name)
  console.log('走这里了饿吗')
  if (res.data.code === 200) {
    personnel_date.value = res.data.data
  }
}
const getRowKey = (row: any) => {
  return row.id
}
//新增人员接口
const personnel_add_save = async (date) => {
  console.log('添加接口')
  const res = await personnel_add(date)
  console.log(res, '--res')

}

//编辑人员
const personnelEdit = async (date) => {
  const res = await personnel_edit(date)
  if (res.data.code === 200) {
    message(t('编辑') + t('成功'), {type: "success"})

  } else {
    message(res.data.message, {type: "error"})

  }
}
const set_index = (index) => {
  if (current_page.value >= 1) {
    return (current_page.value - 1) * page_size.value + index + 1

  } else {
    return (current_page.value) * page_size.value + index + 1

  }
}
//动态的接受父组件传过来的树id
// onMounted(()=>{
//
// })

const route = useRoute();

watch(
    [() => props.treeNode, () => props.parent_path, route],
    async ([new_treeNode, new_parentPath]) => {
      console.log(new_parentPath, '--props.new_parentPath');
      treeNode.value = new_treeNode;
      parentPath.value = new_parentPath;
      search_person.value = ''
      await personnel_list_all(treeNode.value, current_page.value, 12, 1, parentPath.value); // 默认查询第一页
    },
    {immediate: true}
);
</script>


<style lang="scss" scoped>
.person {
  width: 100%;
  padding: 16px;

  .company {
    span {
      font-size: 24px;
      color: #333333;
    }

    span:nth-child(2) {
      font-size: 20px;
      color: #3b81f4;
      padding-left: 5px;
    }

    span:nth-child(3) {
      font-size: 18px;
      color: #333333;
    }
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

</style>
