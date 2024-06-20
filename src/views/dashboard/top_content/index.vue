<template>
  <el-card class="top_content">
    <div class="title">今日事件</div>
    <div class="top">
      <div class="top_left">
        <img src="@/assets/images/png/process.png">
        <div class="top_right">
          <div>已处理</div>

          <CountTo
              :autoplay=true
              :duration="3000"
              :endVal="7024"
              :startVal="0"
              class="count">
          </CountTo>
        </div>

      </div>
      <div class="top_left" style="background-color:  #FCEDED;">
        <img src="@/assets/images/png/noProcess.png">
        <div class="top_right">
          <div>未处理</div>

          <CountTo
              :autoplay=true
              :duration="3000"
              :endVal="7024"
              :startVal="0"
              class="count">
          </CountTo>
        </div>
      </div>
    </div>
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
  </el-card>
</template>

<script lang="ts" name="top_content" setup>
import {CountTo} from 'vue3-count-to';
const buttons = ref([
      {label: '陌生人', endVal: 9999, backgroundColor: '#FF8F1F'},
      {label: '区域入侵', endVal: 9999, backgroundColor: '#FA5151'},
      {label: '伴线入侵', endVal: 9999, backgroundColor: '#FA5151 '},
      {label: '未戴安全帽', endVal: 122, backgroundColor: '#FF8F1F'},
      {label: '未着工装', endVal: 425, backgroundColor: '#FF8F1F'},
      {label: '明火', endVal: 14, backgroundColor: '#FA5151'},
      {label: '抽烟', endVal: 123, backgroundColor: '#FF8F1F'},
      {label: '接打电话', endVal: 9999, backgroundColor: '#FA5151'},
    ]
)
</script>


<style lang="scss" scoped>
.top_content {
  width: 100%;
  height: 335px;
  border-radius: 8px;

  .title {
    font-size: 18px;
    font-weight: 700;
  }

  .top {
    display: flex;
    margin: 10px 0;

    .top_left {
      img {
        width: 35px;
        height: 35px;
        margin: 30px 0 0 35px;
      }

      border-radius: 8px;

      display: flex;
      width: 368px;
      height: 88px;
      background-color: #e0fef4;
      margin-right: 10px;

      .top_right {
        margin: 18px 0 0 25px;

        .count {
          margin-top: 5px;
          font-size: 24px;
          font-weight: 700;
        }
      }
    }
  }

  .Below {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start; /* 垂直对齐方式设置为顶部对齐 */

    .buttom {
      align-items: center;
      //margin-left: 10px;
      width: 150px;
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