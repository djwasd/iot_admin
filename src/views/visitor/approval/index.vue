<template>
  <div class="person">
    <div class="device">{{ t('访客审批') }}</div>
    <div class="table-wrapper">
      <el-table
          ref="multiple_Ref"
          :data="visit_data.records"
          :row-key="getRowKey"
          style="width: 100%"
          @selection-change="handleSelectionChange"

      >
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
                style="width: 30px; height: 30px"
                :src="git_pic(row)"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                fit="cover"
                :preview-teleported="true"
                :preview-src-list="[git_pic(row)]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column :label="t('申请时间')" prop="applyTimestamp">
          <template #default="{ row }">
            {{format_data(row.applyTimestamp)}}
          </template>
        </el-table-column>
        <el-table-column :label="t('审批状态')" prop="applyStatus">
          <template #default="{ row }">
           <span :style="applyStatusStyle(row.applyStatus)">
      {{ row.applyStatus === 2 ? t('待审核') : row.applyStatus === 3 ? t('已同意') : t('已拒绝') }}
    </span>
          </template>
        </el-table-column>
        <el-table-column :label="t('操作')" fixed="right" width="200">
          <template #default="{row,$index}">
            <el-button size="small" type="primary" @click="handle_approval(row)">{{ t('审批') }}</el-button>
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
    <drawer :list_dia="drawer_flag"
            @save_list="handle_save_list"
            :editDate="edit_data"
    ></drawer>
  </div>
</template>



<script setup lang="ts">
import drawer from  './component/drawer.vue'

import {useLocalesI18n} from "@/locales/hooks";
import {useUserStore} from "@/store";
import {format_data} from "@/utils/packagingmethod/time";
import no_pic from "@/assets/images/png/no_pic.png";
import {action_audit, action_del, visit_list} from "@/api/visitor";
import {message} from "@/utils/components/message";
import {upload_person} from "@/api/glob";

const { t } = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'authorization']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const visit_data = ref({
  "records": [
    {applyTimestamp: 0,applyStatus:0,}
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
const current_page = ref(0);//当前页数
const page_size = ref(10); //每页显示条目个数
const edit_data = ref({
  id:0
})
const drawer_flag = ref<boolean>(false)
const source = ref<number>(3)
const  applyStatusStyle = (applyStatus:any) => {
  const statusColors = {
    1: 'orange',
    2: 'green',
    default: 'red'
  };

  const color = statusColors.hasOwnProperty(applyStatus) ? statusColors[applyStatus] : statusColors.default;

  return { color };
}
const handle_approval = (row:any)=>{
  edit_data.value = row
  drawer_flag.value = true
}
const handle_save_list =(flag:boolean,status:string,data:any)=>{
  drawer_flag.value = flag
  if (status==='cancel') return true
  console.log(data,'--data')//拿到当前审批的数据
  audit(edit_data.value.id,data)
}
//审批
const audit =async (id:number,data: any) => {
  const res = await action_audit({
    id: id,
    result: data.result,
    devices:data.devices
  })
  if (res.data.code===200){
    await visit_all(plotId, current_page.value, page_size.value,source.value)
    message(t('审核完成'),{type:'success'})
  }else {
    message(res.data.message,{type:'error'})
  }
}
const getRowKey = (row: any) => {
  return row.id
}

const handleSelectionChange = (val: any) => {
  multipleSelection.value = val.map(item => item.id);
  console.log(multipleSelection.value, '--val')
}
const set_index = (index: number) => {
  if (current_page.value >= 1) {
    return (current_page.value - 1) * page_size.value + index + 1

  } else {
    return (current_page.value) * page_size.value + index + 1

  }
}
//获取table照片
const git_pic =  (row:any) => {
  if (row.visitorFacePicture) {
    // const res =  upload_person(row.visitorFacePicture);
    const ipAddress = window.location.host;
    const url =  `http://${ipAddress}/operation/cloud/web/sys/api/v1/attachment/actions/download?file_id=${row.visitorFacePicture}`;
    return  url
  }
  return no_pic;
};
const handleCurrentChange = async (val: number) => {
  current_page.value = val;
  await visit_all(plotId, current_page.value, page_size.value,source.value)

};
//获取列表数据

const handle_del = (row: any) => {
  const data: any = []
  data.push(row.id)
  ElMessageBox.confirm(
      t('将删除该申请记录，是否确认?'),
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
    await visit_all(plotId, current_page.value, page_size.value,source.value)
    message(t('删除成功'), {type: "success"})
  } else {
    message(res.data.message, {type: 'error'})
  }
}
const visit_all = async (plotId:number,page: number, size: number,source?:number,visitName?: string, intervieweeName?: string, attendanceStartTimestamp?: number, attendanceEndTimestamp?: number) => {
  const res = await visit_list(
      plotId,
      page,
      size,
      source,
      visitName,
      intervieweeName,
      attendanceStartTimestamp,
      attendanceEndTimestamp
  )
  if (res.data.code === 200) {
    visit_data.value = res.data.data
  }
}

const route = useRoute();

watch(
    route,
    async () => {
      await visit_all(plotId, current_page.value, page_size.value,source.value)

    },
    { immediate: true },
);
</script>



<style scoped lang="scss">
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
  .table-wrapper {
    padding-top: 20px;
    padding-left: 20px;
  }

  .pagination {
    padding: 20px 20px;
    display: flex;
    justify-content: flex-end;
  }

}
</style>
