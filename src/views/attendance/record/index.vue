<template>
  <div class="container">
    <div class="left">
      <div class="company">{{ t('考勤记录') }}</div>
      <div class="company_name " style="cursor: pointer" @click="handle_add">
        <div class="name">
          <div class="name">{{ t('所有') + t('考勤记录') }}</div>
        </div>
        <!--        <img class="custom_image" src="@/assets/images/png/add.png" >-->
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
                v-model="time"
                :end-placeholder="t('结束日期')"
                :start-placeholder="t('开始日期')"
                class="left_select"
                format="YYYY-MM-DD HH:mm:ss"
                type="datetimerange"
                value-format="x"
            />
            <el-button class="left_button" type="primary" @click="handle_festival">{{ t('查询') }}</el-button>
            <el-button @click="handle_import">{{ t('考勤导出') }}</el-button>

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
          <el-table :data="actions_data.records" style="width: 100%">
            <el-table-column
                :index="set_index"
                :label="t('序号')"
                prop="Number"
                type="index"
                width="80"
            >
            </el-table-column>
            <el-table-column :label="t('ID')" prop="personId" width="150"/>
            <el-table-column :label="t('姓名')" prop="personName"/>
            <el-table-column :label="t('识别模式')" prop="recognitionType">
              <template #default="{row}">
                {{ row.recognitionType === 1 ? t('人脸') : row.recognitionType === 2 ? t('指纹') : t('门禁') }}
              </template>
            </el-table-column>
            <el-table-column :label="t('抓拍照片')" prop="startAttachmentId">
              <template #default="{row}">
                <el-image
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="[git_pic(row)]"
                    :src="git_pic(row)"
                    :zoom-rate="1.2"
                    fit="cover"
                    style="width: 40px; height: 40px"
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
            <el-table-column :label="t('上班考勤时间')" prop="startTimestamp">
              <template #default="{row}">
                {{ format_data(row.startTimestamp) }}
              </template>
            </el-table-column>
            <el-table-column :label="t('下班考勤时间')" prop="endTimestamp">
              <template #default="{row}">
                {{ format_data(row.endTimestamp) }}
              </template>
            </el-table-column>
            <el-table-column :label="t('状态')" prop="status">
              <template #default="{row}">
                {{ getStatusText(row) }}
              </template>
            </el-table-column>

          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
              v-model:current-page="current_page"
              v-model:page-size="page_size"
              :total="actions_data.total"
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
import {actions_import, actions_page} from "@/api/attendance";
import no_pic from "@/assets/images/png/no_pic.png";
import {format_data} from "@/utils/packagingmethod/time";
import {download_excel} from "@/utils/packagingmethod/utils";
import {message} from "@/utils/components/message";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'attendance']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const departmental_date = ref([
  {id: '0'}
])
const tree_node = ref('0')
const actions_data = ref({
  "current": 0,
  "pages": 0,
  "records": [
    {
      "additionStatus": 0,
      "deviceId": 0,
      "deviceName": "string",
      "endAttachmentId": 0,
      "endTimestamp": 0,
      "id": 0,
      "personId": 0,
      "personName": "string",
      "recognitionType": 0,
      "startAttachmentId": 0,
      "startTimestamp": 0,
      "status": 0
    }
  ],
  "size": 0,
  "total": 0
})
const current_page = ref(0);//当前页数
const page_size = ref(12); //每页显示条目个数
const defaultProps = {
  children: 'children',
  label: 'name',
  id: 'id'
}
const time = ref([])
const search_person = ref('')//搜索字段
//tbale状态优化
const getStatusText = (row: any) => {
  const statusLabels: { [key: number]: string } = {
    0: t('正常'),
    1: t('迟到'),
    3: t('早退'),
    7: t('缺卡'),
    9: t('旷工'),
    15: t('正常-加班'),
    4: t('迟到-早退'),
    8: t('迟到-缺卡'),
    16: t('迟到-加班'),
    10: t('早退-缺卡'),
    22: t('缺卡-加班'),

  };

  return statusLabels[row.status] || t('异常');
};
//点击tree
const handleNodeClick = async (data: any) => {
  tree_node.value = data.id //当前点击的树id
  await actions_init(tree_node.value, current_page.value, page_size.value, time.value[0], time.value[1], search_person.value)

}
const handle_festival = async () => {
  await actions_init(tree_node.value, current_page.value, page_size.value, time.value[0], time.value[1], search_person.value)

}
const handleCurrentChange = async (val: number) => {
  current_page.value = val;
  await actions_init(tree_node.value, current_page.value, page_size.value, time.value[0], time.value[1], search_person.value)

};
const set_index = (index: number) => {
  if (current_page.value >= 1) {
    return (current_page.value - 1) * page_size.value + index + 1

  } else {
    return (current_page.value) * page_size.value + index + 1

  }
}
const git_pic = (row: any) => {
  if (row.startAttachmentId) {
    // const res =  upload_person(row.facePicture);
    const ipAddress = window.location.host;
    const url = `http://${ipAddress}/operation/cloud/web/sys/api/v1/attachment/actions/download?file_id=${row.startAttachmentId}`;
    return url
  }
  return no_pic;
};

const handle_search = async () => {
  await actions_init(tree_node.value, current_page.value, page_size.value, time.value[0], time.value[1], search_person.value)

}
//初始化获取部门列表
const handle_department = async (plotId: any) => {
  const res = await actions_list(plotId)
  if (res.data.code === 200) {
    departmental_date.value = res.data.data
    tree_node.value = departmental_date.value[0].id
  }
}

const actions_init = async (
    orgId: string,
    page: any,
    size: any,
    startTimestamp?: number,
    endTimestamp?: number,
    name?: string) => {
  const res = await actions_page(orgId, page, size, startTimestamp, endTimestamp, name)
  if (res.data.code === 200) {
    actions_data.value = res.data.data
  }
}
//考勤导出
const handle_import = async () => {
  await import_actions(tree_node.value, current_page.value, page_size.value, time.value[0], time.value[1], search_person.value)
}
const import_actions = async (
    orgId: string,
    page: any,
    size: any,
    startTimestamp?: number,
    endTimestamp?: number,
    name?: string) => {
  const res = await actions_import(orgId, page, size, startTimestamp, endTimestamp, name)
  console.log(res, '--res')
  if (res.data.code === 200) {
    let excel = t('考勤记录表')
    download_excel(res.data, excel);
  } else {
    message(t('没有数据需要导出!'), {type: 'error'})
  }

}
onMounted(async () => {
  await handle_department(plotId)//获取初始部门列表
  await actions_init(tree_node.value, current_page.value, page_size.value)
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
            margin: 0 10px 0 20px;

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

    .demo_ruleForm {
      .form_icon {
        padding: 0 20px 0 10px;
      }

      .form_minus {
        padding-left: 10px;
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

:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: #FFEAEB !important;
  color: #D42A30;
}
</style>
