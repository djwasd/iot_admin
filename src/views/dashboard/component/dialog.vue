<template>
  <div>
    <el-dialog
        v-model="dialog_visible"
        :before-close="handle_close"
        class="dialog_css"
        width="500"
    >
      <template #header>
        <div class="dialog_header">
          {{ t('切换子账号') }}
        </div>
        <div class="dialog_buttom"></div>
      </template>
      <div>
        <el-table :data="tree_data" style="width: 100%">
          <el-table-column :label="t('账号信息')" prop="name"/>
          <el-table-column :label="t('操作')" fixed="right" width="200">
            <template #default="{row}">
              <el-button size="small" type="primary" @click="handle_change(row)">{{ t('切换') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
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
import {tree_list} from "@/api/dashboard";
import {useUserStore} from "@/store";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'person_table']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const plotParentPath = UserStore.user.plotParentPath
const plotParentId = UserStore.user.plotParentId

const dialog_visible = ref(false)
const props = defineProps({  //父组件爱你传递过来的弹框状态
  dialog: {
    type: Boolean as PropType<boolean>,
    default: false
  },
})
const emit = defineEmits();   //定义子组件传递方法
const tree_data = ref([
  {
    "id": "44",
    "pid": "42",
    "children": [],
    "name": "测试33",
    "path": "/0/42/44/"
  }
])
const handle_close = () => {
  console.log('取消')
  dialog_visible.value = false
  emit("save_dialog", dialog_visible.value, 'cancel');

}
const handle_save = () => {
  console.log('确认')
  dialog_visible.value = false
  emit("save_dialog", dialog_visible.value, 'save');

}

const handle_change = async (row: any) => {
  let a: any = JSON.parse(localStorage.getItem('user'));

  // 仅在第一次调用时执行
  if (!localStorage.getItem('user_copy')) {
    localStorage.setItem('user_copy', JSON.stringify(a));
  }
  localStorage.setItem('user', JSON.stringify(a));
  a.plotName = row.name;
  a.plotId = row.id;
  a.plotParentPath = row.path;
  localStorage.setItem('user', JSON.stringify(a));
  await UserStore.init_dashboard();
  window.location.reload();
}

const tree_all = async (parentPath: string, parentId: any, name?: string) => {
  const res = await tree_list(parentPath, parentId, name)
  tree_data.value = res.data.data
}
onMounted(() => {
})
watch(() => props.dialog,
    (newVal) => {
      dialog_visible.value = newVal
      tree_all(plotParentPath, plotId)
      console.log(dialog_visible.value, '-- 当前弹框的状态');
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
}
</style>
