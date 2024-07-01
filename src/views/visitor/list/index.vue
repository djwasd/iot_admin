<template>
  <div class="person">
    <div class="device">{{ t('访客列表') }}</div>
    <div class="function">
      <div class="function_left">
        <el-form ref="form_ref" :model="form_list" class="form" label-width="auto">

          <!--          <el-form-item :label="t('访客')+t('名称')" class="form_item">-->
          <!--            <el-input v-model="form_list.visitName" :placeholder="t('请输入')+t('访客')+t('名称')"/>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item :label="t('被访问')+t('名称')" class="form_item">-->
          <!--            <el-input v-model="form_list.visitName" :placeholder="t('请输入')+t('被访问')+t('名称')"/>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item class="form_item" :label="t('来访时间')">-->
          <!--            <el-date-picker-->
          <!--                v-model="form_list.time"-->
          <!--                type="datetimerange"-->
          <!--                :start-placeholder="t('开始日期')"-->
          <!--                :end-placeholder="t('结束日期')"-->
          <!--                format="YYYY-MM-DD HH:mm:ss"-->
          <!--                value-format="x"-->
          <!--            />-->
          <!--          </el-form-item>-->

          <el-form-item class="form_item">
            <el-button type="primary" @click="handle_add_list">{{ t('添加访客') }}</el-button>
          </el-form-item>
          <el-form-item class="form_item">
            <el-button @click="handle_deletion">{{ t('批量删除') }}</el-button>
          </el-form-item>
          <!--          <el-form-item class="form_item" >-->
          <!--            <el-button >{{t('重置')}}</el-button>-->
          <!--          </el-form-item>-->

        </el-form>
      </div>

    </div>
    <div class="table-wrapper">
      <el-table
          ref="multiple_Ref"
          :data="visit_data.records"
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
            width="80"
        >
        </el-table-column>
        <el-table-column :label="t('访客')+t('名称')" prop="visitorName"/>
        <el-table-column :label="t('拜访对象')" prop="interviewee"/>
        <el-table-column :label="t('来访事由')" prop="visitReason"/>
        <el-table-column :label="t('通行照片')" prop="visitorFacePicture">
          <template #default="{ row }">
            <el-image
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[git_pic(row)]"
                :preview-teleported="true"
                :src="git_pic(row)"
                :zoom-rate="1.2"
                fit="cover"
                style="width: 30px; height: 30px"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column :label="t('申请时间')" prop="applyTimestamp">
          <template #default="{ row }">
            {{ format_data(row.applyTimestamp) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('操作')" fixed="right" width="200">
          <template #default="{row,$index}">
            <el-button size="small" type="primary" @click="handle_details(row)">{{ t('查看详情') }}</el-button>
            <el-button size="small" type="danger" @click="handle_del(row)">{{ t('删除') }}</el-button>
          </template>

        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
          v-model:current-page="current_page"
          v-model:page-size="page_size"
          :total="visit_data.total"
          layout="prev, pager, next, jumper"
          @current-change="handleCurrentChange"
      />

    </div>
    <drawer :editDate="edit_data"
            :list_dia="drawer_flag"
            :show_status="status_flag"
            @save_list="handle_save_list"
    ></drawer>
  </div>
</template>


<script lang="ts" setup>
import drawer from './component/drawer.vue'
import {useLocalesI18n} from "@/locales/hooks";
import {useUserStore} from "@/store";
import {action_add, action_del, visit_list} from "@/api/visitor";
import {message} from "@/utils/components/message";
import no_pic from "@/assets/images/png/no_pic.png";
import {format_data} from "@/utils/packagingmethod/time";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'visitor']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const current_page = ref(0);//当前页数
const page_size = ref(10); //每页显示条目个数
const form_list = ref({
  visitName: '',//访客名称
  intervieweeName: '',//被访问名称
  time: [],
})
const visit_data = ref({
  "records": [
    {applyTimestamp: 0,}
  ],
  "total": 0,
  "size": 12,
  "current": 1,
  "orders": [],
  "optimizeCountSql": true,
  "searchCount": true,
  "maxLimit": null,
  "countId": null,
  "pages": 0
})
const multipleSelection = ref([]) //选中的人数 可以考虑只传id
const drawer_flag = ref<boolean>(false)
const status_flag = ref('')
const edit_data = ref({})
//添加访客
const handle_add_list = () => {
  status_flag.value = 'add'
  drawer_flag.value = true
}
const handle_save_list = (flag: boolean, status: string, data: any) => {
  drawer_flag.value = flag
  if (status === 'cancel') return true
  if (status_flag.value === 'add') {
    add_action(data)
  }
  status_flag.value = ''
}
//获取table照片
const git_pic = (row: any) => {
  if (row.visitorFacePicture) {
    // const res =  upload_person(row.visitorFacePicture);
    const ipAddress = window.location.host;
    const url = `http://${ipAddress}/operation/cloud/web/sys/api/v1/attachment/actions/download?file_id=${row.visitorFacePicture}`;
    return url
  }
  return no_pic;
};

const handle_details = (row: any) => {
  edit_data.value = row
  status_flag.value = 'edit'
  drawer_flag.value = true
}
const set_index = (index: number) => {
  if (current_page.value >= 1) {
    return (current_page.value - 1) * page_size.value + index + 1

  } else {
    return (current_page.value) * page_size.value + index + 1

  }
}
const handleCurrentChange = async (val: number) => {
  current_page.value = val;
  await visit_all(plotId, current_page.value, page_size.value)

};
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val.map(item => item.id);
  console.log(multipleSelection.value, '--val')
}
const getRowKey = (row: any) => {
  return row.id
}
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
          return message(t('删除人员不能为空'), {type: "error"})

        }
        await del_action(multipleSelection.value)

      })
      .catch(() => {
        message(t('取消批量删除'), {type: "error"})

      })
}
const handle_del = (row: any) => {
  const data: any = []
  data.push(row.id)
  ElMessageBox.confirm(
      t('将删除该访客人员，是否确认?'),
      t('删除确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(() => {
        del_action(data)

      })
      .catch(() => {
        message(t('取消删除'), {type: "error"})

      })
}
const del_action = async (ids: any) => {
  const res = await action_del({
    ids: ids
  })
  if (res.data.code === 200) {
    await visit_all(plotId, current_page.value, page_size.value)
    message(t('删除成功'), {type: "success"})
  } else {
    message(res.data.message, {type: 'error'})
  }
}
const add_action = async (data: any) => {
  const res = await action_add(data)
  if (res.data.code === 200) {
    await visit_all(plotId, current_page.value, page_size.value)

    message(t('添加成功'), {type: "success"})
  } else {
    message(res.data.message, {type: 'error'})
  }
}
//获取列表数据

const visit_all = async (plotId: number, page: number, size: number, visitName?: string, intervieweeName?: string, attendanceStartTimestamp?: number, attendanceEndTimestamp?: number) => {
  const res = await visit_list(
      plotId,
      page,
      size,
      visitName,
      intervieweeName,
      attendanceStartTimestamp,
      attendanceEndTimestamp
  )
  if (res.data.code === 200) {
    visit_data.value = res.data.data
  }
}
onMounted(() => {
  visit_all(plotId, current_page.value, page_size.value)
})

</script>


<style lang="scss" scoped>
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

</style>
