<template>
  <div class="container">
    <div class="left">
      <div class="company">{{ t('视频预览') }}</div>
      <div class="company_name">
        <div class="name">
          <div class="name_left">{{ depart_name.slice(0, 1) }}</div>
          <div class="depart_name">{{ depart_name }}</div>
        </div>
        <img class="custom_image" src="@/assets/images/png/add.png" style="cursor: pointer" @click="handle_add">
      </div>
      <div class="tree">
        <div v-for="(item,index ) in group_data.records"
             :key="item.id"
        >
          <div :class="show_item !== index?'tree_box':'tree_box_bg'" class="tree_box"
               @click="handleNodeClick(item,index)">
            <div class="tree_box_left">
              <me-icon-right v-if="show_item !== index" style="font-size: 0.8em;"/>
              <me-icon-buttom v-else style=" font-size:0.8em;"/>

              <img src="@/assets/images/png/position.png">
              <div class="tree_text">{{ item.name }} ({{ item.deviceInfo.online }}/{{ item.deviceInfo.total }})</div>
            </div>
            <div class="showIcon">
              <el-dropdown trigger="click" @command="(command:string) => handleCommand(command, item)">
                <me-icon-Ellipsis class="icon" style=" font-size:1.6em;"/>

                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="add">
                      <div class="showIcon_top">
                        <img class="custom_image" src="@/assets/images/png/add.png">
                        <div style="margin-left: 10px">添加设备</div>
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item command="edit">
                      <div class="showIcon_top">
                        <img class="custom_image" src="@/assets/images/png/show_edit.png">
                        <div style="margin-left: 10px">编辑名称</div>
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item command="del">
                      <div class="showIcon_top">
                        <img class="custom_image" src="@/assets/images/png/delete.png">
                        <div style="margin-left: 10px">删除</div>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>

          <div v-for="(v, index) in device_data" v-if="show_item === index" :class="{ 'fade-in': show_item === index }"
               class="tree_content">
            <div class="tree_content_bg" @dblclick="handle_device(v)">
              {{ v.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <video_preview :url="video_url"></video_preview>
    </div>
    <device_dia :data="device_data" :dialog="device_flag" :group="device_groupId"
                @save_dialog="handle_save_dialog"></device_dia>
  </div>
</template>


<script lang="ts" setup>
import video_preview from '../component/video_preview/index.vue'
import device_dia from '../component/device_dialog/index.vue'
import {useLocalesI18n} from "@/locales/hooks";
import {useUserStore} from "@/store";
import {message} from "@/utils/components/message";
import {add_device, batch_relevance, del_device, device_list, group_list, put_device, video_address} from "@/api/video";

const {t} = useLocalesI18n({}, [(locale: string) => import(`../lang/${locale}.json`), 'preview']);
const UserStore = useUserStore()
const plotId = UserStore.user.plotId
const depart_name = UserStore.user.plotName
const device_flag = ref(false)
const device_groupId = ref<number>(0)
const device_data = ref([
  {
    name: '',
    devicePath: '',
    deviceStatus: '',
    deviceType: ''
  }
])
const video_data = ref([])
const page_size = ref(20); //每页显示条目个数
const show_item = ref(-1)
const group_data = ref({
  records: [
    {id: 0, name: '', deviceInfo: {online: 0, total: 0}}
  ]
})//左侧分组列表id
const defaultProps = {
  children: 'children',
  label: 'name',
  id: 'id'
}
const video_url = ref('')
const handleCommand = (command: string, data: any) => {
  console.log('Command:', command);
  if (command === 'add') {
    device_flag.value = true

  } else if (command === 'edit') {
    ElMessageBox.prompt(t('请输入') + t('新分组') + t('名称'), t('编辑') + t('分组'), {
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      inputPattern: /^[\w\u4e00-\u9fa5\!\@#\$\%\^\&\*\(\)\-\+\=\[\]\{\}\|\;\:\'\"\,\.\<\>\/\?]+$/,
      inputErrorMessage: t('不能为空'),

    })
        .then(async ({value}) => {
          await device_put(value, data.id)
        })
        .catch(() => {
          message(t('取消') + t('编辑') + t('新分组'), {type: 'error'})
        })
  } else {
    ElMessageBox.confirm(
        t('将删除当前分组,是否确认?'),
        t('删除确认'),
        {
          confirmButtonText: t('确定'),
          cancelButtonText: t('取消'),
          type: 'warning',
        }
    )
        .then(async () => {
          await device_del(data.id)
        })
        .catch(() => {
          message(t('取消删除'), {type: "error"})

        })
  }
  console.log(data, '--data')


}

const handle_save_dialog = (flag: boolean, status: string, data: any) => {
  device_flag.value = flag
  if (status === 'cancel') return true
  equipment_group(data)

}


//点击tree
const handleNodeClick = async (data: any, index: number) => {
  console.log(data, '--data')
  show_item.value = index
  device_groupId.value = data.id  //监听了他导致数据重复了
  await device_list_all(device_groupId.value)
}
const handle_device = (v) => {
  console.log(v, '--v')
  get_video_url(v.devicePath)
}
//创建设备组
const handle_add = () => {
  ElMessageBox.prompt(t('请输入') + t('新分组') + t('名称'), t('创建') + t('分组'), {
    confirmButtonText: t('确认'),
    cancelButtonText: t('取消'),
    inputPattern: /^[\w\u4e00-\u9fa5\!\@#\$\%\^\&\*\(\)\-\+\=\[\]\{\}\|\;\:\'\"\,\.\<\>\/\?]+$/,
    inputErrorMessage: t('不能为空'),

  })
      .then(async ({value}) => {
        await device_add(value, plotId)
      })
      .catch(() => {
        message(t('取消') + t('添加') + t('新分组'), {type: 'error'})
      })
}

const device_add = async (name: string, plotId: number) => {
  const res = await add_device({
    name: name,
    plotId: plotId
  })
  if (res.data.code === 200) {
    await group_list_all(plotId, 0, page_size.value)
    message(t('创建分组') + t('成功'), {type: 'success'})
  } else {
    message(res.data.message, {type: 'error'})
  }
}

const device_put = async (name: string, id: number) => {
  const res = await put_device({
    name: name,
    id: id
  })
  if (res.data.code === 200) {
    await group_list_all(plotId, 0, page_size.value)
    message(t('编辑分组') + t('成功'), {type: 'success'})
  } else {
    message(res.data.message, {type: 'error'})
  }
}
const device_del = async (id: number) => {
  const res = await del_device({
    id: id
  })
  if (res.data.code === 200) {
    await group_list_all(plotId, 0, page_size.value)
    message(t('删除分组') + t('成功'), {type: 'success'})
  } else {
    message(res.data.message, {type: 'error'})
  }
}
const group_list_all = async (plotId: number, page: number, size: number, name?: string) => {
  const res = await group_list(plotId, page, size, name)
  if (res.data.code === 200) {
    group_data.value = res.data.data
  }
}
const equipment_group = async (data: any) => {
  const res = await batch_relevance(data)
  if (res.data.code === 200) {
    message(t('添加设备') + t('成功'), {type: 'success'})
  } else {
    message(res.data.message, {type: 'error'})
  }
}
const device_list_all = async (deviceGroupId: number) => {
  const res = await device_list(deviceGroupId)
  if (res.data.code === 200) {
    device_data.value = res.data.data
  }
}
//获取设备组下面的所有流
// const video_list_all = async (deviceGroupId:number)=>{
//   const res = await video_list(deviceGroupId)
//   if (res.data.code ===200){
//     video_data.value = res.data.data
//   }
// }
const get_video_url = async (devicePath: string) => {
  const res = await video_address({
    "namespace": "WCS/MMS",
    "request": "open.video.websocket_wwav",
    "msg_id": Math.floor(Math.random() * 900000) + 100000,
    "content": {
      "device_path": devicePath,
      "params": {
        "video_quality": 1,        // 0: 高清, 1: 标清, 2: 低清
        // "disable_audio": true        // [可选] 禁用音频
      },
      // "ext_info": {        // [可选字段]: 透传// 透传数据, 将透传给设备},
      // "exclusive": true        // [可选字段]: 独占码流, 不与其他客户端共享
    }
  })
  console.log(res, '--res')
  if (res.data.reply === 200) {
    video_url.value = res.data.content
  } else {
    message(res.data.err_msg, {type: 'error'})
  }
}
onMounted(() => {
  group_list_all(plotId, 0, page_size.value)
})
</script>


<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
  height: 85vh;
  background-color: #ffffff;

  .left {
    //flex: 1;
    width: 280px;
    //width: 30%;
    height: 100%;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 3px 6px #D6E2FE;
    border-right: 1px solid #D6E2FE;

    .company {
      font-size: 18px;
      font-weight: 700;
      margin: 16px 0 0 16px;
    }

    .company_name {
      margin: 20px 0 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center; /* 添加此行 */
      height: 40px;
      width: 240px;
      padding: 0 0 0 19px;
      background: #EBF3FF;

      .name {
        display: flex;
        padding-left: 40px;

        .name_left {
          width: 20px;
          height: 20px;
          color: #ffffff;
          background: #3B81F4;
          margin: 0 auto;
          display: flex;
          justify-content: center; /* 添加此行 */
          align-items: center; /* 添加此行 */
        }

        .depart_name {
          padding-left: 10px;
        }
      }

      img {
        width: 20px;
        height: 20px;
        padding-right: 10px;
      }
    }

    .tree {
      flex-grow: 1; /* 添加 flex-grow: 1 属性 */
      margin-top: 16px;

      .custom_top {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;

        .custom_content {
          display: flex;

          .custom_img {
            width: 15px;
            height: 15px;
            padding: 2px 5px 0 0;
          }
        }

      }

      .tree_box {
        display: flex;
        justify-content: space-between;
        padding: 8px 10px 8px 15px;

        .tree_box_left {
          display: flex;

          img {
            padding-left: 20px;
            width: 20px;
            height: 20px;
          }

          .tree_text {
            padding-left: 5px;
          }

        }

        .showIcon {
          opacity: 0;
        }

      }

      .tree_box:hover {
        cursor: pointer;
        background-color: #FFEAEB;
        color: #3B81F4;

        .showIcon {
          opacity: 1;

        }
      }

      .tree_box_bg {
        background-color: #FFEAEB !important;
        color: #D42A30;
      }

      .tree_content {
        padding: 5px 0 5px 75px;

      }

      .tree_content:hover {
        cursor: pointer;
        background-color: #ebf3ff;
        color: #3B81F4;
      }

    }
  }

  .right {
    flex: 1;
    overflow: hidden;

    //overflow-x: auto;
  }


}


.showIcon_top {
  display: flex;

  .custom_image {
    cursor: pointer;
    width: 20px;
    height: 20px;
  }
}

.fade-in {
  opacity: 1;
  transition: opacity 0.8s ease-in;
}
</style>
