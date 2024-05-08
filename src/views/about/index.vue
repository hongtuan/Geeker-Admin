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
</style>
