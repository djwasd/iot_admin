<template>
  <el-card class="top_content">
    <div class="title">今日考勤</div>
    <div class="content">
      <mEcharts class="echarts" :options="state.options" :height="state.height" :width="state.width"></mEcharts>
      <!--      <div class="content_left">左边</div>-->
      <div class="content_right">
        <div class="Below">
          <div v-for="(item, index) in buttons" :key="index" class="buttom">
            <div class="button_row">
              <div :style="{ backgroundColor: item.backgroundColor }" class="radio"></div>
              <span class="label">{{ item.name }}</span>
            </div>
            <CountTo
                :autoplay="true"
                :duration="3000"
                :endVal="item.value"
                :startVal="0"
                class="layout"
            ></CountTo>
          </div>
        </div>
      </div>
    </div>

  </el-card>


</template>

<script setup lang="ts" name="top_content">
import  mEcharts from '@/common/echartsCustom/EchartsCustom.vue'
import {shallowReactive} from "vue";
import {useLocalesI18n} from "@/locales/hooks";
import {CountTo} from 'vue3-count-to';
import {useUserStore} from "@/store";
import {attendance} from "@/api/dashboard";
const { t } = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'top_right']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const buttons = ref<any>([])
const attendance_data = ref({
  "abnormalCount": 1, //异常
  "absenteeismCount": 2, //旷工
  "clockedCount": 3, //已打卡
  "lateCount": 4, //迟到
  "leaveEarlyCount": 5, //早退
  "noClockedCount": 6 //未打卡
})
const pic_data = ref<any>([])
const state = ref({
  height:'200px',
  width:'160px',
  options : {
    tooltip: {
      trigger: 'item',
      position: 'right',
      align: 'left'
    },
    series: [
      {
        name: '今日考勤',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'], // 将横坐标百分比减少 10%

        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: pic_data.value
      }
    ]
  }
})

const attendance_list  = async (plotId: number) => {
  const res = await attendance(plotId)
  if (res.data.code ===200){
    attendance_data.value = res.data.data
    buttons.value = [
      {  value: attendance_data.value.clockedCount,name: '已打卡', backgroundColor: '#3B81F4' },
      {  value: attendance_data.value.noClockedCount,name: '未打卡', backgroundColor: '#FF8F1F' },
      { value: attendance_data.value.lateCount, name: '迟到', backgroundColor: '#FF8F1F' },
      {  value: attendance_data.value.leaveEarlyCount,name: '早退', backgroundColor: '#8A38F5' },
      { value: attendance_data.value.abnormalCount, name: '异常考勤', backgroundColor: '#EB2F96' },
      {  value: attendance_data.value.absenteeismCount,name: '旷工', backgroundColor: '#FA5151' },
    ]
  }
  pic_data.value =  buttons.value.map(item => {
    const { backgroundColor, ...rest } = item;
    return rest;
  });
}
onMounted(async () => {
  await attendance_list(plotId)
  watch(pic_data.value,
      (newData) => {
        console.log(newData, '--newData')
        state.value.options.series[0].data = newData;
      }, {immediate: true});

})

</script>

<style scoped lang="scss">
.top_content {
  width: 100%;
  height: 260px;
  border-radius: 8px;

  .title {
    font-size: 18px;
    font-weight: 700;
  }

  .content {
    display: flex;
    align-items: flex-start; /* 垂直对齐方式设置为顶部对齐 */
    justify-content: space-between; /* 设置为两端对齐 */

    .echarts {
      /* 调整饼图的样式 */
      margin-right: 20px; /* 调整饼图与右侧内容的间距 */
      flex: 0 0 auto; /* 禁止饼图自动缩放 */
    }

    .content_right {
      margin-top: 15px;
      /* 右侧内容样式 */
      flex: 1 1 auto; /* 允许右侧内容自动缩放 */
    }
  }

  .Below {
    /* 下方按钮区域样式 */
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start; /* 垂直对齐方式设置为顶部对齐 */
    margin-top: 20px;
    .buttom {
      align-items: center;
      width: 90px;
      margin: 0 0 10px 10px;

      .button_row {
        display: flex;
        align-items: center;

        .radio {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: black;
          margin-right: 5px;
          margin-top: -10px;
        }

        .label {
          font-size: 14px;
          color: #666666;
          margin-bottom: 10px;
        }
      }

      .layout {
        font-size: 18px;
        font-weight: 700;
        margin: 20px 0 0 9px;
      }
    }
  }
}
</style>
