<template>
  <el-card class="top_content">
    <div class="title">今日考勤</div>
    <div class="content">
      <mEcharts :height="state.height" :options="state.options" :width="state.width" class="echarts"></mEcharts>
      <!--      <div class="content_left">左边</div>-->
      <div class="content_right">
        <div class="Below">
          <div v-for="(item, index) in buttons" :key="index" class="buttom">
            <div class="button_row">
              <div :style="{ backgroundColor: item.backgroundColor }" class="radio"></div>
              <span class="label">{{ item.label }}</span>
            </div>
            <CountTo
                :autoplay="true"
                :duration="3000"
                :endVal="item.endVal"
                :startVal="0"
                class="layout"
            ></CountTo>
          </div>
        </div>
      </div>
    </div>

  </el-card>


</template>

<script lang="ts" name="top_content" setup>
import mEcharts from '@/common/echartsCustom/EchartsCustom.vue'
import {shallowReactive} from "vue";
import {CountTo} from 'vue3-count-to';

const state = shallowReactive({
  height: '160px',
  width: '160px',
  options: {
    tooltip: {
      trigger: 'item'
    },

    series: [
      {
        name: '今日考勤',
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
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
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

const buttons = ref([
  {label: '已打卡', endVal: 80475, backgroundColor: '#3B81F4 '},
  {label: '未打卡', endVal: 19935, backgroundColor: '#FF8F1F'},
  {label: '迟到', endVal: 9999, backgroundColor: '#FF8F1F '},
  {label: '早退', endVal: 2188, backgroundColor: '#8A38F5'},
  {label: '异常考勤', endVal: 14, backgroundColor: '#EB2F96'},
  {label: '抽烟', endVal: 123, backgroundColor: '#FA5151'},
])
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
      /* 调整饼图的样式 */
      margin-right: 20px; /* 调整饼图与右侧内容的间距 */
      flex: 0 0 auto; /* 禁止饼图自动缩放 */
    }

    .content_right {

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
