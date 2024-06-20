<template>
  <div>
    <div class="head">
      <div>
        <el-button :type="state.classtype1" @click="selecttype('classtype1', 1, 24)">单屏</el-button>
        <el-button :type="state.classtype2" @click="selecttype('classtype2', 4, 12)">四分屏</el-button>
        <el-button :type="state.classtype3" @click="selecttype('classtype3', 9, 8)">九分屏</el-button>
        <el-button :type="state.classtype4" @click="selecttype('classtype4', 16, 6)">十六分屏</el-button>
        <el-button :type="state.classtype5" @click="selecttype('classtype5', 36, 4)">三十二分屏</el-button>
      </div>
    </div>

    <div class="main">
      <div class="conter" ref="box">
        <el-row :gutter="10">
          <el-col v-for="(n, index) in state.fornum" :key="index" :xs="24" :sm="24" :md="state.clonum"
                  :lg="state.clonum" :xl="state.clonum" :class="state.videoclass">
            <div class="player-wrapper" element-loading-text="加载中..." element-loading-background="#000">
              <div class="video-wrapper" :style="state.videoclass" :id="`videoid${n}`">
                <div class="video-inner live hide-waiting"
                     style="position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px;">
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
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const state = reactive({
  fullscreen: false,
  fornum: 4,
  clonum: 12,
  videoclass: "padding-bottom: 50%; position: relative; margin: 0px auto;",
  classtype1: "",
  classtype2: "primary",
  classtype3: "",
  classtype4: "",
  classtype5: "",
  items: [false, false, false, false],
});
function selecttype(item, fnum, clo) {
  state.items = [];
  for (let i = 0; i < fnum; i++) {
    state.items[i] = false;
  }
  state.fornum = fnum;
  state.clonum = clo;
  if (item === "classtype1") {
    state.classtype1 = "primary";
    state.classtype2 = "";
    state.classtype3 = "";
    state.classtype4 = "";
    state.classtype5 = "";
  }
  else if (item === "classtype2") {
    state.classtype1 = "";
    state.classtype2 = "primary";
    state.classtype3 = "";
    state.classtype4 = "";
    state.classtype5 = "";
  }
  else if (item === "classtype3") {
    state.classtype1 = "";
    state.classtype2 = "";
    state.classtype3 = "primary";
    state.classtype4 = "";
    state.classtype5 = "";
  }
  else if (item === "classtype4") {
    state.classtype1 = "";
    state.classtype2 = "";
    state.classtype3 = "";
    state.classtype4 = "primary";
    state.classtype5 = "";
  }
  else if (item === "classtype5") {
    state.classtype1 = "";
    state.classtype2 = "";
    state.classtype3 = "";
    state.classtype4 = "";
    state.classtype5 = "primary";
  }
}
</script>

<style>
.main {
  padding: 10px;
  width: auto;
  height: 100%;
}

html,
body {
  height: 100%;
  margin: 0;
  overflow-x: hidden;
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
  background: #e8c6c6;
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
  position: relative;
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

.player-wrapper {
  padding-bottom: 5px;
}
:deep(.el-button+.el-button ){
  margin-left: 0;
}
</style>
