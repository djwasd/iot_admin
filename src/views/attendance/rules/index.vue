<template>
  <div class="rules">
    <div class="rules_title">{{ t('考勤规则') }}</div>
    <div class="rules_function">
      <el-button type="primary" @click="handle_rules">{{ t('新建规则') }}</el-button>
    </div>
    <div class="rules_table">
      <el-table
          :data="attendance_data.records"
          style="width: 100%"
      >
        <el-table-column :label="t('规则名称')" prop="name"/>
        <el-table-column :label="t('考勤类型')" prop="type">
          <template #default="{row}">
            {{ row.type === 1 ? t('固定班制') : row.type === 2 ? t('排版制') : t('自由班制') }}
          </template>
        </el-table-column>
        <el-table-column :label="t('节假日排休')" prop="isHolidayOff">
          <template #default="{row}">
            {{ row.isHolidayOff === true ? t('是') : t('否') }}
          </template>
        </el-table-column>
        <el-table-column :label="t('加班统计')" prop="isOvertimeStat">

          <template #default="{row}">
            {{ row.isOvertimeStat === true ? t('是') : t('否') }}
          </template>
        </el-table-column>
        <el-table-column :label="t('考勤人员')" prop="zip">
          <template #default="{row}">
            <div class="see_table" @click="handle_view(row)"> {{ $t('查看') }}</div>
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
          :total="attendance_data.total"
          layout="prev, pager, next, jumper"
          @current-change="handleCurrentChange"
      />
    </div>
    <drawer_dia :drawer_flag="drawer_data" @save="handle_drawer"></drawer_dia>
    <personnel_dialog :id="person_dia.attendance.id"
                      :data="person_dia.attendance.personList"
                      :dialog="person_dia.dialog"
                      :status="person_dia.status"
                      :view="person_dia.view"
                      @save_dialog='handle_save_dialog'></personnel_dialog>
  </div>

</template>


<script lang="ts" setup>
import drawer_dia from '../component/drawer/index.vue'
import {useLocalesI18n} from "@/locales/hooks";
import {attendance_add, attendance_del, attendance_put, rules_page} from "@/api/attendance";
import {useUserStore} from "@/store";
import {message} from "@/utils/components/message";
import personnel_dialog from '../component/personnel_dialog/index.vue'

import {filter_data, filterObject} from "@/utils/packagingmethod/utils";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'attendance']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId //项目组织id

const drawer_data = ref({
  drawer: false,
  status: '',
  attendance: {}
})

const person_dia = ref({
  dialog: false,
  status: '',
  attendance: {
    is: '',
    personList: []
  },
  view: ''
})
const attendance_data = ref({
  "current": 0,
  "pages": 0,
  "records": [
    {
      "attendanceRuleDeviceList": [],
      "attendanceRuleSchedulingList": [],
      "holidayPlanId": '1',
      "holidayPlanName": "",
      "id": 0,
      "isAutomaticShiftAlignment": false,
      "isHolidayOff": false,
      "isOvertimeStat": false,
      "isWorkingHoursLimit": false,
      "limitPunchEndTime": '',
      "limitPunchStartTime": '',
      "minWorkTime": 0,
      "name": "",
      "orgList": [],
      "overtimeRuleList": [{
        "minTimeUnit": 0,
        "offDutyPassTime": 0,
        "shortestTime": 0,
        "type": 0
      }],
      "personList": [],
      "specialNotWorkDateList": [],
      "specialWorkDateList": [],
      "type": 0
    }
  ],
  "size": 0,
  "total": 0
}) //接口拿到的数据
const attend_copy = ref({
  "attendanceRuleDeviceList": [],
  "attendanceRuleSchedulingList": [],
  "holidayPlanId": '1',
  "holidayPlanName": "",
  "id": 0,
  "isAutomaticShiftAlignment": false,
  "isHolidayOff": false,
  "isOvertimeStat": false,
  "isWorkingHoursLimit": false,
  "limitPunchEndTime": '',
  "limitPunchStartTime": '',
  "minWorkTime": 0,
  "name": "",
  "orgList": [],
  "overtimeRuleList": [
    {
      "minTimeUnit": 0,
      "offDutyPassTime": 0,
      "shortestTime": 0,
      "type": 0
    }
  ],
  "personList": [],
  "specialNotWorkDateList": [],
  "specialWorkDateList": [],
  "type": 1,
  plotId: plotId
})//新建列表模拟的数据
const current_page = ref(0);//当前页数
const page_size = ref(12); //每页显示条目个数

//切换分页
const handleCurrentChange = async (val: number) => {
  current_page.value = val;
  await rules_data(plotId, current_page.value, page_size.value)
};
//新建规则
const handle_rules = () => {
  console.log('新建规则')
  drawer_data.value.status = 'add'
  drawer_data.value.drawer = true   //是当前抽屉的状态变成true
  drawer_data.value.attendance = JSON.parse(JSON.stringify(attend_copy.value))

}
//删除规则
const handle_view = (row: any) => {
  person_dia.value.status = 'edit'
  person_dia.value.dialog = true   //是当前抽屉的状态变成true
  person_dia.value.attendance = JSON.parse(JSON.stringify(row))
  person_dia.value.view = 'view'


}
const handle_del = (row: any) => {
  console.log('删除规则')
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
        await del_attendance(row.id)
      })
      .catch(() => {
        message(t('取消删除') + t('考勤规则'), {type: 'error'})
      })
}
//编辑规则

const handle_edit = (row: any) => {
  console.log(row, '--row')
  console.log('编辑规则')
  drawer_data.value.status = 'edit'
  drawer_data.value.drawer = true   //是当前抽屉的状态变成true
  drawer_data.value.attendance = JSON.parse(JSON.stringify(row))
}


//查看
const handle_show = () => {
  console.log('查看')

}
//子组件传来的数据
const handle_drawer = (val: boolean, status: string, list: any, drawer_status: string) => {
  drawer_data.value.drawer = val   //是当前抽屉的状态变成true
  if (status === 'cancel') return true
  if (drawer_status === 'edit') {
    list.plotId = plotId
    list.organizationList = []
    put_attendance(filter_data(list))
  } else {
    add_attendance(filterObject(list))
  }
  // drawer_data.value.status = ''
  drawer_data.value.attendance = JSON.parse(JSON.stringify(attend_copy.value))


}
const add_attendance = async (data: any) => {
  const res = await attendance_add(data)
  if (res.data.code === 200) {
    await rules_data(plotId, current_page.value, page_size.value)
    message(t('添加') + t('规则') + t('完成'), {type: 'success'})
  } else {
    message(res.data.message, {type: 'error'})
  }
}
const del_attendance = async (data: any) => {
  const res = await attendance_del({
    id: data
  })
  if (res.data.code === 200) {
    await rules_data(plotId, current_page.value, page_size.value)
    message(t('删除') + t('规则') + t('完成'), {type: 'success'})
  } else {
    message(res.data.message, {type: 'error'})
  }
}
const put_attendance = async (data: any) => {
  const res = await attendance_put(data)
  if (res.data.code === 200) {
    await rules_data(plotId, current_page.value, page_size.value)
    message(t('编辑') + t('规则') + t('完成'), {type: 'success'})
  } else {
    message(res.data.message, {type: 'error'})
  }
}
const rules_data = async (plotId: number, page: number, size: number, name?: string) => {
  const res = await rules_page(plotId, page, size, name)
  if (res.data.code === 200) {
    attendance_data.value = res.data.data
  }
}
onMounted(() => {
  rules_data(plotId, current_page.value, page_size.value)
})

</script>

<style>
.rules {
  width: 100%;
  background-color: #ffffff;

  .rules_title {
    font-size: 18px;
    padding: 20px 0 0 20px;
    font-weight: 700;
  }

  .rules_function {
    padding: 20px;
  }

  .rules_table {
    padding: 0 20px 20px 20px;

    .see_table {
      color: #3b81f4;
      cursor: pointer;
    }
  }

  .pagination {
    padding: 20px 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
