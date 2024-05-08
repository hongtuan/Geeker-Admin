<template>
  <div>
    <div class="card mb10">
      <h4 class="title">简介</h4>
      <span class="text"> 实现W84坐标到C02坐标转换,将转换前后的数据发送到工控机。 </span><br />
      <div>
        <img class="home-bg" src="@/assets/images/srvConfig.png" alt="srvConfig" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="about"></script>

<style lang="scss" scoped>
.card {
  .title {
    margin: 0 0 15px;
    font-size: 17px;
    font-weight: bold;
    color: var(--el-text-color-primary);
  }
  .text {
    font-size: 15px;
    line-height: 25px;
    color: var(--el-text-color-regular);
    .el-link {
      font-size: 15px;
    }
  }
}
</style>
