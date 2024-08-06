<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>偏转网关设备功能简介</span>
      </div>
    </template>
    <el-row>
      <el-col>
        <p class="text">实现W84坐标到C02坐标转换,接收来自工控机转发程序的W84数据,将转换后的C02数据发回到工控机。</p>
        <div>
          <img class="home-bg" src="@/assets/images/srvConfig.png" alt="srvConfig" />
        </div>
        <p class="text">工控机设备接收来自CPT7和INS的原始数据,落盘存储后，转发数据到偏转网关,实际部署IP地址依据具体车辆情况。</p>
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
