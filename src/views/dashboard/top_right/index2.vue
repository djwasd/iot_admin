<template>
  <el-card class="top_content">
    <div class="title">今日考勤</div>
    <div class="content">
      <mEcharts :height="state.height" :options="state.options" :width="state.width" class="echarts"></mEcharts>


    </div>

  </el-card>


</template>

<script lang="ts" name="top_content" setup>
import mEcharts from '@/common/echartsCustom/EchartsCustom.vue'
import {shallowReactive} from "vue";
import {useLocalesI18n} from "@/locales/hooks";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'top_right']);

const state = shallowReactive({
  height: '200px',
  width: '500px',
  options: {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: "vertical",
      left: '50%',
      top: 'center',
      itemGap: 10,

      // 垂直安放位置，默认为全图顶端，可选为：

      formatter: function (name) {
        const data = state.options.series[0].data;
        const item = data.find(item => item.name === name);
        if (item) {
          return name + ' : ' + item.value;
        }
        return name;
      }
    },
    series: [
      {
        name: t('今日考勤'),
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 10,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        center: ['20%', '50%'], // 调整水平偏移量
        data: [
          {value: 1048, name: '已打卡'},
          {value: 735, name: '未打卡'},
          {value: 580, name: '迟到'},
          {value: 484, name: '早退'},
          {value: 300, name: '异常考勤'},
          {value: 300, name: '抽烟'}
        ]
      }
    ]
  }
})

</script>

<style lang="scss" scoped>
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

      flex: 0 0 auto; /* 禁止饼图自动缩放 */
    }
  }


}
</style>
