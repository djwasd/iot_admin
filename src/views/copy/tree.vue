<template>
  <div class="container">
    <div class="left">
      <div class="company">{{ t('通行记录') }}</div>
      <div class="company_name">
        <div class="name">
          <!--          <div class="name_left">公</div>-->
          <div class="depart_name">{{ t('所有') }}{{ t('通行记录') }}</div>
        </div>
        <!--        <img class="custom_image" src="@/assets/images/png/add.png" style="cursor: pointer" @click="handle_add">-->
      </div>
      <div class="tree">
        <el-tree
            :data="departmental_date"
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

            </div>


          </template>
        </el-tree>
      </div>
    </div>
    <div class="right">
      11111
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useLocalesI18n} from "@/locales/hooks";
import {actions_list} from "@/api/person";
import {useUserStore} from "@/store";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'authorization']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
console.log(plotId, '--plotId')
const depart_name = UserStore.user.plotName
const departmental_date = ref([])

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
  console.log('点击部门列表')
}

//初始化获取部门列表
const handle_department = async (plotId: any) => {
  const res = await actions_list(plotId)
  if (res.data.code === 200) {
    departmental_date.value = res.data.data
  }
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
