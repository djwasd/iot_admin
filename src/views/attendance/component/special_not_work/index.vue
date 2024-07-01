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
          {{ t('不用打卡日期') }}
        </div>
        <div class="dialog_buttom"></div>
      </template>
      <el-form :model="date_form" class="form" label-width="auto" style="max-width: 600px">
        <el-form-item v-for="(item, index) in date_form" :key="index" :label="`日期 ${index + 1}`" prop="value">
          <el-date-picker v-model="item.value" :placeholder="t('请选择日期')" type="date" value-format="x"/>
          <me-icon-plus_sign v-if="index === date_form.length - 1" class="form_icon" @click="handle_add_picker"/>
          <me-icon-minus_sign v-if="date_form.length > 1" class="form_minus" @click="handle_minus_picker(index)"/>
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
import {defineEmits, defineProps, PropType, ref, watch} from "vue";
import {useLocalesI18n} from "@/locales/hooks";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'person_table']);

const dialog_visible = ref(false);
const date_form = ref([
  {value: ""}
]);

const props = defineProps({
  special_not_dialog: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  status: {
    type: String as PropType<string>,
    default: '',
  },
  data: {
    type: Array as PropType<any>,
    default: [],
  }
});

const emit = defineEmits();
const timestamps = ref<Array<number>>([]);

const handle_close = () => {
  console.log("取消");
  dialog_visible.value = false;
  date_form.value = [{value: ""}]
  emit("not_work_dialog", dialog_visible.value, "cancel");
};

const handle_save = () => {
  timestamps.value = date_form.value
      .filter(item => item.value !== '') // 过滤掉value为''的项
      .map(item => item.value); // 提取时间戳值

  console.log(timestamps.value, '--timestamps.value');
  console.log("确认");
  dialog_visible.value = false;
  emit("not_work_dialog", dialog_visible.value, "confirm", timestamps.value);
};

const handle_add_picker = () => {
  console.log("添加日期");
  date_form.value.push({value: ""});
};

const handle_minus_picker = (index: number) => {
  console.log("删除日期");
  date_form.value.splice(index, 1);
};


watch(
    [() => props.special_not_dialog, () => props.status, () => props.data],
    ([newVal, newStatus, newData]) => {
      dialog_visible.value = newVal;
      console.log(newData, '--newData')
      if (newStatus === 'add') {
        date_form.value = [{value: ""}]
      } else {
        if (date_form.value.length === 0) {
          console.log('走这里了吗')
          handle_add_picker()
        } else {
          date_form.value = newData.map(item => ({value: item}));

        }
      }
      console.log(dialog_visible.value, "-- 当前弹框的状态");
    }
);
</script>

<style lang="scss" scoped>
.dialog_css {
  .dialog_header {
    font-size: 18px;
    color: #333333;
    width: 100%;
  }

  .form {
    padding-top: 30px;

    .form_icon {
      padding: 0 20px 0 10px;
    }

    .form_minus {
      padding-left: 10px;
    }
  }

}
</style>
