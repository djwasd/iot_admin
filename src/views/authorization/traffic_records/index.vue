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
      <div class="person">
        <div class="function">
          <div class="function_left">
            <el-date-picker
                v-model="picker_time"
                :end-placeholder="t('结束日期')"
                :start-placeholder="t('开始日期')"
                format="YYYY-MM-DD HH:mm:ss"
                type="datetimerange"
                value-format="x"
            />
            <el-button style="margin-left:5px " type="primary" @click="handle_serach">{{ t('搜索') }}</el-button>

          </div>
          <div class="function_right">
            <div class="search-wrapper">
              <el-input
                  v-model="search_person"
                  :placeholder="t('请输入姓名或ID')"
              >
                <template #append>
                  <el-button icon="mel-icon-search" @click="handle_search_right"/>
                </template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="table-wrapper">
          <el-table
              ref="multiple_Ref"
              :data="records_data.records"
              style="width: 100%"

          >
            <el-table-column
                :index="set_index"
                :label="t('序号')"
                prop="Number"
                type="index"
                width="100"
            >
            </el-table-column>
            <el-table-column label="ID" prop="personId" width="100"/>
            <el-table-column :label="t('姓名')" prop="personName" width="100"/>
            <el-table-column :label="t('识别模式')" prop="passType"/>
            <el-table-column :label="t('抓拍照片')" prop="wcsEventFileUuid">
              <template #default="{ row }">
                <el-image
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="[git_pic(row)]"
                    :preview-teleported="true"
                    :src="git_pic(row)"
                    :zoom-rate="1.2"
                    fit="cover"
                    style="width: 20px; height: 20px"
                >
                </el-image>
              </template>
            </el-table-column>
            <el-table-column :label="t('通勤时间')" prop="passTime"/>
            <el-table-column :label="t('状态')" prop="result">
              <template #default="{ row }">
                <span :style="applyStatusStyle(row.result)">{{ row.result == 2 ? t('成功') : t('失败') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="t('操作')" fixed="right" width="200">
              <template #default="{row}">
                <el-button size="small" type="primary">{{ t('查看详情') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
              v-model:current-page="current_page"
              v-model:page-size="page_size"
              :total="records_data.total"
              layout="prev, pager, next, jumper"
              @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useLocalesI18n} from "@/locales/hooks";
import {actions_list} from "@/api/person";
import {useUserStore} from "@/store";
import {traffic_list} from "@/api/authorization";
import no_pic from "@/assets/images/png/no_pic.png";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'authorization']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const depart_name = UserStore.user.plotName
const departmental_date = ref([
  {
    id: '0'
  }
])
const current_page = ref(0);//当前页数
const page_size = ref(10); //每页显示条目个数
const picker_time = ref([new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 59)])
const search_person = ref<string>('')
const records_data = ref({
  "current": 0,
  "pages": 0,
  "records": [
    {
      "cardNo": "string",
      "cardType": "string",
      "deviceAddress": "string",
      "deviceName": "string",
      "devicePath": "string",
      "direct": "string",
      "id": 0,
      "passTime": "string",
      "passType": "string",
      "personId": 0,
      "personName": "string",
      "result": 0,
      "wcsEventFileUuid": "string"
    }
  ],
  "size": 0,
  "total": 0
})
const tree_node = ref('0')


const defaultProps = {
  children: 'children',
  label: 'name',
  id: 'id'
}
const applyStatusStyle = (applyStatus: any) => {
  const statusColors = {
    3: 'orange',
    2: 'green',
    default: 'red'
  };

  const color = statusColors.hasOwnProperty(applyStatus) ? statusColors[applyStatus] : statusColors.default;

  return {color};
}
//点击tree
const handleNodeClick = async (data: any) => {
  console.log('点击部门列表')
  tree_node.value = data.id
  await traffic_all(plotId, tree_node.value, current_page.value, page_size.value, picker_time.value[0], picker_time.value[1], search_person.value)


}
const handle_serach = async () => {
  await traffic_all(plotId, tree_node.value, current_page.value, page_size.value, picker_time.value[0], picker_time.value[1], search_person.value)
}
const handleCurrentChange = async (val: number) => {
  current_page.value = val;
  await traffic_all(plotId, tree_node.value, current_page.value, page_size.value, picker_time.value[0], picker_time.value[1], search_person.value)
};
const handle_search_right = async () => {
  await traffic_all(plotId, tree_node.value, current_page.value, page_size.value, picker_time.value[0], picker_time.value[1], search_person.value)

}
//初始化获取部门列表
const handle_department = async (plotId: any) => {
  const res = await actions_list(plotId)
  if (res.data.code === 200) {
    departmental_date.value = res.data.data
    tree_node.value = departmental_date.value[0].id
  }
}
const traffic_all = async (plotId: number, organizationId: string, page: number, size: number, startTimestamp?: number, endTimestamp?: number, name?: string) => {
  const res = await traffic_list(plotId, organizationId, page, size, startTimestamp, endTimestamp, name)
  if (res.data.code === 200) {
    records_data.value = res.data.data
  }
}
//获取table照片
const git_pic = (row: any) => {
  if (row.wcsEventFileUuid) {
    // const res =  records_photo(row.wcsEventFileUuid);
    // console.log(res,'--res')
    const ipAddress = window.location.host;
    const url = `http://${ipAddress}/operation/cloud/web/sys/api/v1/attachment/actions/download/wcs?uuid=${row.wcsEventFileUuid}`;
    return url
  }
  return no_pic;
};
const set_index = (index: number) => {
  if (current_page.value >= 1) {
    return (current_page.value - 1) * page_size.value + index + 1

  } else {
    return (current_page.value) * page_size.value + index + 1

  }
}
onMounted(async () => {
  await handle_department(plotId)//获取初始部门列表
  await traffic_all(plotId, tree_node.value, current_page.value, page_size.value, picker_time.value[0], picker_time.value[1])


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
          color: #3B81F4;
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
      height: 85vh;
      //padding: 16px;
      background-color: #ffffff;

      .device {
        font-size: 18px;
        padding: 20px 0 0 20px;
        font-weight: 700;
      }

      .function {
        padding: 20px;
        display: flex;
        justify-content: space-between;

        .function_left {
          .dropdown {
            margin: 0 10px;
          }

          .form {
            display: flex;

            .form_item {
              margin-right: 10px;
            }
          }
        }

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

      }

      .table-wrapper {
        padding-left: 20px;
      }

      .pagination {
        padding: 20px 20px;
        display: flex;
        justify-content: flex-end;
      }

    }

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
