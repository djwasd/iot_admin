<template>
  <div class="person">
    <div class="device">{{ t('访客统计') }}</div>
    <div class="box-wrapper">
      <div v-for="item in date" :key="item.id" class="box">
        <div class="box_top">{{ item.title }}</div>
        <div class="box_button">
          <CountTo
              :autoplay=true
              :duration="3000"
              :endVal="item.num"
              :startVal="0"
              class="count">
          </CountTo>
        </div>
      </div>
    </div>
    <div class="person_echarts">
      <div class="left-box">
        <div class="left">日访客数据统计</div>
          <mEcharts style="margin-top: -20px" :options="state_left.options" :height="state_left.height" :width="state_left.width"></mEcharts>
        <div class="date_packer">
          <el-date-picker
              v-model="left_picker"
              @change="handle_picker_left"
              type="date"
              style="width: 130px;"
              value-format="x"
          />
        </div>
      </div>
      <div class="right-box">
        <div class="left">月访客数据统计</div>
        <mEcharts  style="margin-top: -20px"  :options="state_right.options" :height="state_right.height" :width="state_right.width"></mEcharts>
        <div class="date_packer">
          <el-date-picker
              v-model="right_picker"
              type="month"
              style="width: 130px;"
              value-format="x"
              @change="handle_picker_right"
          />
        </div>
      </div>
    </div>

  </div>
</template>



<script setup lang="ts">
import {CountTo} from 'vue3-count-to';
import {useLocalesI18n} from "@/locales/hooks";
import  mEcharts from '@/common/echartsCustom/EchartsCustom.vue'
import {visitor_pic, visitor_statistics} from "@/api/visitor";
import {useUserStore} from "@/store";
import {convertTimestampToYearMonth} from "@/utils/packagingmethod/time";
const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'visitor']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const visitor_data =ref({
  monthCount: 0,
  todayArriveCount: 0,
  todayBookCount: 0,
  todayNotArriveCount: 0
})
const date = ref([
  {title: t('今日预约'), num: 16, id: 1},
  {title: t('今日来访'), num: 9, id: 2},
  {title: t('今日未到访'), num: 10, id: 3},
  {title: t('本月来访'), num: 5, id: 4},
]);

const left_picker = ref(Date.now())
const right_picker =ref(Date.now())
const pic_day = ref({
  graphs: [
    {
      "time": 0,
      "total": 0
    }
  ]
})
const day_time =ref<number[]>([])
const day_total =ref<number[]>([])
const month_time =ref<number[]>([])
const month_total =ref<number[]>([])

const pic_month = ref({
  graphs: [
    {
      "time": 0,
      "total": 0
    }
  ]
})
const state_left = reactive({
  height:'400px',
  width:'100%',
  options:{
    xAxis: {
      type: 'category',
      data: day_time.value,
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: day_total.value,
        type: 'line',
        smooth: true
      }
    ]
  }
})
const state_right = reactive({
  height:'400px',
  width:'100%',
  options:{
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: month_time.value,
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: month_total.value,
        type: 'line',
        smooth: true
      }
    ]
  }
})
const handle_picker_left =(value:number)=>{
  console.log(value,'--vlaue')
  let time =convertTimestampToYearMonth(value)
  init_date(plotId,2,time.year,time.month,time.day)

}
const handle_picker_right =(value:number)=>{
  console.log(value,'--vlaue')
  let time =convertTimestampToYearMonth(value)
  init_date(plotId,3,time.year,time.month)

}

const visitor = async (plotId: number) => {
  const res = await visitor_statistics(plotId)
  visitor_data.value =res.data.data
  date.value =   replaceNumWithBValues(date.value, {
    1:   visitor_data.value.todayBookCount,
    2:   visitor_data.value.todayArriveCount,
    3:   visitor_data.value.todayNotArriveCount,
    4:   visitor_data.value.monthCount,


  });
}
const  replaceNumWithBValues = (dateList:any, bValues:any)=> {
  return dateList.map(item => {
    if (bValues.hasOwnProperty(item.id)) {
      return { ...item, num: bValues[item.id] };
    }
    return item;
  });
}
const init_date = async (plotId: number, statType: number, year?: number, month?: number, day?: number) => {
  const res = await visitor_pic(plotId, statType, year, month, day)
  if (statType ===2){
    pic_day.value =res.data.data
    day_time.value =  pic_day.value.graphs.map(item => item.time);
    day_total.value = pic_day.value.graphs.map(item => item.total);
  }else {
    pic_month.value = res.data.data
    month_time.value =  pic_month.value.graphs.map(item => item.time);
    month_total.value = pic_month.value.graphs.map(item => item.total);
  }
}

onMounted(async () => {
  let time = convertTimestampToYearMonth(Date.now());
  await visitor(plotId);
  await init_date(plotId, 2, time.year, time.month, time.day);
  await init_date(plotId, 3, time.year, time.month);
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
  .box-wrapper {
    padding: 20px 0 0 20px;

    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    margin-top: 24px;
    .box {
      width: 145px;
      height: 100px;
      border: 1px solid #333333;
      border-radius: 8px;
      background: #F5F6FF;
      margin-right: 15px;

      .box_top {
        height: 40px;
        background: #808CFF;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .box_button {
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        //margin: 14px;
        margin-top: 14px;
      }
    }
  }
  .person_echarts {
    display: flex;
    flex-wrap: wrap;
    .left-box {
      flex: 1;
      height: 400px;
      margin: 10px;
      position: relative;
      .left {
        padding: 30px 0 0 30px;
      }
      .date_packer {
        position: absolute;
        top: 30px;
        right: 100px;
      }
    }

    .right-box {
      flex: 1;
      height: 400px;
      margin: 10px;
      position: relative;
      .left {
        padding: 30px 0 0 30px;
      }
      .date_packer {
        position: absolute;
        top: 30px;
        right: 100px;
      }
    }
  }

}
</style>
