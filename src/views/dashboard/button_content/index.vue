<template>
  <el-card class="top_content">
    <div class="top">
      <div class="title">{{ t('快捷功能') }}</div>

      <router-link class="photo_item" to="/visitor/statistics">
        <div class="top_right">{{ t('查看详情') }}></div>
      </router-link>
    </div>
    <div class="box-wrapper">
      <div v-for="item in date" :key="item.id" class="box">
        <div class="box_top">{{ item.title }}</div>
        <div class="box_button">
          <CountTo
              :autoplay=true
              :duration="3000"
              :endVal="Math.abs (item.num)"
              :startVal="0"
              class="count">
          </CountTo>
        </div>
      </div>
    </div>
    <div class="floot">
      <div class="floot_top">
        <div class="floot_content">{{ t('访客姓名') }}</div>
        <div class="floot_content">{{ t('车牌号') }}</div>
        <div class="floot_content">{{ t('被访人') }}</div>
        <div class="floot_content end">{{ t('拜访事由') }}</div>
        <div class="floot_content end">{{ t('来访时间') }}</div>
      </div>
      <vue3-seamless-scroll
          v-model="isScroll"
          :hover="true"
          :limit-scroll-num="3"
          :list="traffic_records"
          :step="0.3"
          :wheel="true"
          class="scroll"
      >
        <div v-for="item in traffic_records.records" :key="item.id" class="floot_button">
          <div class="button_content">{{ item.visitName }}</div>
          <div class="button_content">{{ item.visitorPlateNumber }}</div>
          <div class="button_content">{{ item.interviewee }}</div>
          <div class="button_content end">{{ item.visitReason }}</div>
          <div class="button_content end">{{ format_data(item.visitTimestamp) }}</div>
        </div>
      </vue3-seamless-scroll>

    </div>
  </el-card>
</template>

<script lang="ts" setup>
import {CountTo} from 'vue3-count-to';

import {Vue3SeamlessScroll} from 'vue3-seamless-scroll';
import {ref} from 'vue';
import {visitor_statistics} from "@/api/dashboard";
import {useUserStore} from "@/store";
import {visitor_record} from "@/api/visitor";
import {format_data} from "@/utils/packagingmethod/time";
import {useLocalesI18n} from "@/locales/hooks";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'dashboard']);

const isScroll = ref(true) //开始滾動
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const current_page = ref(0);//当前页数
const page_size = ref(20); //每页显示条目个数
const visitor_data = ref({
  monthCount: 0,
  todayArriveCount: 0,
  todayBookCount: 0,
  todayNotArriveCount: 0
})
const traffic_records = ref({
  records: [
    {
      id: 0,
      interviewee: "",
      phone: "",
      uuid: "",
      visitName: "",
      visitReason: "",
      visitTimestamp: 0,
      visitorPlateNumber: ""
    }
  ],
})
const date = ref([
  {title: t('本月来访'), num: 16, id: 1},
  {title: t('今日来访'), num: 9, id: 2},
  {title: t('今日预约'), num: 10, id: 3},
  {title: t('今日未到访'), num: 5, id: 4},
]);

const route = useRoute();

const visitor = async (plotId: number) => {

  const res = await visitor_statistics(plotId)
  if (res.data.code === 200) {
    visitor_data.value = res.data.data
    date.value = replaceNumWithBValues(date.value, {
      1: visitor_data.value.monthCount,
      2: visitor_data.value.todayArriveCount,
      3: visitor_data.value.todayBookCount,
      4: visitor_data.value.todayNotArriveCount,
    });
  }
}
const replaceNumWithBValues = (dateList: any, bValues: any) => {
  return dateList.map(item => {
    if (bValues.hasOwnProperty(item.id)) {
      return {...item, num: bValues[item.id]};
    }
    return item;
  });
}
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
    traffic_records.value = res.data.data
  }
}
onMounted(() => {
  visitor(plotId)
  visitor_all(plotId, current_page.value, page_size.value)
})

</script>

<style lang="scss" scoped>
.top_content {
  width: 100%;
  height: 425px;
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

  .box-wrapper {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    margin-top: 24px;
  }

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

  .floot {
    .floot_top {
      display: flex;
      flex-wrap: nowrap;
      overflow: hidden;
      margin-top: 15px;

      .floot_content {
        margin-right: 30px;
        width: 100px;
      }

      .end {
        width: 140px;
      }

    }

    .scroll {
      /* 必需要设置合适的高,因为他的原理是往列表最后添加列表重复元素，所以这个组件高不要大于其内容原先的最大高度 */
      height: 200px;
      width: 100%;
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
      }
    }

  }
}
</style>
