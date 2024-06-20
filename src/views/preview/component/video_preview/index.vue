<template>
  <div class="container_top" ref="container_top_ref">
    <div class="grid-item" ref="grid_item_ref">
      <div class="main">
        <div class="conter" ref="box">
          <el-row :gutter="10">
            <el-col
                v-for="(n, index) in state.fornum"
                style="padding: 1px"
                :key="index"
                :xs="24"
                :sm="24"
                :md="state.clonum"
                :lg="state.clonum"
                :xl="state.clonum"
                :class="state.videoclass"
            >
              <div class="video-wrapper"  ref="video_box"  :style="state.videoclass" @click="handle_click(n)" :id="`videoid${n}`">
                <div class="video-inner live hide-waiting" style="position: absolute; top: 0; bottom: 0; left: 0; right: 0;">
                  <div class="alt">
                    <div class="talbetop" :class="{ 'active-box': active_box === n }">
                      <table>
                        <tr>
                          <td>
                            <canvas
                                :id="`canvas${n}`"
                                style="display: none"
                            ></canvas>
                            <video :id="`video${n}`" :class="state.fornum===4?'video_four':state.fornum===9?'video_nine':''"   ref="video" autoplay class="video"></video>
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
      <div class="icons-container">
        <img
            :src="item.icon"
            v-for="(item, index) in icons"
            :key="item.id"
            class="icon"
            @click="handleIconClick(item)"
        />
      </div>
      <div class="screen-icon-container" ref="screen_ref" @click="handle_fullscreen">
        <me-icon-screen  style="font-size: 1.5em"></me-icon-screen>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WWAVPlayer from '@vanwei-wcs/wwav-player'  //等
import a from './01.mp4'
import b from './02.mp4'

import blue_first from '@/assets/images/png/blue_first.png';
import blue_four from '@/assets/images/png/blue_four.png';
import blue_nine from '@/assets/images/png/blue_nine.png';
import first from '@/assets/images/png/first.png';
import four from '@/assets/images/png/four.png';
import nine from '@/assets/images/png/nine.png';
const video_box = ref(null)
const num = ref(1)
const active_box = ref() //当前点击的盒子 添加动态class
const box_ref = ref<any>()//当前点击盒子的id
const screen_ref = ref(null)//外部全屏按钮的实力
const grid_item_ref = ref(null)//视频区域盒子的实例
const video = ref(null)//视频区域盒子的实例
const container_top_ref = ref(null)//大盒子的实例
const props = defineProps({
  url:{
      type:  Object as PropType<object>,
      default: false
  }
})
const url_list = ref<any>([])
const icons = ref([
  { icon: blue_first, id: 1, active: false, image: blue_first, originalIcon: first,clo:24 },
  { icon: four, id: 4, active: false, image: blue_four, originalIcon: four,clo:12 },
  { icon: nine, id: 9, active: false, image: blue_nine, originalIcon: nine,clo:8 },//16分屏clo6 36分屏clo4
]);
const video_id =ref()
const player_ref = ref<any>()
const canvas_id =ref()

const state = reactive({
  fullscreen: false,
  fornum: 1,
  clonum: 24,
  videoclass: "padding-bottom: 48%; position: relative; margin: 0px auto;",
  items: [false, false, false, false],
  src:''
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
const handle_click =(num:number)=>{
  const boxInstance = video_box.value; // 获取盒子的实例
  // video_id.value = video.value
  active_box.value = num; // 更新当前活动盒子的编号
   box_ref.value = `video${num}`; // 获取当前盒子的 id

}
//外部大盒子全屏
const handle_fullscreen =()=>{
  if (!document.fullscreenElement && !document.mozFullScreenElement &&
      !document.webkitFullscreenElement && !document.msFullscreenElement) {
    if (container_top_ref.value.requestFullscreen) {
      container_top_ref.value.requestFullscreen();
    } else if (container_top_ref.value.mozRequestFullScreen) {
      container_top_ref.value.mozRequestFullScreen();
    } else if (container_top_ref.value.webkitRequestFullscreen) {
      container_top_ref.value.webkitRequestFullscreen();
    } else if (container_top_ref.value.msRequestFullscreen) {
      container_top_ref.value.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

const init_play =()=>{
    // url_list.value = [...new Set( url_list.value)];

  url_list.value.map((v:any,index:number)=>{
    video_id.value = document.getElementById(`video${index+1}`);
    canvas_id.value = document.getElementById(`canvas${index+1}`);
    console.log(video_id,'--video_id')
    console.log(canvas_id,'--canvas_id')
if (video_id.value.src ===''){
  video_id.value.src = a
  // video_id.value.src = b

//     console.log('当前地址为空 没有播放')
//   player_ref.value = new WWAVPlayer({
//     debug: false // 当前只有这一个属性
//   });
//   player_ref.value.attachVideoElement(  video_id.value, {  //接收两个参数
//     flushingTime: 10,//最大buffer缓冲
//     maxDelay: 10,//最大延时ms
//   });
//   player_ref.value.attachCanvasElement(canvas_id.value, {
//     baseLibPath: "/public/h265/",
//     debug: false,
//   });
//   player_ref.value.on("media_info", (event:any) => {
//     console.log("media_info", event);
//   });
//   player_ref.value.on("error", () => {
//     // handleError()
//   }, '--2222222');
  // player_ref.value.open(v.url, v.token);
  // player_ref.value.open('ws://115.236.167.66:30063/mts/wwav/W811216626vNYoshOCjp8R9V86u1C.wwav', 'e3Vyn4E7');

}


  })
}

watch(() => props.url,
    (newUrl) => {
      console.log(newUrl,'--newUrl')
      handle_click(state.fornum)
      url_list.value.unshift(newUrl)
      init_play()
    },
       {deep:true}
    )
</script>

<style scoped lang="scss">
.video{
  width:85%;
}
//video_four{
//  width: 660px;
//}
//video_nine{
//  width: 440px;
//}
.container_top {
  height: 100%;
  position: relative;

  .grid-item {
    height: 95%;
    width: 100%;
  }

  .bottom-box {
    position: fixed;
    bottom: 3%;
    height: 6%;
    width: 75%;
    display: flex;
    //justify-content: space-between;
    align-items: center;

    .icons-container {
      .icon {
        padding: 10px 0 0 20px;
        cursor: pointer;
        width: 30px;
      }
    }

    .screen-icon-container {
      cursor: pointer;
      margin: 12px 0 0 20px;
      //display: flex;
      //align-items: center;
      //padding: 10px -50px 0 0;
    }
  }
}

.main {
  //padding: 10px;
  cursor: pointer;
  width: auto;
  height: 100%;
}

.video-wrapper {
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.alt {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #333333;
  color: #fff;
  text-align: center;
  border: 1px solid #ffffff;
  overflow: hidden;
}

.alt table {
  width: 100%;
  height: 100%;
}

.talbetop {
  width: 100%;
  height: 100%;
  position: relative;
}

.selectchannel {
  position: absolute;
  right: 5px;
  top: 5px;
}


.active-box {
 border: 1px solid #333333;

}
</style>

