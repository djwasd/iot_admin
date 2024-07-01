<template>
  <div class="person">
    <div class="device">{{ t('固件管理') }}</div>
    <div class="function">
      <div class="function_left">
        <el-button type="primary" @click="handle_add">{{ t('新增') + t('固件') }}</el-button>
      </div>
      <div class="function_right">
        <div class="search-wrapper">
          <el-input
              v-model="search_person"
              :placeholder="t('请输入')+t('设备型号')"
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
          :data="firmware_data.records"
          style="width: 100%"
      >
        <el-table-column
            type="selection" width="55"
        />
        <el-table-column
            :index="set_index"
            :label="t('序号')"
            prop="Number"
            type="index"
            width="80">
        </el-table-column>
        <el-table-column :label="t('设备')+t('型号')" prop="model" show-overflow-tooltip/>
        <el-table-column :label="t('固件版本')" prop="version" show-overflow-tooltip/>
        <el-table-column :label="t('固件大小')" prop="size" show-overflow-tooltip>
          <template #default="{row}">
            {{ formattedSize(row) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('上传时间')" prop="uploadDatestamp" show-overflow-tooltip>
          <template #default="{row}">
            {{ format_data(row.uploadDatestamp) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('上传时间')" prop="status" show-overflow-tooltip>
          <template #default="{row}">
            <el-switch
                v-model="row.status"
                :active-value="1"
                :inactive-value="2"
                class="ml-2"
                @change="handle_change(row)"
            />
          </template>
        </el-table-column>
        <el-table-column :label="t('操作')" fixed="right" width="150">
          <template #default="{row}">
            <el-button link size="small" type="danger" @click="handle_del(row)"> {{ t('删除') }}</el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
          v-model:current-page="current_page"
          v-model:page-size="page_size"
          :total="firmware_data.total"
          layout="prev, pager, next, jumper"
          @current-change="handleCurrentChange"
      />

    </div>
    <div>
      <el-dialog
          v-model="dialog_visible"
          :before-close="handle_close"
          class="dialog_css"
          width="500"
      >
        <template #header>
          <div class="dialog_header">
            {{ t('新增') + t('固件') }}
          </div>
          <div class="dialog_buttom"></div>
        </template>
        <el-form
            ref="ruleForm_ref"
            :model="form_list"
            :rules="rules"
            class="demo-ruleForm"
            label-width="auto"
            status-icon
        >
          <el-form-item :label="t('设备型号')" prop="model">
            <el-select v-model="form_list.model" :placeholder="t('请选择设备型号')">

              <el-option
                  v-for="(item,index) in Equipment"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
              >

              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="t('固件版本')" prop="version">
            <el-input v-model="form_list.version" :placeholder="t('请输入版本号')"></el-input>
          </el-form-item>
          <el-form-item prop="attachmentId">
            <div class="dialog_content">
              <el-upload
                  ref="upload_ref"
                  :http-request="handle_upload_bin"
                  :limit="1"
                  :on-error="uploadError"
                  :on-success="uploadSuccess"
                  accept=".bin"
                  class="upload-demo"
                  drag
                  multiple

              >
                <img class="image" src="@/assets/images/png/upload.png">


                <div class="el-upload__text">
                  {{ t("将文件拖到此处或者") }} <em>{{ t("点击上传") }}</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    {{ t("请上传.bin文件，且不超过200MB") }}
                  </div>
                </template>

              </el-upload>

            </div>
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
  </div>
</template>


<script lang="ts" setup>
import {useLocalesI18n} from "@/locales/hooks";
import {useUserStore} from "@/store";
import {ElNotification, FormInstance, FormRules, UploadRequestOptions} from "element-plus";
import {upload_attachments} from "@/api/glob";
import {attachment_add, attachment_edit, firmware_list, swich_init} from "@/api/attendance";
import {message} from "@/utils/components/message";
import {format_data} from "@/utils/packagingmethod/time";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'management']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const dialog_visible = ref<boolean>(false)
const ruleForm_ref = ref<FormInstance>(); //拿到当前ref实力
const upload_ref = ref(null)
const form_list = ref({
  "attachmentId": '',
  "model": "",
  "version": "",
  'plotId': plotId
})
const form_list_copy = ref({
  "attachmentId": '',
  "model": "",
  "version": "",
  'plotId': plotId

})
const rules = computed<FormRules>(() => ({
  model: [
    {
      required: true,
      message: t('设备型号') + t('不能为空'),
      trigger: 'blur',
    },
  ],

  version: [
    {
      required: true,
      message: t('固件版本') + t('不能为空'),
      trigger: 'blur',
    },
  ],
  attachmentId: [
    {
      required: true,
      message: t('上传文件') + t('不能为空'),
      trigger: 'blur',
    },
  ],

}));
const firmware_data = ref({
  "current": 0,
  "pages": 0,
  "records": [
    {
      "id": 0,
      "model": "string",
      "size": 0,
      "status": 0,
      "uploadDatestamp": 0,
      "version": "string"
    }
  ],
  "size": 0,
  "total": 0
})
const current_page = ref(0);//当前页数
const page_size = ref(12); //每页显示条目个数
const search_person = ref<string>('')
const isfirst = ref(true)
const uploadSuccess = () => {
  ElNotification({
    title: t('温馨提示'),
    message: t('文件上传成功'),
    type: "success"
  });

};
const uploadError = () => {
  ElNotification({
    title: t('温馨提示'),
    message: t('文件上传失败'),
    type: "error"
  });

};

const handle_upload_bin = async (options: UploadRequestOptions) => {
  let formData = new FormData();
  formData.append("file", options.file);
  const res = await upload_attachments({
    file: options.file
  }, 5)
  form_list.value.attachmentId = res.data.data.id
  console.log(res, '--res')
}
// 添加设备固件
const add_attend = async (data) => {
  const res = await attachment_add(data)
  if (res.data.code === 200) {
    firmware_all(plotId, current_page.value, page_size.value, search_person.value)
    message(t('添加') + t('成功'), {type: 'success'})
  } else {
    message(res.data.message, {type: 'error'})
  }

}
//分页
const handleCurrentChange = (val: number) => {
  current_page.value = val;
  firmware_all(plotId, current_page.value, page_size.value, search_person.value)
};
//搜索
const handle_search = () => {
  console.log('搜素',)
  firmware_all(plotId, current_page.value, page_size.value, search_person.value)
}
const formattedSize = (row) => {
  const size = row.size;
  const mbSize = Math.ceil(size / (1024 * 1024));
  return `${mbSize}M`;
}
//新增固件
const handle_add = () => {
  form_list.value = JSON.parse(JSON.stringify(form_list_copy.value))
  dialog_visible.value = true

}
const Equipment = [
  {label: 'N52LC-CWU', value: 'N52LC-CWU', id: 1},
  {label: 'N52L-CWU', value: 'N52L-CWU', id: 2},
  {label: 'N52S-CWU', value: 'N52S-CWU', id: 3},
  {label: 'N52SP-CWUG4', value: 'N52SP-CWUG4', id: 4},
  {label: 'N71LC-C', value: 'N71LC-C', id: 5},
  {label: 'N71LW-C', value: 'N71LW-C', id: 6},
  {label: 'N71SW-C', value: 'N71SW-C', id: 7},
  {label: 'N71SP-C', value: 'N71SP-C', id: 8},
  {label: 'N71SP-CG4', value: 'N71SP-CG4', id: 9},
  {label: 'N71SP-CWU', value: 'N71SP-CWU', id: 10},
  {label: 'N71SP-CU', value: 'N71SP-CU', id: 11},
  {label: 'N71SP-CQ', value: 'N71SP-CQ', id: 12},
  {label: 'N81S', value: 'N81S', id: 13},
  {label: 'N81S-C', value: 'N81S-C', id: 14},
  {label: 'N81SP-C', value: 'N81SP-C', id: 15},
  {label: 'N81SP-CG4', value: 'N81SP-CG4', id: 16},
  {label: 'N81SP-CU', value: 'N81SP-CU', id: 17},
  {label: 'N81SP-CWU', value: 'N81SP-CWU', id: 18},
  {label: 'N81SP-D', value: 'N81SP-D', id: 19},
  {label: 'N81SP-DU', value: 'N81SP-DU', id: 20},
  {label: 'N81SP-DWU', value: 'N81SP-DWU', id: 21},
  {label: 'N83SP-DQ', value: 'N83SP-DQ', id: 22},
  {label: 'N83SP-D', value: 'N83SP-D', id: 23},
  {label: 'N83SP-D1', value: 'N83SP-D1', id: 24},
  {label: 'R52SE-CU', value: 'R52SE-CU', id: 25},
  {label: 'R52S-CWU', value: 'R52S-CWU', id: 26},
  {label: 'R52S-CWUG4', value: 'R52S-CWUG4', id: 27},
  {label: 'R71S-C', value: 'R71S-C', id: 28},
  {label: 'R71S-CU', value: 'R71S-CU', id: 29},
  {label: 'R71S-CG4', value: 'R71S-CG4', id: 30},
  {label: 'R71S-CWU', value: 'R71S-CWU', id: 31},
  {label: 'R71S-CQ', value: 'R71S-CQ', id: 32},
  {label: 'R81S', value: 'R81S', id: 33},
  {label: 'R81S-C', value: 'R81S-C', id: 34},
  {label: 'R81S-CU', value: 'R81S-CU', id: 35},
  {label: 'R81S-CG4', value: 'R81S-CG4', id: 36},
  {label: 'R81S-CWU', value: 'R81S-CWU', id: 37},
  {label: 'R83S-D1', value: 'R83S-D1', id: 38}
];
//拿到当前列表的序号
const set_index = (index) => {
  if (current_page.value >= 1) {
    return (current_page.value - 1) * page_size.value + index + 1

  } else {
    return (current_page.value) * page_size.value + index + 1

  }
}

//dialog弹框确认
//弹框确认
const handle_save = () => {
  ruleForm_ref.value?.validate(async (valid, fields) => {
    if (valid) {
      console.log(111)
      await add_attend(form_list.value)
      dialog_visible.value = false
      upload_ref.value.clearFiles()
    } else {
      console.log('提交错误', fields);
    }
  });

}
//dialog弹框取消
const handle_close = () => {
  if (!ruleForm_ref.value) return
  ruleForm_ref.value.resetFields()
  dialog_visible.value = false

}
//获取设备固件列表信息
const firmware_all = async (plotId: number, page: any, size: any, model?: string) => {
  const res = await firmware_list(plotId, page, size, model)
  if (res.data.code === 200) {
    firmware_data.value = res.data.data
  } else {
    message(res, data.message, {type: 'error'})
  }
}
const change_status = async (row: any) => {
  console.log(row, '=---row')
  const res = await swich_init({
    id: row.id,
    status: row.status
  })
  if (res.data.code === 200) {
    message(t('修改成功'), {type: 'success'})
  } else {
    message(res.data.message, {type: 'error'})
  }
}
const handle_change = async (row) => {
  if (!isfirst.value) {
    await change_status(row)
    // 这里可以添加其他处理逻辑
  } else {
    isfirst.value = false
  }
};
//删除
const handle_del = (row: any) => {
  ElMessageBox.confirm(
      row.model + t('将被删除,是否确认?'),
      t('删除') + t('固件信息'),
      {
        confirmButtonText: t('确认'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  )
      .then(async () => {
        const res = await attachment_edit({
          id: row.id
        })
        if (res.data.code === 200) {
          firmware_all(plotId, current_page.value, page_size.value, search_person.value)

          message(t('删除') + t('成功'), {type: 'success'})
        } else {
          message(res.data.message, {type: 'error'})
        }
      })
      .catch(() => {
        message(t('取消删除') + t('固件信息'), {type: 'error'})
      })
}

onMounted(() => {
  firmware_all(plotId, 0, page_size.value, search_person.value)
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

  .dialog_content {
    width: 470px;

    .upload-demo {
      .image {
        width: 50px;
        height: 50px;
      }

      .el-upload__text {
        height: 50px;
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

  }
}
</style>
