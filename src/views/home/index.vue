<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>网关运行日志</span>
        <div>
          <el-button @click="loadData">刷新日志(最新200行)</el-button>
          <!-- <el-button @click="triggerFileDownload">下载</el-button> -->
          <el-button @click="triggerFileGzDownload">下载日志</el-button>
          <el-button @click="clearLog">清理日志</el-button>
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
import { saveAs } from "file-saver";
import { getLogContent, clearLogFile, downloadLogGz, restartGwSrv } from "@/api/modules/sysadmin";
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

// const triggerFileDownload = async () => {
//   try {
//     // 请求后端服务加载数据
//     const resultData = await downloadLog();
//     const blob = new Blob([resultData as unknown as BlobPart], { type: "text/plain" });
//     // 使用 FileSaver API 保存文件
//     saveAs(blob, "udpsrv.log");
//   } catch (error) {
//     console.error("Failed to download file:", error);
//   }
// };

const triggerFileGzDownload = async () => {
  try {
    // 请求后端服务加载数据
    const resultData = await downloadLogGz();
    // 构建 Blob 对象
    const blob = new Blob([resultData as unknown as BlobPart], { type: "application/octet-stream" });
    // 使用 FileSaver API 保存文件
    saveAs(blob, "udpsrv_post.tar.gz");
  } catch (error) {
    console.error("Failed to download file:", error);
  }
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
