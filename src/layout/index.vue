<template>
  <el-container class="layout">
    <el-aside v-if="!globalStore.isMobile && menuType !== 'top'" width="max-content">
      <layout-menu></layout-menu>
    </el-aside>
    <el-container>
      <el-header v-if="themeConfig.fixedHeader" class="right-header" height="max-content">
        <layout-header></layout-header>
      </el-header>
      <el-main class="main">
        <el-aside v-if="menuType === 'top'" width="max-content">
          <layout-menu></layout-menu>
        </el-aside>
        <el-main class="right-main">
          <tag-bar v-if="themeConfig.tagBar"></tag-bar>
          <el-scrollbar view-class="me-right-main-view">
            <layout-header v-if="!themeConfig.fixedHeader"></layout-header>
            <div id="me-main" class="me-main">
              <layout-page :transition="{ name: 'fade-transform', mode: 'out-in' }"></layout-page>
            </div>
          </el-scrollbar>
        </el-main>
      </el-main>
    </el-container>
  </el-container>
  <el-drawer
    v-if="globalStore.isMobile"
    class="me-sidebar-drawer"
    :model-value="!themeConfig.menuCollapse"
    :with-header="false"
    :size="themeConfig.menuWidth"
    direction="ltr"
    @close="() => (themeConfig.menuCollapse = true)"
  >
    <layout-menu></layout-menu>
  </el-drawer>
  <me-setting v-if="themeConfig.showSetting && !themeConfig.topBar" class="fixed-setting"></me-setting>
  <me-setting-menu></me-setting-menu>
</template>
<script setup lang="ts" name="Layout">
import LayoutHeader from './components/header/index.vue';
import LayoutMenu from './components/menu/index.vue';
import LayoutPage from './components/page.vue';
import TagBar from './components/header/components/tagBar/index.vue';
import { useSettingStore, useGlobalStore,useCommonStore } from '@/store';
const { themeConfig, menuType } = storeToRefs(useSettingStore());
const globalStore = useGlobalStore();
onMounted(() => {
  nextTick(() => (globalStore.layoutLoaded = true));
});

</script>
<style lang="scss" scoped>
.layout {
  height: 100%;
  .right-header {
    padding: 0;
  }

  .main {
    padding: 0;
    display: flex;
  }
  .right-main {
    padding: 0;
    // background-color: rgb(240, 242, 245);
    background-color: var(--el-bg-color-page);
    display: flex;
    flex-direction: column;
  }
}

// .dark {
//   .layout {
//     .right-main {
//       background-color: var(--el-bg-color);
//     }
//   }
// }
:deep(.me-right-main-view) {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  .me-main {
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    flex-direction: column;
    padding: $page-padding;
    position: relative;
  }
}

.fixed-setting {
  position: fixed;
  top: 50%;
  right: 0;
  padding: 10px;
  border-radius: 3px 0 0 3px;
  transform: translateY(-50%);
  z-index: $z-index-top;
  background-color: var(--el-color-primary);
  color: var(--el-color-white);
}
</style>
