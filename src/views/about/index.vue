<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>网关设备简介</span>
      </div>
    </template>
    <el-row>
      <el-col>
        <p class="text">实现W84坐标到C02坐标转换,将转换前后的数据发送到工控机。</p>
        <div>
          <img class="home-bg" src="@/assets/images/srvConfig.png" alt="srvConfig" />
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts" name="about"></script>

<style scoped lang="scss">
.box-card {
  width: 100%;
  height: 100%;
}
.home-bg {
  max-width: 100%; /* 图片的最大宽度为容器的宽度 */
  max-height: 100vh; /* 图片的最大高度为视口的高度 */
  object-fit: contain; /* 在保持宽高比的同时填充元素的内容框 */
}
</style>
