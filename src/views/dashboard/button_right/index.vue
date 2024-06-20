<template>
  <el-card class="top_content">
    <div class="top">
      <div class="title">实时通行记录</div>

      <router-link class="photo_item" to="/example/permission">
        <div class="top_right">查看详情></div>
      </router-link>
    </div>

    <div class="floot">
      <div class="floot_top">
        <div class="floot_content">姓名</div>
        <div class="floot_content">验证方式</div>
        <div class="floot_content">设备位置</div>
        <div class="floot_content end">设备位置</div>
      </div>
      <vue3-seamless-scroll
          class="scroll"
          v-model="isScroll"
          :list="message"
          :step="0.3"
          :hover="true"
          :limit-scroll-num="3"
          :wheel="true"
      >
        <div v-for="item in message" :key="item.id" class="floot_button">
          <div class="button_content">{{ item.name }}</div>
          <div class="button_content">{{ item.License }}</div>
          <div class="button_content person">{{ item.Imitated_person }}</div>
          <div class="button_content end">{{ item.start_time }}</div>
        </div>
      </vue3-seamless-scroll>

    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll';
import {ref} from 'vue';
const isScroll=ref(true) //开始滾動


const message = ref([
  {id:1,name: '庄彬', License:'刷卡',Imitated_person:'6栋C出口2号机' ,start_time:'2024-04-01-08:00' },
  {id:2,name: '庄彬', License:'刷卡',Imitated_person:'6栋C出口2号机' ,start_time:'2024-04-01-08:00' },
  {id:3,name: '庄彬', License:'刷卡',Imitated_person:'6栋C出口2号机' ,start_time:'2024-04-01-08:00' },
  {id:4,name: '庄彬', License:'刷卡',Imitated_person:'6栋C出口2号机' ,start_time:'2024-04-01-08:00' },
  {id:5,name: '庄彬', License:'刷卡',Imitated_person:'6栋C出口2号机' ,start_time:'2024-04-01-08:00' },
  {id:6,name: '庄彬', License:'刷卡',Imitated_person:'6栋C出口2号机' ,start_time:'2024-04-01-08:00' },
  {id:7,name: '庄彬', License:'刷卡',Imitated_person:'6栋C出口2号机' ,start_time:'2024-04-01-08:00' },
  {id:8,name: '庄彬', License:'刷卡',Imitated_person:'6栋C出口2号机' ,start_time:'2024-04-01-08:00' },
  {id:9,name: '庄彬', License:'刷卡',Imitated_person:'6栋C出口2号机' ,start_time:'2024-04-01-08:00' },
  {id:10,name: '庄彬', License:'刷卡',Imitated_person:'6栋C出口2号机' ,start_time:'2024-04-01-08:00' },
  {id:11,name: '庄彬', License:'刷卡',Imitated_person:'6栋C出口2号机' ,start_time:'2024-04-01-08:00' },

])
</script>

<style lang="scss" scoped>
.top_content {
  width: 100%;
  height: 495px;
  border-radius: 8px;
  //overflow: auto;

  .top {
    display: flex;
    justify-content: space-between;

    .title {
      font-size: 18px;
      font-weight: 700;
    }

    .top_right {
      color: #3B81F4;
      font-size: 14px;
    }
  }



  .box {
    width: 166px;
    height: 120px;
    border: 1px solid #333333;
    border-radius: 8px;
    background: #F5F6FF;
    margin-right: 10px;

    .box_top {
      height: 48px;
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

  .floot {
    .floot_top {
      display: flex;
      flex-wrap: nowrap;
      overflow: hidden;
      margin-top: 24px;
      .floot_content {
        margin-right: 30px;
        width: 100px;
      }
      .end {
        width: 120px;
        margin-left: 9px;
      }

    }
    .scroll{
      /* 必需要设置合适的高,因为他的原理是往列表最后添加列表重复元素，所以这个组件高不要大于其内容原先的最大高度 */
      height: 400px;
      width:100%;
      overflow: hidden;
      .floot_button {
        display: flex;
        flex-wrap: nowrap;
        overflow: hidden;
        margin-top: 15px;
        height: 100%;
        .button_content {
          margin-right: 30px;
          width: 100px;
        }
        .end {
          width: 140px;
        }
        .person {
          width: 110px;
        }
      }
    }

  }
}
</style>
