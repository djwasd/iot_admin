<template>
  <div class="person">
    <div class="device">{{ t('访客记录') }}</div>
    <div class="function">
      <div class="function_left">
        <el-form :model="form_list" ref="form_ref" :rules="rules" label-width="auto" class="form">
          <el-form-item :label="t('访客')" class="form_item">
            <el-input v-model="form_list.visitName" :placeholder="t('请输入')+t('访客')+t('姓名')"/>
          </el-form-item>
          <el-form-item class="form_item" :label="t('被访人')">
            <el-input v-model="form_list.interviewee" :placeholder="t('请输入')+t('被访人')+t('姓名')"/>
          </el-form-item>
          <el-form-item class="form_item" :label="t('手机号')" prop="phone">
            <el-input v-model="form_list.phone" :placeholder="t('请输入')+t('手机号')"/>
          </el-form-item>
          <el-form-item class="form_item" :label="t('车牌号')">
            <el-input v-model="form_list.visitorPlateNumber" :placeholder="t('请输入')+t('车牌号')"/>
          </el-form-item>
          <el-form-item class="form_item" :label="t('来访时间')">
            <el-date-picker
                v-model="form_list.time"
                type="datetimerange"
                :start-placeholder="t('开始日期')"
                :end-placeholder="t('结束日期')"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="x"

            />
          </el-form-item>
          <el-form-item class="form_item" >
           <el-button type="primary" @click="handle_search">{{t('搜素')}}</el-button>
          </el-form-item>
          <el-form-item class="form_item" >
            <el-button @click="handle_rest">{{t('重置')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="table-wrapper">
      <el-table
          :data="visitor_data.records"
          style="width: 100%"
          ref="multiple_Ref"
      >
        <el-table-column
            :index="set_index"
            :label="t('序号')"
            prop="Number"
            type="index"
            width="80"
        >
        </el-table-column>
        <el-table-column prop="id" :label="t('访客')+t('名称')"  />
        <el-table-column prop="id" :label="t('手机号')"  />
        <el-table-column prop="id" :label="t('车牌号')"  />
        <el-table-column prop="id" :label="t('来访事由')"  />
        <el-table-column prop="id" :label="t('来访时间')"  />
        <el-table-column prop="id" :label="t('抓拍照片')"  />

      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
          v-model:current-page="current_page"
          v-model:page-size="page_size"
          layout="prev, pager, next, jumper"
          :total="visitor_data.total"
          @current-change="handleCurrentChange"
      />

    </div>
  </div>
</template>



<script setup lang="ts">
import {useLocalesI18n} from "@/locales/hooks";
import {useUserStore} from "@/store";
import {type FormInstance, FormRules} from "element-plus";
import {visitor_record} from "@/api/visitor";
const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'visitor']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const form_ref = ref<FormInstance>(); //拿到当前ref实力

const current_page = ref(0);//当前页数
const page_size = ref(12); //每页显示条目个数
const form_list = ref({
  visitName:'',//访客名称
  interviewee:'',//被访者
  phone:'',//手机号
  visitorPlateNumber:'',//访客车牌号
  time:[]
})
const form_copy = ref({
  visitName:'',//访客名称
  interviewee:'',//被访者
  phone:'',//手机号
  visitorPlateNumber:'',//访客车牌号
  time:[]
})
const rules = computed<FormRules>(() => ({
  phone: [
    { validator: validateMobile, trigger: 'blur' }
  ],

}));
const visitor_data = ref({
  "records": [],
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
const handleCurrentChange =async (val:number) => {
  current_page.value = val;
  await search()

};
const set_index = (index:number)=>{
  if (current_page.value >=1){
    return (current_page.value -1) * page_size.value + index + 1

  }else  {
    return (current_page.value ) * page_size.value + index + 1

  }
}
const handle_search = ()=>{
  console.log(form_list.value,'--111')
  form_ref.value?.validate(async (valid:boolean, fields:any) => {
    if (valid) {
      await search()
    } else {
      console.log('提交错误', fields);
    }
  });

}
const search =async ()=>{
  if (form_list.value.time.length===0){
    await visitor_all(
        plotId,
        current_page.value,
        page_size.value,
        form_list.value.visitName,
        form_list.value.interviewee,
        form_list.value.phone,
        form_list.value.visitorPlateNumber,
    )

  }
  else {
    await visitor_all(
        plotId,
        current_page.value,
        page_size.value,
        form_list.value.visitName,
        form_list.value.interviewee,
        form_list.value.phone,
        form_list.value.visitorPlateNumber,
        form_list.value.time[0],
        form_list.value.time[1],
    )
  }
}
const handle_rest = ()=>{
  if (!form_ref.value) return
  form_ref.value.resetFields()
  form_list.value = JSON.parse(JSON.stringify(form_copy.value))
}
const validateMobile = (rule: any, value: string, callback: (error?: Error) => void) => {
  if (value && !/^1([3456789])[0-9]\d{8}$/.test(value)) {
    callback(new Error(t('请输入')+t('正确的手机号')));
  } else {
    callback();
  }
};

const visitor_all = async (
    plotId: number,
    page: number,
    size: number,
    visitName?: string,
    interviewee?: string,
    phone?: string,
    visitorPlateNumber?: string,
    startTimestamp?: number,
    endTimestamp?: number
) => {
  const res = await visitor_record(plotId, page, size, visitName, interviewee, phone, visitorPlateNumber, startTimestamp, endTimestamp)
  console.log(res, '--res')
  if (res.data.code === 200) {
    visitor_data.value = res.data.data
  }
}
onMounted(()=>{
  visitor_all(plotId,current_page.value,page_size.value)
})
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
  .function {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    .function_left {
      .dropdown {
        margin: 0 10px;
      }
      .form {
        display:flex;
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
