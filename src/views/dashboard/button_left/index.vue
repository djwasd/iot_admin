<template>
  <el-card class="top_content">
    <div class="title">快捷功能</div>
    <div class="photo_top">
      <router-link v-for="(item, index) in date" :key="item.id" :to="item.link" class="photo_item">
        <img :src="item.images">
        <div class="text">{{ item.title }}</div>
      </router-link>
    </div>
  </el-card>
</template>

<script lang="ts" name="top_content" setup>
import addDevice from '@/assets/images/png/addDevice.png'
import personnel from '@/assets/images/png/personnel.png'
import registration from '@/assets/images/png/registration.png'
import surveillance from '@/assets/images/png/surveillance.png'

const date = ref([
  {images: addDevice, title: '添加设备', id: 1, link: '/management/device'},
  {images: personnel, title: '人员录入', id: 2, link: '/personnel/configuration'},
  {images: registration, title: '来访登记', id: 3, link: '/visitor/code'},
  {images: addDevice, title: '考勤规则', id: 4, link: '/attendance/rules'},
  {images: surveillance, title: '视频监控', id: 5, link: '/preview/video'},
])

</script>


<style lang="scss" scoped>
.top_content {
  width: 100%;
  height: 425px;
  border-radius: 8px;

  .title {
    font-size: 18px;
    font-weight: 700;
  }

  .photo_top {
    margin-top: 25px;
    margin-left: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 50px;

    .photo_item {
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 50px;
        height: 50px;
      }

      .text {
        //margin-top: 6px;
        text-align: center;
      }
    }
  }
}
</style>
