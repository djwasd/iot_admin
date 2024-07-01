<template>
  <el-dialog
      v-model="dialog_visible"
      :before-close="handle_close"
      class="dialog_css"
      width="500"
  >
    <template #header>
      <div class="dialog_header">
        {{ t('导入/导出') }}
      </div>
      <div class="dialog_buttom"></div>
    </template>
    <div class="dialog_content">
      <el-upload
          :http-request="handle_upload_zip"
          :on-error="uploadError"
          :on-success="uploadSuccess"
          class="upload-demo"
          drag
          multiple
      >
        <!--       <mel-icon-upload></mel-icon-upload>-->

        <div class="el-upload__text">
          {{ t("将文件拖到此处或者") }} <em>{{ t("点击上传") }}</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            {{ t("请上传压缩包文件，内含人员Excel表格和人员照片") }}
            <span class="span" @click="handle_download">{{ t('示例文件下载') }}</span>
          </div>
        </template>

      </el-upload>
      <el-button class="btn" type="primary" @click="handle_person">{{ t('人员导出') }}</el-button>

    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handle_close">{{ t('取消') }}</el-button>
        <!--        <el-button type="primary" @click="handle_save">{{ t('确认') }}</el-button>-->
      </div>
    </template>
  </el-dialog>
</template>


<script lang="ts" setup>
import {useLocalesI18n} from "@/locales/hooks";
import {action_import, export_template, person_export} from "@/api/person";
import {download_excel, download_zip} from '@/utils/packagingmethod/utils'
import {UploadRequestOptions} from "element-plus";
import {message} from "@/utils/components/message";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../../lang/${locale}.json`), 'person_table']);
const props = defineProps({
  export_dialog: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  tree_node: {
    type: String as PropType<string>,
    default: false
  }
})

const dialog_visible = ref(false)
const emit = defineEmits();   //定义子组件传递方法
const organizationId = ref('')
//下载示例文件
const handle_download = async () => {
  const res = await export_template()
  let name = t('人员信息表')
  download_excel(res.data, name);
}
//人员导出
const handle_person = async () => {
  const res = await person_export(organizationId.value, 1)
  console.log(res, '--res')
  let name = t('人员信息表')
  download_zip(res.data, name);
}
const handle_close = () => {
  dialog_visible.value = false
  emit("export_save", dialog_visible.value, 'cancel');
}

//上传zip
const handle_upload_zip = async (options: UploadRequestOptions) => {
  let formData = new FormData();
  formData.append("file", options.file);
  const res = await action_import({
    file: options.file
  })
  if (res.data.code === 200) {
    handle_close()
  } else {
    message(res.data.message, {type: 'error'})
  }
}

watch([() => props.export_dialog, () => props.tree_node],
    ([new_export_dialog, new_tree_node]) => {
      dialog_visible.value = new_export_dialog
      organizationId.value = new_tree_node
    });
</script>


<style lang="scss" scoped>
.dialog_css {
  .dialog_header {
    font-size: 18px;
    color: #333333;
    width: 100%;
    //border-bottom: 1px solid #333333;
  }

  .dialog_buttom {
    height: 1px;
    border: 1px solid #333333;
    margin: 16px 0;
    width: 100%;

  }

  .dialog_content {
    .el-upload__text {
      height: 120px;
    }

    .el-upload__tip {
      display: flex;
      justify-content: space-between; /* 将元素从左到右平均分布 */
      align-items: center; /* 垂直居中对齐 */
    }

    .span {
      margin: 0 auto;
      cursor: pointer;
      color: #3b81f4;
      border-bottom: 1px solid #3b81f4;
    }
  }

  .btn {
    width: 90%;
    margin: 20px 0 0 20px;
  }
}
</style>
