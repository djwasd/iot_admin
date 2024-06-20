<template>
  <div class="container">
    <div class="left">
      <div class="company">{{t('考勤记录')}}</div>
      <div class="company_name " style="cursor: pointer" @click="handle_add">
        <div class="name">
          <div class="name">{{t('所有')+t('考勤记录')}}</div>
        </div>
<!--        <img class="custom_image" src="@/assets/images/png/add.png" >-->
      </div>
      <div class="tree">
        <el-tree
            :data="departmental_date"
            :props="defaultProps"
            class="full-height"
            @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">

            <div class="custom_top">
              <div class="custom_content">
                <mel-icon-menu class="custom_img"></mel-icon-menu>
                <!--            <img class="custom_img" src="@/assets/images/png/menu.png">-->
                <div style="margin-left: 5px">{{ node.label }}</div>
              </div>

            </div>


          </template>
        </el-tree>
      </div>
    </div>
    <div class="right">
      <div class="person">
        <div class="function">

          <div class="function_left">
            <el-date-picker
                v-model="value2"
                type="daterange"
                class="left_select"
                :start-placeholder="t('开始日期')"
                :end-placeholder="t('结束日期')"
            />
            <el-button  @click="handle_festival"  class="left_button"  type="primary">{{ t('查询') }}</el-button>
            <el-button  @click="handle_festival"    >{{ t('考勤导出') }}</el-button>

          </div>
          <div class="function_right">
            <div class="search-wrapper">
              <el-input
                  v-model="search_person"
                  :placeholder="t('请输入姓名或ID')"
              >
                <template #append>
                  <el-button  icon="mel-icon-search" />
                </template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="table-wrapper">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column  prop="date" :label="t('节假日名称')" width="150" />
            <el-table-column prop="name" :label="t('开始日期')" width="120" />
            <el-table-column prop="state" :label="t('结束日期')" width="120" />
            <el-table-column prop="city" :label="t('放假天数')" width="120" />
            <el-table-column prop="address" show-overflow-tooltip :label="t('补班日期')" width="200" />
            <el-table-column prop="zip" label="Zip" width="120" />
            <el-table-column fixed="right" label="Operations" width="120">
              <template #default>
                <el-button link type="primary" size="small" >{{t('编辑')}}</el-button>
                <el-button link type="primary" size="small"> {{t('删除')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {useLocalesI18n} from "@/locales/hooks";
const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'attendance']);

const departmental_date = ref([])
const tree_node = ref([])




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
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Home',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Office',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Home',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Office',
  },
]
//点击tree
const handleNodeClick = (data: any) => {
  tree_node.value = data
}

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
        padding-left: 5px;
        color: #3B81F4;

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

    .person {
      width: 100%;
      padding: 16px;

      .function {
        padding: 50px 0 30px 0;
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
          .left_select {
            width: 120px;
            padding: 0 10px 0 0;
          }
          .left_button {
            margin: 0 10px 0 20px ;

          }
        }
      }
    }

    //overflow-x: auto;
  }

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
      width:100%;

    }
    .demo_ruleForm{
      .form_icon {
        padding: 0 20px 0 10px;
      }
      .form_minus {
        padding-left: 10px ;
      }
    }
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
</style>
