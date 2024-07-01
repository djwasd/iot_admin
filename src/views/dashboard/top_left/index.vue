<template>
  <el-card class="left_top">
    <!-- 公司信息 -->
    <div class="top">
      <img src="@/assets/images/png/building.png">
      <div class="company_box">
        <div class="company">
          <div class="company_span">{{ details_data.name }}</div>
          <img class="edit_img" src="@/assets/images/png/edit.png" @click="handle_edit">
        </div>
        <div class="address">{{ details_data.address }}</div>
      </div>
    </div>
    <!-- 楼层和子账号管理 -->
    <div class="left_content">
      <div class="content_box">
        <img class="content_box_image" src="@/assets/images/png/build_number.png">
        <div class="floor">楼栋 {{ information_data.buildingCount }} 栋</div>
      </div>
      <div class="content_box" @click="handle_account">
        <img class="content_box_image" src="@/assets/images/png/diserbution.png">
        <div class="floor" style="cursor: pointer">子账号管理</div>
      </div>
    </div>
    <!--    设备-->
    <div class="left_content">
      <div class="content_box" style="background-color: #FFFAF5">
        <img class="content_box_image" src="@/assets/images/png/phone.png">
        <div>
          <div class="mobile_font ">设备 {{ information_data.acsCount }}台</div>
          <div class="mobile_font">白名单 {{ information_data.acsWhitePersonCount }}</div>
        </div>
      </div>
      <div class="content_box" style="background-color: #FFFAF5">
        <div class="mobile_font person">人员照片 {{ information_data.acsPersonPictureCount }}人</div>
      </div>
    </div>
    <div class="left_content" style="margin-top: 5px">
      <div class="content_box">
        <img class="content_box_image" src="@/assets/images/png/broom.png">
        <div class="floor">设备 {{ information_data.ipcCount }} 台</div>
      </div>
      <div class="content_box">
        <img class="content_box_image" src="@/assets/images/png/diserbution.png">
        <div class="floor">在线 {{ information_data.ipcOnlineCount }} 个</div>
      </div>
    </div>
    <el-dialog
        v-model="dialogVisible"
        :before-close="handle_close"
        :title="t('编辑基本信息')"
        width="700"
    >
      <template #header>
        <div class="dialog_header">
          {{ t('编辑基本信息') }}
        </div>
        <div class="dialog_buttom"></div>
      </template>

      <el-form
          ref="ruleForm_ref"
          :model="ruleForm"
          :rules="rules"
          :size="formSize"
          class="demo_ruleForm"
          label-width="auto"
          status-icon
          style="max-width: 600px"
      >
        <el-form-item :label="t('公司/园区名称')" prop="name">
          <el-input v-model="ruleForm.name"/>
        </el-form-item>
        <el-form-item :label="t('项目位置')" prop="provinceName">
          <div class="location">
            <el-select v-model="ruleForm.provinceName"
                       class="location_select"
                       @change="handle_provincial"
            >
              <el-option
                  v-for="(item,index) in provincial_level"
                  :key="item.id"
                  :label="item.name"
                  :value="item"

              >

              </el-option>
            </el-select>
            <el-form-item prop="cityName">
              <el-select v-model="ruleForm.cityName" @change="handle_citys">
                <el-option
                    v-for="(item,index) in citys"
                    :key="item.id"
                    :label="item.name"
                    :value="item"

                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="areaName">
              <el-select v-model="ruleForm.areaName" @change="handle_district">
                <el-option
                    v-for="(item,index) in district_level"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>

          </div>
        </el-form-item>
        <el-form-item :label="t('详细地址')" prop="address">
          <el-input v-model="ruleForm.address"/>
        </el-form-item>
        <el-form-item :label="t('楼栋数')" prop="number">
          <el-input v-model="ruleForm.number" class="buildings"/>
          <span>  {{ t('(栋)') }}</span>
        </el-form-item>
        <el-form-item :label="t('邀请码')">
          <el-input
              v-model="details_data.code"
              class="buildings"
              disabled
          >
            <template #append>
              <el-button icon="me-icon-copy" @click="handle_copy"/>
            </template>
          </el-input>
        </el-form-item>
      </el-form>


      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handle_close">{{ t('取消') }}</el-button>
          <el-button type="primary" @click="handle_save">{{ t('确定') }}</el-button>
        </div>
      </template>
    </el-dialog>
    <account_dia :dialog="account_flag" @save_dialog="handle_account_dialog"></account_dia>
  </el-card>
</template>

<script lang="ts" setup>
import {ComponentSize, FormInstance, FormRules} from "element-plus";
import {useLocalesI18n} from "@/locales/hooks";
import {useUserStore} from "@/store";
import {message} from "@/utils/components/message";
import {edit_plot, information, organizational, region_codes} from "@/api/dashboard";
import account_dia from '../component/dialog.vue'

const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'top_left']);
const ruleForm_ref = ref<FormInstance>(); //拿到当前ref实力
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const code_rizes = ref(100000000000)
const account_flag = ref(false)

interface RuleForm {
  name: string,
  provinceName: string,
  address: string,
  number: string
  cityName: string
  areaName: string
  cityCode: string,
  provinceCode: string,
  areaCode: string
}

const formSize = ref<ComponentSize>('default')  //弹框大小默认
const details_data = ref({
  "address": "",
  "areaCode": "",
  "areaName": "",
  "cityCode": "",
  "cityName": "",
  "code": "",
  "id": 0,
  "name": "",
  "number": "",
  "path": "",
  "provinceCode": "",
  "provinceName": ""
})
const dialogVisible = ref<boolean>(false)
const ruleForm = ref<RuleForm>({
  name: '',
  provinceName: '',
  address: '',
  number: '',
  cityName: '',
  areaName: '',
  cityCode: '',
  provinceCode: '',
  areaCode: ''
})

const rules = computed<FormRules>(() => ({
  name: [
    {required: true, message: t('公司/园区名称不能为空'), trigger: 'blur'},
  ],
  provinceName: [
    {required: true, message: t('项目位置不能为空'), trigger: 'change'},
  ],
  areaName: [
    {required: true, message: t('项目位置不能为空'), trigger: 'change'},
  ],
  cityName: [
    {required: true, message: t('项目位置不能为空'), trigger: 'change'},
  ],
  address: [
    {required: true, message: t('地址不能为空'), trigger: 'blur'},
  ],
  number: [
    {required: true, message: t('楼栋数不能为空'), trigger: 'blur'},
  ],
}));
const provincial_level = ref([
  {
    "id": 4,
    "createTime": [
      2024,
      6,
      5,
      10,
      40,
      38
    ],
    "updateTime": [
      2024,
      6,
      5,
      10,
      40,
      38
    ],
    "deleted": 0,
    "code": "140000000000",
    "name": "",
    "cityCode": "4",
    "parentCode": "100000000000",
    "type": 1
  },
])
const district_level = ref([
  {
    "id": 4,
    "createTime": [
      2024,
      6,
      5,
      10,
      40,
      38
    ],
    "updateTime": [
      2024,
      6,
      5,
      10,
      40,
      38
    ],
    "deleted": 0,
    "code": "140000000000",
    "name": "",
    "cityCode": "4",
    "parentCode": "100000000000",
    "type": 1
  },
])
const citys = ref([
  {
    "id": 4,
    "createTime": [
      2024,
      6,
      5,
      10,
      40,
      38
    ],
    "updateTime": [
      2024,
      6,
      5,
      10,
      40,
      38
    ],
    "deleted": 0,
    "code": "140000000000",
    "name": "",
    "cityCode": "4",
    "parentCode": "100000000000",
    "type": 1
  },
])
const information_data = ref<any>({
  acsCount: 0,
  acsPersonPictureCount: 0,
  acsWhitePersonCount: 0,
  buildingCount: 0,
  ipcCount: 0,
  ipcOnlineCount: 0
})//统计数据
const handle_provincial = async (value: any) => {
  code_rizes.value = value.code
  ruleForm.value.provinceCode = value.code
  ruleForm.value.provinceName = value.name

  ruleForm.value.cityCode = ''
  ruleForm.value.cityName = ''
  ruleForm.value.areaCode = ''
  ruleForm.value.areaName = ''
  await city_level(code_rizes.value)
}
const handle_district = (value: any) => {
  code_rizes.value = value.code
  ruleForm.value.areaCode = value.code
  ruleForm.value.areaName = value.name

}
const handle_citys = async (value: any) => {
  code_rizes.value = value.code
  ruleForm.value.cityCode = value.code
  ruleForm.value.cityName = value.name
  ruleForm.value.areaCode = ''
  ruleForm.value.areaName = ''
  await districts(code_rizes.value)
}
const handle_edit = () => {
  ruleForm.value = JSON.parse(JSON.stringify(details_data.value))
  dialogVisible.value = true
  codes()
}
const handle_copy = () => {
  navigator.clipboard.writeText(details_data.value.code)
      .then(() => {
        message(t('复制成功'), {type: 'success'})
      })
      .catch((error) => {
        message(t('复制失败'), {type: 'error'})
      });
}

const handle_account = () => {
  account_flag.value = true
}
const handle_account_dialog = (flag: boolean, status: string) => {
  account_flag.value = flag
  if (status === 'cancel') return true
  details(plotId)

}
const codes = async () => {
  const res = await region_codes(code_rizes.value)
  provincial_level.value = res.data.data
}
const districts = async (data: number) => {
  const res = await region_codes(data)
  district_level.value = res.data.data
}
const city_level = async (data: number) => {
  const res = await region_codes(data)
  citys.value = res.data.data
}
//弹框确认
const handle_save = async () => {
  ruleForm_ref.value?.validate(async (valid, fields) => {
    if (valid) {
      await plot_edit(ruleForm.value)
      let a: any = JSON.parse(localStorage.getItem('user'));
      a.plotName = ruleForm.value.name
      localStorage.setItem('user', JSON.stringify(a));
      // mitter.emit(event.AFTER_ROUTE_CHANGE);
      await UserStore.init_dashboard()
      dialogVisible.value = false
    } else {
      console.log('提交错误', fields);
    }
  });
};
//弹框却笑
const handle_close = () => {
  if (!ruleForm_ref.value) return
  ruleForm_ref.value.resetFields()
  code_rizes.value = 100000000000
  dialogVisible.value = false
}
const details = async (id: number) => {
  const res = await organizational({
    id: id
  })
  if (res.data.code === 200) {
    details_data.value = res.data.data
  }
}
const plot_edit = async (data: any) => {
  const res = await edit_plot(data)
  if (res.data.code === 200) {
    await details(plotId)
    message(t('编辑成功'), {type: 'success'})
  } else {
    message(res.data.message, {type: 'error'})
  }
}

const init_information = async (plotId: number) => {
  const res = await information(plotId)
  if (res.data.code === 200) {
    information_data.value = res.data.data
  }
}

onMounted(() => {
  details(plotId)
  init_information(plotId)
})
// const route = useRoute();
//
//
// watch(
//     route,
//     async () => {
//       await details(plotId)
//       await init_information(plotId)
//     },
//     { immediate: true },
// );
</script>

<style lang="scss" scoped>
.left_top {
  width: 100%;
  height: 335px;
  background-color: #F8F8F8;

  .top {
    display: flex;

    .company_box {
      .company {
        display: flex;
        align-items: center; /* 垂直居中对齐 */

        .company_span {
          margin-left: 12px;
          font-size: 14px;
          color: #333333;
          font-weight: 700;
        }

        .company_last {
          background-color: #3B81F4;
          color: #ffffff;
          margin-left: 12px;
          width: 65px;
          height: 25px;
          display: flex;
          align-items: center; /* 水平居中对齐 */
          justify-content: center; /* 水平居中对齐 */
        }

        .edit_img {
          margin-left: 12px;
          cursor: pointer;
        }
      }

      .address {
        margin: 4px 0 0 12px;
        color: #999999;
      }
    }
  }

  .left_content {
    margin-top: 16px;
    display: flex;

    .content_box {
      align-items: center; /* 垂直居中对齐 */
      justify-content: center; /* 水平居中对齐 */
      display: flex;
      width: 200px;
      height: 64px;
      background: #F5F6FF;
      border-radius: 8px;
      margin-right: 8px;

      .content_box_image {
        width: 40px;
        height: 40px;
        margin-right: 25px;
      }

      .mobile_font {
        font-size: 14px;
        margin-bottom: 5px;
      }

      .person {
        margin: 16px 0 0 -20px;
      }

      .floor {
        font-weight: 400;
        font-size: 16px;
        color: #333333;
      }
    }
  }

  .dialog_header {
    font-size: 18px;
    color: #333333;
    //border-bottom: 1px solid #333333;
  }

  .dialog_buttom {
    height: 1px;
    border: 1px solid #A3A6AD;
    margin: 16px 0;
    width: 680px;

  }

  .demo_ruleForm {
    .location {
      display: flex; /* 将 .location 设置为弹性容器 */
      .location_select {
        width: 380px;
      }

    }

    .buildings {
      width: 140px;
      margin-right: 10px;
    }

    .location > * {
      flex: 1; /* 子元素平均占据可用空间 */
      margin-right: 10px; /* 设置子元素之间的右边距 */
    }

    .location > *:last-child {
      margin-right: 0; /* 移除最后一个子元素的右边距 */
    }
  }

}
</style>
