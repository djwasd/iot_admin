<template>
  <div class="container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" >
        <top_left/>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="10" >
   <top_content/>
      </el-col>
      <el-col :xs="24" :sm="24" :md="20" :lg="8" >
        <top_right/>
      </el-col>
      <el-col class="magin"  :xs="24" :sm="24" :md="8" :lg="6"  >
        <button_left/>
      </el-col>
      <el-col class="magin" :xs="24" :sm="24" :md="12" :lg="10" >
        <button_content/>
      </el-col>
      <el-col style="margin-top: -60px" :xs="24" :sm="24" :md="20" :lg="8" >
        <button_right/>
      </el-col>
    </el-row>


<!--    <el-col :xs="4" :sm="24" :md="12" :lg="10" >-->
<!--        <div class="grid-content">2</div>-->
<!--      </el-col>-->
<!--    <el-col :xs="4" :sm="24" :md="18" :lg="8" >-->
<!--        <div class="grid-content">4</div>-->
<!--      </el-col>-->


  </div>
</template>

<script setup lang="ts">
import top_left from './top_left/index.vue'
import top_content from './top_content/index.vue'
import top_right from './top_right/index.vue'
import button_left from './button_left/index.vue'
import button_content from './button_content/index.vue'
import button_right from './button_right/index.vue'

</script>

<style scoped lang="scss">
.container {
  width: 100%;
  min-width:1200px;
  .grid-content {
    border: 1px solid #333333;
  }

  .el-col {
    border-radius: 4px;
  }

  @media (min-width: 1200px) {
    .container {
      .el-row {
        flex-wrap: nowrap;
      }
    }
  }
  .magin {
    margin-top: 10px;
  }
}
</style>