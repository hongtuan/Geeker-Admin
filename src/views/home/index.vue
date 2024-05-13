<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>网关运行日志</span>
        <div>
          <el-button @click="loadData">刷新</el-button>
          <el-button @click="clearLog">清理</el-button>
          <el-button @click="restartGw">重启网关服务</el-button>
        </div>
      </div>
    </template>
    <el-row>
      <el-col>
        <el-input type="textarea" :value="logData" :rows="32" :readonly="true"></el-input>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts" name="home">
import { ref, onMounted } from "vue";

import { getLogContent, clearLogFile, restartGwSrv } from "@/api/modules/sysadmin";
const logData = ref({});
const loadData = async () => {
  // 请求后端服务加载数据
  const { data } = await getLogContent();
  // console.log(JSON.stringify(data, null, 2));
  logData.value = data.logData;
  // console.log(logData.value);
};
const clearLog = async () => {
  // 请求后端服务加载数据
  const { data } = await clearLogFile();
  // console.log(JSON.stringify(data, null, 2));
  logData.value = data.logData;
  // console.log(logData.value);
};

const restartGw = async () => {
  // 请求后端服务加载数据
  const { data } = await restartGwSrv();
  console.log(data);
};
// 页面加载完毕后调用这个方法
onMounted(() => loadData());
</script>

<style scoped lang="scss">
.box-card {
  width: 100%;
  height: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
}
</style>
