<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>网关运行日志</span>
        <el-button class="button" @click="loadData" text>刷新</el-button>
      </div>
    </template>
    <el-row>
      <el-col>
        <el-input type="textarea" :value="logData" :rows="34" :readonly="true"></el-input>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts" name="home">
import { ref, onMounted } from "vue";

import { getLogContent } from "@/api/modules/sysadmin";
const logData = ref({});
const loadData = async () => {
  // 请求后端服务加载数据
  const { data } = await getLogContent();
  console.log(JSON.stringify(data, null, 2));
  logData.value = data.logData;
  console.log(logData.value);
};
// 页面加载完毕后调用这个方法
onMounted(() => loadData());
</script>

<style scoped lang="scss">
.box-card {
  width: 100%;
  height: 100%;
}
</style>
