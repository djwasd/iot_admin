<template>
  <div class="container">
    <div class="left">
      <div class="company">{{ t('节假日管理') }}</div>
      <div class="company_name " style="cursor: pointer" @click="handle_add_plans">
        <div class="name">
          <div class="name">{{ t('新建节假日') }}</div>
        </div>
        <img class="custom_image" src="@/assets/images/png/add.png">
      </div>
      <div class="tree">
        <el-tree
            :data="plans_data.records"
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
      <div class="person">
        <div class="function">
          <div class="function_left">
            <el-select
                v-model="holi_year"
                class="left_select"
                placeholder="Select"
                @change="handle_year"
            >
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
            <el-button type="primary" @click="handle_festival">{{ t('新建节日') }}</el-button>
          </div>
          <div class="function_right">
            <div class="search-wrapper">
              <el-input
                  v-model="search_person"
                  :placeholder="t('请输入节假日名称或ID')"
              >
                <template #append>
                  <el-button icon="mel-icon-search" @click="handle_search"/>
                </template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="table-wrapper">
          <el-table :data="holiday_list_data.records" style="width: 100%">
            <el-table-column :label="t('节假日名称')" prop="name" width="200"/>
            <el-table-column :label="t('开始日期')" prop="startTime" width="200">

            </el-table-column>
            <el-table-column :label="t('结束日期')" prop="endTime" width="200">

            </el-table-column>
            <el-table-column :label="t('放假天数')" prop="days" width="150">
              <template #default="{row}">
                {{ row.days }}{{ t('天') }}
              </template>
            </el-table-column>
            <el-table-column :label="t('补班日期')" prop="address" show-overflow-tooltip>
              <template #default="{row}">
                {{
                  row.paidDays
                      .map((paidDay) => paidDay.holidayTime || "-")
                      .join(", ")
                }}
              </template>
            </el-table-column>
            <el-table-column :label="t('操作')" fixed="right" width="120">
              <template #default="{row}">
                <el-button link size="small" type="primary" @click="handle_edit(row)">{{ t('编辑') }}</el-button>
                <el-button link size="small" type="primary" @click="handle_del(row)"> {{ t('删除') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
              v-model:current-page="current_page"
              v-model:page-size="page_size"
              :total="holiday_list_data.total"
              layout="prev, pager, next, jumper"
              @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <el-dialog
        v-model="dialog_visible"
        :before-close="handle_close"
        class="dialog_css"
        width="600"
    >
      <template #header>
        <div class="dialog_header">
          {{ t('新建节日') }}
        </div>
        <div class="dialog_buttom"></div>
      </template>
      <el-form
          ref="rule_ref"
          :model="ruleForm"
          :rules="rules"
          class="demo_ruleForm"
          label-width="auto"
          status-icon
          style="max-width: 600px"
      >
        <el-form-item :label="t('节日名称')" prop="name">
          <el-input v-model="ruleForm.name" style="width: 220px;"/>
        </el-form-item>
        <el-form-item :label="t('年份')" prop="year">
          <el-select
              v-model="ruleForm.year"
              :placeholder="t('请选择年份')"
              class="left_select"
              style="width: 220px;"
          >
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('开始日期')" :placeholder="t('请输入节假日名称')" prop="startTimestamp">
          <el-date-picker v-model="ruleForm.startTimestamp"
                          :placeholder="t('请选择日期')"
                          type="date"
                          value-format="x"
          />
        </el-form-item>
        <el-form-item :label="t('结束日期')" :placeholder="t('请输入节假日名称')" prop="endTimestamp">
          <el-date-picker v-model="ruleForm.endTimestamp" :placeholder="t('请选择日期')" type="date" value-format="x"/>
        </el-form-item>
        <el-form-item v-if="ruleForm.coverShiftTimestampList.length===0" :label="t('添加补班日期')">
          <el-button type="primary" @click="handle_add_picker">{{ t('添加') }}</el-button>
        </el-form-item>
        <el-form-item v-for="(item, index) in ruleForm.coverShiftTimestampList" v-else :key="index"
                      :label="t('补班日期')+` ${index + 1}`" prop="value">
          <el-date-picker v-model="item.value" :placeholder="t('请选择日期')" type="date" value-format="x"/>
          <me-icon-plus_sign v-if="index === ruleForm.coverShiftTimestampList.length - 1 " class="form_icon"
                             @click="handle_add_picker"/>
          <me-icon-minus_sign v-if="ruleForm.coverShiftTimestampList.length  " class="form_minus"
                              @click="handle_minus_picker(index)"/>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handle_close">{{ t('取消') }}</el-button>
          <el-button type="primary" @click="handle_save">{{ t('确认') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {useLocalesI18n} from "@/locales/hooks";
import {useUserStore} from "@/store";
import {message} from "@/utils/components/message";
import {type FormInstance, FormRules} from "element-plus";
import {
  add_holiday,
  add_plan,
  del_holiday,
  del_plan,
  edit_plan,
  eidt_holiday,
  holiday_list,
  holiday_plan
} from "@/api/attendance";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'attendance']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const options = ref([

  {
    value: '2022',
    label: '2022',
  },
  {
    value: '2023',
    label: '2023',
  },
  {
    value: '2024',
    label: '2024',
  },
  {
    value: '2025',
    label: '2025',
  },
])
const holi_year = ref<string>('2024')
const dialog_visible = ref<boolean>(false)
const rule_ref = ref<FormInstance>(); //拿到当前ref实力
const ruleForm = ref({
  name: '',
  startTimestamp: '',
  endTimestamp: '',
  year: '2024',
  coverShiftTimestampList: []
})
const search_person = ref('')
const ruleForm_date = ref({
  name: '',
  startTimestamp: '',
  endTimestamp: '',
  year: '2024',
  coverShiftTimestampList: []
})
const plan_status = ref('')//当前状态添加还是编辑
const tree_node = ref('')
const rules = computed<FormRules>(() => ({
  name: [
    {required: true, message: t('节日名称') + t('不能为空'), trigger: 'blur'},
  ],
  year: [
    {required: true, message: t('年份') + t('不能为空'), trigger: 'blur'},
  ],
  startTimestamp: [
    {required: true, message: t('开始日期') + t('不能为空'), trigger: 'blur'},
  ],
  endTimestamp: [
    {required: true, message: t('结束日期') + t('不能为空'), trigger: 'blur'},
    {validator: validate_time, trigger: 'blur'}
  ],

}));
const validate_time = (
    rule: any,
    value: string,
    callback: (error?: Error) => void
) => {
  console.log(value, '--value')
  console.log(ruleForm.value.startTimestamp, '--startTimestamp')
  if (value < ruleForm.value.startTimestamp) {
    callback(new Error(t('结束时间不能小于开始时间')));
  } else {
    callback();
  }
};

const plans_data = ref({
  "records": [
    {
      "id": "1",
      "name": "中国大陆法定节假日",
      "sort": 0
    }
  ],
  "total": 1,
  "size": 10,
  "current": 1,
  "orders": [],
  "optimizeCountSql": true,
  "searchCount": true,
  "maxLimit": null,
  "countId": null,
  "pages": 1
})// 当前假日计划列表
const holiday_plan_id = ref<string>('')
const holiday_list_data = ref({
  records: [
    {
      id: "7",
      name: "劳动节",
      days: "5",
      startTime: "2024-05-01",
      endTime: "2024-05-05",
      startTimestamp: 1714492800000,
      endTimestamp: 1714492800000,
      paidDays: [
        {
          holidayTime: "2024-05-01",
          holidayTimestamp: 1714492800000
        },
        {
          holidayTime: "2024-05-02",
          holidayTimestamp: 1714579200000
        },
        {
          holidayTime: "2024-05-03",
          holidayTimestamp: 1714665600000
        },
        {
          holidayTime: "2024-05-04",
          holidayTimestamp: 1714752000000
        },

      ]
    },
  ],
  total: 7,
  size: 12,
  pages: 1
})//拿到当前节日数据
const current_page = ref(0);//当前页数
const page_size = ref(12); //每页显示条目个数
const defaultProps = {
  children: 'children',
  label: 'name',
  id: 'id'
}

//搜索
const handle_search = async () => {
  console.log('search_person.value', search_person.value)

  console.log('搜索')
  await holiday_list_all(tree_node.value, current_page.value, page_size.value, holi_year.value, search_person.value)
}
const handle_year = async (value) => {
  await holiday_list_all(tree_node.value, current_page.value, page_size.value, value, search_person.value)

}
//切换分页
const handleCurrentChange = async (val: number) => {
  current_page.value = val;
  await holiday_list_all(tree_node.value, current_page.value, page_size.value, holi_year.value, search_person.value)
};
//补班日期添加
const handle_add_picker = () => {
  console.log("添加日期");
  ruleForm.value.coverShiftTimestampList.push({});

};
//补班日期删除
const handle_minus_picker = (index: number) => {
  console.log("删除日期");
  ruleForm.value.coverShiftTimestampList.splice(index, 1);
};
//dialog确认按钮
const handle_save = () => {
  rule_ref.value?.validate(async (valid, fields) => {
    if (valid) {

      if (ruleForm.value.coverShiftTimestampList.length !== 0) {
        ruleForm.value.coverShiftTimestampList = ruleForm.value.coverShiftTimestampList
            .filter(item => item.value !== '') // 过滤掉value为''的项
            .map(item => item.value); // 提取时间戳值
      } else {
        ruleForm.value.coverShiftTimestampList = []
      }
      if (plan_status.value === 'add') {
        await holiday_add(ruleForm.value)
      } else {
        await holiday_edit(ruleForm.value)
      }
      console.log(ruleForm.value, '--ruleForm.value')
      dialog_visible.value = false
    } else {
      console.log('提交错误', fields);
    }
  });
}
const handle_close = () => {
  if (!rule_ref.value) return
  rule_ref.value.resetFields()
  dialog_visible.value = false
}
//新建节日
const handle_festival = () => {
  console.log('新建节日')
  ruleForm.value = JSON.parse(JSON.stringify(ruleForm_date.value))
  plan_status.value = 'add'

  dialog_visible.value = true

}


//点击tree
const handleNodeClick = async (data: any) => {
  console.log('点击部门列表', data)
  tree_node.value = data.id
  await holiday_list_all(tree_node.value, current_page.value, page_size.value, holi_year.value)

}

const holiday_plan_all = async (plotId: number, name?: string) => {
  const res = await holiday_plan(plotId, name)
  console.log(res, '--res')
  if (res.data.code === 200) {
    plans_data.value = res.data.data
    holiday_plan_id.value = res.data.data.records[0].id
    console.log(holiday_plan_id, '---holiday_plan_id')
  }
}
const handle_add_plans = () => {
  ElMessageBox.prompt(t('请输入') + t('节假日') + t('名称'), t('添加') + t('节假日'), {
    confirmButtonText: t('确认'),
    cancelButtonText: t('取消'),
    inputPattern: /^[\w\u4e00-\u9fa5\!\@#\$\%\^\&\*\(\)\-\+\=\[\]\{\}\|\;\:\'\"\,\.\<\>\/\?]+$/,
    inputErrorMessage: t('不能为空'),

  })
      .then(async ({value}) => {
        await plans_add(value)
      })
      .catch(() => {
        message(t('取消') + t('添加') + t('授权组'), {type: 'error'})
      })
}

const handleCommand = (command: string, data: any) => {
  console.log('Command:', command);
  if (command === 'edit') {
    ElMessageBox.prompt(t('请输入') + t('节假日') + t('名称'), t('编辑') + t('节假日'), {
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      inputPattern: /^[\w\u4e00-\u9fa5\!\@#\$\%\^\&\*\(\)\-\+\=\[\]\{\}\|\;\:\'\"\,\.\<\>\/\?]+$/,
      inputErrorMessage: t('不能为空')
    })
        .then(async ({value}) => {
          await plans_edit(data.id, value)
        })
        .catch(() => {
          message(t('取消编辑部门'), {type: 'error'})
        })
  } else {
    ElMessageBox.confirm(
        data.name + t('删除') + t('节假日计划'),
        t('删除') + t('节假日计划'),
        {
          confirmButtonText: t('确认'),
          cancelButtonText: t('取消'),
          type: 'warning',
        }
    )
        .then(async () => {
          if (data.name === t('中国大陆法定节假日')) {
            message(data.name + t('不能删除'), {type: "error"})
            return true
          }
          await plans_del(data.id)
        })
        .catch(() => {
          message(t('取消删除部门'), {type: 'error'})
        })
  }
  console.log(data, '--data')


}
//编辑节假日假话
const plans_edit = async (id: string, name: string) => {
  const res = await edit_plan({
    id: id,
    name: name
  })
  if (res.data.code === 200) {
    await holiday_plan_all(plotId)//获取初始部门列表

    message(t('编辑') + t('节假日') + t('成功'), {type: 'success'})
  } else {
    message(res.data.message, {type: 'error'})

  }
}
//删除节假日
const plans_del = async (id: string) => {
  const res = await del_plan({
    id: id,

  })
  if (res.data.code === 200) {
    await holiday_plan_all(plotId)//获取初始部门列表

    message(t('删除') + t('节假日') + t('成功'), {type: 'success'})
  } else {
    message(res.data.message, {type: 'error'})

  }
}
//新增节假日假话
const plans_add = async (name: string) => {
  const res = await add_plan({
    plotId: plotId,
    name: name
  })
  if (res.data.code === 200) {
    await holiday_plan_all(plotId)//获取初始部门列表

    message(t('添加') + t('节假日') + t('成功'), {type: 'success'})
  } else {
    message(res.data.message, {type: 'error'})

  }
}
// //编辑
const handle_edit = (row: any) => {
  plan_status.value = 'edit'
  ruleForm.value = JSON.parse(JSON.stringify(row))

  if (row.paidDays.length === 0) {
    ruleForm.value.coverShiftTimestampList = row.paidDays
  } else {
    ruleForm.value.coverShiftTimestampList = row.paidDays.map(item => ({value: item.holidayTimestamp}))
  }
  console.log(ruleForm.value, '--coverShiftTimestampList')
  dialog_visible.value = true

}
// 编辑节日 eidt_holiday
const holiday_edit = async (data: any) => {
  const res = await eidt_holiday({
    coverShiftTimestampList: data.coverShiftTimestampList,
    endTimestamp: data.endTimestamp,
    name: data.name,
    startTimestamp: data.startTimestamp,
    year: data.year,
    id: data.id
  })
  if (res.data.code === 200) {
    await holiday_list_all(tree_node.value, current_page.value, page_size.value, holi_year.value, search_person.value)
    message(t('编辑') + t('节日') + t('成功'), {type: "success"})
  } else {
    message(res.data.message, {type: "error"})

  }
}

const holiday_del = async (id: any) => {
  const res = await del_holiday({
    id: id
  })
  if (res.data.code === 200) {
    await holiday_list_all(tree_node.value, current_page.value, page_size.value, holi_year.value, search_person.value)
    message(t('删除') + t('节日') + t('成功'), {type: "success"})
  } else {
    message(res.data.message, {type: "error"})

  }
}
const handle_del = (row) => {
  ElMessageBox.confirm(
      row.name + t('将被删除,是否确认?'),
      t('删除') + t('节假日'),
      {
        confirmButtonText: t('确认'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(async () => {
        await holiday_del(row.id)
      })
      .catch(() => {
        message(t('取消删除') + t('节假日'), {type: 'error'})
      })
}


//新增节日
const holiday_add = async (data: any) => {
  const res = await add_holiday({
    coverShiftTimestampList: data.coverShiftTimestampList,
    endTimestamp: data.endTimestamp,
    holidayPlanId: tree_node.value,
    name: data.name,
    startTimestamp: data.startTimestamp,
    year: data.year,
  })
  if (res.data.code === 200) {
    await holiday_list_all(tree_node.value, current_page.value, page_size.value, holi_year.value, search_person.value)
    message(t('新建') + t('节日') + t('成功'), {type: "success"})
  } else {
    message(res.data.message, {type: "error"})

  }
}

//获取假日列表
const holiday_list_all = async (holidayPlanId: string, page: number, size: number, year: string, name?: string) => {
  const res = await holiday_list(holidayPlanId, page, size, year, name)
  if (res.data.code === 200) {
    holiday_list_data.value = res.data.data
  }
}
onMounted(async () => {
  await holiday_plan_all(plotId)//获取初始部门列表
  await holiday_list_all(holiday_plan_id.value, current_page.value, page_size.value, holi_year.value)

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
        }
      }

      .pagination {
        padding: 16px 0;
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
