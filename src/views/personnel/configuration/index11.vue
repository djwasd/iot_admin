<template>
  <div class="container">
    <div class="left">
      <div class="company">公司/部门管理</div>
      <div class="company_name">
        <div class="name">
          <div class="name_left">{{ depart_name.slice(0, 1) }}</div>
          <div class="depart_name">{{ depart_name }}</div>
        </div>
                <img class="custom_image" src="@/assets/images/png/add.png" style="cursor: pointer" @click="handle_add">
      </div>
      <div class="tree">
        <el-tree
            :data="departmental_date.children"
            :default-expand-all=true
            :highlight-current="true"
            :props="defaultProps"
            class="full-height"
            @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">

            <div class="custom_top">
              <div class="custom_content">
                <mel-icon-menu class="custom_img"></mel-icon-menu>
                <div style="margin-left: 5px;">{{ node.label }}</div>
              </div>
              <div class="showIcon">
                <el-dropdown trigger="click" @command="(command:string) => handleCommand(command, data)">
                  <me-icon-Ellipsis class="icon" style="font-size: 1.6em"/>

                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="add">
                        <div class="showIcon_top">
                          <img class="custom_image" src="@/assets/images/png/add.png">
                          <div style="margin-left: 10px">创建子部门</div>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="edit">
                        <div class="showIcon_top">
                          <img class="custom_image" src="@/assets/images/png/show_edit.png">
                          <div style="margin-left: 10px">编辑部门</div>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="del">
                        <div class="showIcon_top">
                          <img class="custom_image" src="@/assets/images/png/delete.png">
                          <div style="margin-left: 10px">删除</div>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>


          </template>
        </el-tree>
      </div>
    </div>
    <div class="right">
      <person_table
          :parent_path="parentPath"
          :title="configuration"
          :treeNode="tree_node"
          @save="handle_person"
      ></person_table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useLocalesI18n} from "@/locales/hooks";
import person_table from '@/views/personnel/component/person_table/index.vue'
import {actions_list, department_add, department_del, department_edit} from "@/api/person";
import {useUserStore} from "@/store";
import {message} from "@/utils/components/message";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'person_table']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const depart_name =ref('')
const parentPath = ref('/0/')
const department_parentPath =ref('')

const departmental_date = ref([
  {
    id: "59",
    pid: "0",
    children: [],
    name: "测试2级",
    sort: 0,
    type: 0,
    personNumber: 3,
    parentPath: "/0/"
  }
])
const tree_node = ref('0')
const configuration = ref<string>('')

interface Tree {
  id: string;
  name: string;
  type: number;
  personNumber: number;
  children?: Tree[];
}

const defaultProps = {
  children: 'children',
  label: 'name',
  id: 'id'
}

//点击tree
const handleNodeClick = (data: any) => {
  tree_node.value = data.id
  parentPath.value = data.parentPath
  configuration.value = data.name

}
const handleCommand = (command: string, data: any) => {
  console.log('Command:', command);
  if (command === 'add') {
    ElMessageBox.prompt(t('请输入部门名称'), t('创建部门'), {
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      inputPattern: /^[\w\u4e00-\u9fa5\!\@#\$\%\^\&\*\(\)\-\+\=\[\]\{\}\|\;\:\'\"\,\.\<\>\/\?]+$/,
      inputErrorMessage: t('不能为空')
    })
        .then(async ({value}) => {
          await handle_add_department(data.id, value)
          await handle_department(plotId)//获取初始部门列表
        })
        .catch(() => {
          message(t('取消添加部门'), {type: 'error'})

        })
  } else if (command === 'edit') {
    ElMessageBox.prompt(t('请输入部门名称'), t('编辑部门'), {
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      inputPattern: /^[\w\u4e00-\u9fa5\!\@#\$\%\^\&\*\(\)\-\+\=\[\]\{\}\|\;\:\'\"\,\.\<\>\/\?]+$/,
      inputErrorMessage: t('不能为空')
    })
        .then(async ({value}) => {
          await handle_edit_department(data.id, value)
          await handle_department(plotId)//获取初始部门列表
        })
        .catch(() => {
          message(t('取消编辑部门'), {type: 'error'})
        })
  } else {
    ElMessageBox.confirm(
        data.name + t('将被删除，下挂人员将一并删除，是否确认?'),
        t('删除部门'),
        {
          confirmButtonText: t('确认'),
          cancelButtonText: t('取消'),
          type: 'warning',
        }
    )
        .then(async () => {
          await handle_del_department(data.id)
          await handle_department(plotId)//获取初始部门列表
        })
        .catch(() => {
          message(t('取消删除部门'), {type: 'error'})
        })
  }
  console.log(data, '--data')


}
//初始化获取部门列表
const handle_department = async (plotId: any) => {
  const res = await actions_list(plotId)
  if (res.data.code === 200) {
    departmental_date.value = res.data.data
    tree_node.value = departmental_date.value[0].id
    depart_name.value = departmental_date.value[0].name
    configuration.value = departmental_date.value[0].name
    department_parentPath.value = departmental_date.value[0].parentPath
  }
}
const handle_del_department = async (id: number) => {
  const res = await department_del({
    id: id,
  })
  if (res.data.code === 200) {
    message(t('删除成功'), {type: 'success'})
  } else {
    message(res.data.message, {type: 'error'})
  }
}
const handle_edit_department = async (id: number, name: string) => {
  const res = await department_edit({
    id: id,
    plotId: plotId,
    name: name,
    type: 4
  })
  if (res.data.code === 200) {
    message(t('编辑成功'), {type: 'success'})
  } else {
    message(res.data.message, {type: 'error'})
  }
}
//新增部门组织
const handle_add_department = async (parentId: number, name: string) => {
  const res = await department_add({
    parentId: parentId,
    plotId: plotId,
    name: name,
    type: 4
  })
  if (res.data.code === 200) {
    message(t('添加成功'), {type: 'success'})
  } else {
    message(res.data.message, {type: 'error'})
  }
}
const handle_add = async () => {
  ElMessageBox.prompt(t('请输入部门名称'), t('创建部门'), {
    confirmButtonText: t('确认'),
    cancelButtonText: t('取消'),
    inputPattern: /^[\w\u4e00-\u9fa5\!\@#\$\%\^\&\*\(\)\-\+\=\[\]\{\}\|\;\:\'\"\,\.\<\>\/\?]+$/,
    inputErrorMessage: t('不能为空')
  })
      .then(async ({value}) => {
        await handle_add_department( department_parentPath.value, value)
        await handle_department(plotId)//获取初始部门列表
      })
      .catch(() => {
        message(t('取消添加部门'), {type: 'error'})
      })
}


onMounted(() => {
  handle_department(plotId)//获取初始部门列表

})
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
  height: 85vh;
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

    //overflow-x: auto;
  }


}

:deep(.el-tree-node__content) {
  &:hover {
    color: #3B81F4;
    font-weight: 700;

    .showIcon {
      opacity: 1;
    }
  }
}

.showIcon {
  opacity: 0;
}

.showIcon_top {
  display: flex;

  .custom_image {
    cursor: pointer;
    width: 20px;
    height: 20px;
  }
}

:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: #FFEAEB !important;
  color: #D42A30;
}
</style>
