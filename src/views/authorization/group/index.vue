<template>
  <div class="person">
    <div class="device">{{ t('授权管理') }}</div>
    <div class="function">
      <div class="function_left">
        <el-button type="primary" @click="handle_group">{{ t('添加授权组') }}</el-button>
      </div>

    </div>
    <div class="table-wrapper">
      <el-table
          ref="multiple_Ref"
          :data="group_list.records"
          style="width: 100%"

      >
        <el-table-column fixed type="selection" width="80"/>
        <el-table-column
            :index="set_index"
            :label="t('序号')"
            prop="Number"
            type="index"
            width="80">
        </el-table-column>
        <el-table-column :label="t('授权')+t('名称')" prop="name"/>
        <el-table-column :label="t('授权')+t('人数')" prop="personNumber"/>
        <el-table-column :label="t('授权')+t('设备数')" prop="deviceNumber"/>
        <el-table-column :label="t('通行规则')" prop="passRuleName"/>

        <el-table-column :label="t('操作')" fixed="right" width="400">
          <template #default="{row}">
            <el-button size="small" type="primary" @click="handle_travel(row)">{{ t('通行周期') }}</el-button>
            <el-button size="small" type="primary" @click="handle_device(row)">{{ t('设备授权') }}</el-button>
            <el-button size="small" type="primary" @click="handle_person(row)">{{ t('人员授权') }}</el-button>
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
          :total="group_list.total"
          layout="prev, pager, next, jumper"
          @current-change="handleCurrentChange"
      />
    </div>
    <travel_drawer :drawer_flag="travel_falg" :groupID="group_id" @save="handle_travel_save"></travel_drawer>
    <person_drawer :drawer_person="person_drown" :groupID="group_id" @save_person="handle_save_person"></person_drawer>
    <device_drawer :device_dia="device_dialog" :groupID="group_id" @save_device="handle_save_device"></device_drawer>
  </div>
</template>


<script lang="ts" setup>
import person_drawer from '../component/person_drawer/index.vue'
import travel_drawer from '../component/travel_drawer/index.vue'
import device_drawer from '../component/device_drawer/index.vue'
import {useLocalesI18n} from "@/locales/hooks";
import {useUserStore} from "@/store";
import {add_group, del_group, edit_group, personnel_group} from "@/api/authorization";
import {message} from "@/utils/components/message";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'authorization']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const current_page = ref(0);//当前页数
const page_size = ref(12); //每页显示条目个数
const group_list = ref({
  "current": 0,
  "pages": 0,
  "records": [
    {
      "deviceNumber": 0,
      "id": 0,
      "name": "string",
      "passRuleId": 0,
      "passRuleName": "string",
      "personNumber": 0
    }
  ],
  "size": 0,
  "total": 0
})
const travel_falg = ref<boolean>(false)
const person_drown = ref(false) //当前人员授权抽屉的状态
const group = ref({
  "current": 0,
  "pages": 0,
  "records": [
    {
      "deviceNumber": 0,
      "id": 0,
      "name": "string",
      "passRuleId": 0,
      "passRuleName": "string",
      "personNumber": 0
    }
  ],
  "size": 0,
  "total": 0
})
const group_id = ref('0')//拿到当前授权组的id
const device_dialog = ref(false)
//设备授权
const handle_device = (row) => {
  console.log('设备授权', row)
  group_id.value = row.id
  device_dialog.value = true
}
//设备授权传递上来的数据
const handle_save_device = (flag: boolean, status: string) => {
  device_dialog.value = flag
  if (status === 'cancel') return true
  personnel_group_all(plotId, current_page.value, page_size.value)

}
//人员授权
const handle_person = (row) => {
  person_drown.value = true//
  console.log(row.id, '--row')
  group_id.value = row.id
}
const handle_save_person = (flag: boolean, status: string) => {
  person_drown.value = flag
  if (status === 'cancel') return true
  personnel_group_all(plotId, current_page.value, page_size.value)

}
//通行周期
const handle_travel = (row) => {
  console.log('点击通行周期')
  travel_falg.value = true
  group_id.value = row.id

}
const handle_travel_save = (flag: boolean, status: string) => {
  travel_falg.value = flag
  if (status === 'cancel') return true
  personnel_group_all(plotId, current_page.value, page_size.value)

}
//添加通行组
const handle_group = () => {
  ElMessageBox.prompt(t('请输入') + t('授权组') + t('名称'), t('添加') + t('授权组'), {
    confirmButtonText: t('确认'),
    cancelButtonText: t('取消'),
    inputPattern: /^[\w\u4e00-\u9fa5\!\@#\$\%\^\&\*\(\)\-\+\=\[\]\{\}\|\;\:\'\"\,\.\<\>\/\?]+$/,
    inputErrorMessage: t('不能为空'),

  })
      .then(async ({value}) => {
        await handle_add(value)
      })
      .catch(() => {
        message(t('取消') + t('添加') + t('授权组'), {type: 'error'})
      })
}
//编辑授权组
const handle_edit = (row: any) => {

  ElMessageBox.prompt(t('请输入') + t('授权组') + t('名称'), t('编辑') + t('授权组'), {
    confirmButtonText: t('确认'),
    cancelButtonText: t('取消'),
    inputPattern: /^[\w\u4e00-\u9fa5\!\@#\$\%\^\&\*\(\)\-\+\=\[\]\{\}\|\;\:\'\"\,\.\<\>\/\?]+$/,
    inputErrorMessage: t('不能为空')
  })
      .then(async ({value}) => {
        await handle_edit_group(value, row.id)
      })
      .catch(() => {
        message(t('取消') + t('编辑') + t('授权组'), {type: 'error'})
      })
}

const handle_del = (row: any) => {
  ElMessageBox.confirm(
      t('确认') + t('删除') + t('授权组'),
      t('删除') + t('授权组'),
      {
        confirmButtonText: t('确认'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(async () => {
        await handle_del_group(row.id)
      })
      .catch(() => {
        message(t('取消') + t('删除') + t('授权组'), {type: 'error'})
      })
}
//分页
const handleCurrentChange = (val: number) => {
  console.log(val, '--val')
  current_page.value = val;
  personnel_group_all(plotId, val, page_size.value)
};
//拿到当前列表的序号
const set_index = (index) => {
  if (current_page.value >= 1) {
    return (current_page.value - 1) * page_size.value + index + 1

  } else {
    return (current_page.value) * page_size.value + index + 1

  }
}
//添加授权信
const handle_add = async (name: string) => {
  const res = await add_group({
    name: name,
    plotId: plotId
  })
  if (res.data.code === 200) {
    message(t('编辑') + t("授权组") + t('成功'), {type: 'success'})
    await personnel_group_all(plotId, current_page.value, page_size.value)

  } else {
    message(res.data.message, {type: "error"})
  }
}
const handle_edit_group = async (name: string, id: string) => {
  const res = await edit_group({
    name: name,
    id: id
  })
  if (res.data.code === 200) {
    message(t('添加') + t("授权组") + t('成功'), {type: 'success'})
    await personnel_group_all(plotId, current_page.value, page_size.value)

  } else {
    message(res.data.message, {type: "error"})
  }
}
const handle_del_group = async (id: string) => {
  const res = await del_group({
    id: id
  })
  if (res.data.code === 200) {
    message(t('删除') + t("授权组") + t('成功'), {type: 'success'})
    await personnel_group_all(plotId, current_page.value, page_size.value)

  } else {
    message(res.data.message, {type: "error"})
  }
}
//获取所有数据
const personnel_group_all = async (plotId: number, page: any, size: any, name?: string) => {
  const res = await personnel_group(plotId, page, size, name)
  if (res.data.code === 200) {
    group_list.value = res.data.data
  }
}
onMounted(() => {
  personnel_group_all(plotId, current_page.value, page_size.value)
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
