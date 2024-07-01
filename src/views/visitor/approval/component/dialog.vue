<template>
  <div>
    <el-dialog
        v-model="dialog_visible"
        :before-close="handle_close"
        class="dialog_css"
        width="700"
    >
      <template #header>
        <div class="dialog_header">
          {{ t('添加设备') }}
        </div>
        <div class="dialog_buttom"></div>
      </template>
      <div class="function">
        <div class="function_left">
          <el-button type="primary">{{ t('全选设备') }}</el-button>

        </div>
        <div class="function_right">
          <div class="search-wrapper">
            <el-input
                v-model="search_person"
                :placeholder="t('请输入')+t('设备')+t('序列号')"
            >
              <template #append>
                <el-button icon="mel-icon-search" @click="handle_search"/>
              </template>
            </el-input>
          </div>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table
            ref="multipleTableRef"
            :data="device_list.records"
            style="width: 100%"
            @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"/>
          <el-table-column
              :index="set_index"
              :label="t('序号')"
              prop="Number"
              type="index"
              width="80">
          </el-table-column>
          <el-table-column :label="t('设备')+t('名称')" prop="deviceName" show-overflow-tooltip/>
          <el-table-column :label="t('设备序列号')" prop="serialNo" show-overflow-tooltip/>
          <el-table-column :label="t('设备位置')" prop="address" show-overflow-tooltip/>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
            v-model:current-page="current_page"
            v-model:page-size="page_size"
            :total="device_list.total"
            layout="prev, pager, next, jumper"
            @current-change="handleCurrentChange"
        />

      </div>
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
import {PropType} from "vue";
import {visitor_GroupDevice} from "@/api/visitor";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'person_table']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const dialog_visible = ref(false)
const props = defineProps({  //父组件爱你传递过来的弹框状态
  dialog: {
    type: Boolean as PropType<boolean>,
    default: false
  },

})
console.log(props.dialog, '--222')
const emit = defineEmits();   //定义子组件传递方法
const search_person = ref<string>('')//搜索对应的
const device_list = ref({
  records: [],
  total: 0
})
const current_page = ref(0);//当前页数
const page_size = ref(12); //每页显示条目个数
const multipleSelection = ref<Array<any>>([]) //选中的人数 可以考虑只传id
const select_all = ref<boolean>(false) //是否全选
const multiple_Ref = ref() //当前table组建的实例
const device_type = ref('device/master/AccessController')
//全部选中
const handle_all = () => {
  select_all.value = !select_all.value
  console.log(select_all.value, '--全选')
  if (select_all.value) {
    multiple_Ref.value.toggleAllSelection()
  } else {
    multiple_Ref.value.clearSelection()

  }
}
//拿到当前列表的序号
const set_index = (index) => {
  if (current_page.value >= 1) {
    return (current_page.value - 1) * page_size.value + index + 1

  } else {
    return (current_page.value) * page_size.value + index + 1

  }
}
const handleSelectionChange = (val: Array<any>) => {
  multipleSelection.value = val.map(item => {
    return {
      id: item.deviceId,
      path: item.devicePath
    };
  })
  console.log(multipleSelection.value, '--val')
}
//分页
const handleCurrentChange = async (val: number) => {
  console.log(val, '--val')
  current_page.value = val;
  await visitor_device_all(plotId, current_page.value, page_size.value, device_type.value)
};
//搜索
const handle_search = async () => {
  console.log('search_person.value', search_person.value)
  await visitor_device_all(plotId, current_page.value, page_size.value, device_type.value)
  console.log('搜索')
}
const handle_close = () => {
  console.log('取消')
  dialog_visible.value = false
  emit("save_dialog", dialog_visible.value, 'cancel');

}
const handle_save = () => {
  console.log('确认')
  dialog_visible.value = false
  emit("save_dialog", dialog_visible.value, 'save', multipleSelection.value);

}
//获取所有数据
const visitor_device_all = async (plotId: number, page: any, size: any, deviceType: string) => {
  const res = await visitor_GroupDevice(plotId, page, size, deviceType)
  if (res.data.code === 200) {
    device_list.value = res.data.data
  }
}
watch(() => props.dialog,
    (newVal) => {
      dialog_visible.value = newVal
      console.log(dialog_visible.value, '-- 当前弹框的状态');
      visitor_device_all(plotId, current_page.value, page_size.value, device_type.value)

    });
</script>

<style lang="scss" scoped>
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

  .function {
    padding: 16px 0;
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
      .dropdown {
        margin: 0 10px;
      }
    }


  }

  .pagination {
    padding: 20px 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
