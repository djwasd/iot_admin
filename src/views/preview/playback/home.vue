<template>
  <div class="container_top">

    <div class="grid-item">
      <div class="main">
        <div class="conter" ref="box" style="height:100%;">
          <el-row :gutter="10" style="    height: 100%;">
            <el-col v-for="(n, index) in state.fornum" :key="index" :xs="24" :sm="24" :md="state.clonum"
                    :lg="state.clonum" :xl="state.clonum" :class="state.videoclass" style="padding:2px">
              <div class="video-wrapper" :style="state.videoclass" :id="`videoid${n}`">
                <div class="video-inner live hide-waiting"
                     style="">
                  <div class="alt">
                    <div class="talbetop">
                      <table>
                        <tr>
                          <td>
                            111111111111
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="bottom-box">
      <div class="icons-container"  >

        <img
            :src="item.icon"
            v-for="(item, index) in icons"
            :key="item.id"
            class="icon"
            @click="handleIconClick(item)"
        />
      </div>
      <div class="screen-icon-container">
        <!-- <me-icon-screen  ></me-icon-screen> -->
      </div>
    </div>
  </div>
</template>
<script setup >
import { ref,reactive  } from "vue";
import blue_first from '@/assets/images/png/blue_first.png';
import blue_four from '@/assets/images/png/blue_first.png';
import blue_nine from'@/assets/images/png/blue_first.png';
import first from '@/assets/images/png/blue_first.png';
import four from '@/assets/images/png/blue_first.png';
import nine from '@/assets/images/png/blue_first.png';
const num = ref(1)
const icons = ref([
  { icon: blue_first, id: 1, active: false, image: blue_first, originalIcon: first,clo:24 },
  { icon: four, id: 4, active: false, image: blue_four, originalIcon: four,clo:12 },
  { icon: nine, id: 9, active: false, image: blue_nine, originalIcon: nine,clo:8 },//16分屏clo6 36分屏clo4
]);
const state = reactive({
  fullscreen: false,
  fornum: 1,
  clonum: 24,
  videoclass: "height:100%;margin: -3px auto; background: red;",
  items: [false, false, false, false],
});
const handleIconClick = (item) => {
  num.value = item.id
  icons.value.forEach((icon) => {
    if (icon.id === item.id) {
      icon.active = true;
      icon.icon = icon.image;
    } else {
      icon.active = false;
      icon.icon = icon.originalIcon;
    }
  });
  state.items = [];
  for (let i = 0; i < item.id; i++) {
    state.items[i] = false;
  }
  state.fornum = item.id;
  state.clonum = item.clo;

};
</script>

<style scoped lang="scss">

.container_top {
  height: 98vh;
  position: relative;
  .grid-item {
    height: calc(100% - 50px);
    // height: 94%;
    width: 100%;
    border: 1px solid #333333;
  }

  .bottom-box {
    position: absolute;
    bottom: 0;
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icons-container {
      .icon {
        padding:10px 0 0 20px;
        cursor: pointer;
        width: 30px;
      }
    }
    .screen-icon-container {
      display: flex;
      align-items: center;
      padding: 0 30px 0 0;
    }

  }

}

.main {
  //padding: 10px;
  width: auto;
  height: 100%;
}

.alt {
  color: #fff;
  text-align: center;
}

.alt table {
  width: 100%;
  height: 100%;
}

.talbetop {
  width: 100%;
  height: 100%;
}

.selectchannel {
  position: absolute;
  right: 5px;
  top: 5px;
}

.video-close {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #fff;
  font-size: 12px;
  background-color: hsla(0, 0%, 50%, .5);
  padding: 2px 5px;
  cursor: pointer;
  border-radius: 2px;
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.table-c table {
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
}

.table-c table td {
  border-left: 2px solid #fff;
  border-top: 2px solid #fff;
}


</style>

