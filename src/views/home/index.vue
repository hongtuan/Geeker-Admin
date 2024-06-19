<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>网关运行日志</span>
        <div>
          <el-button @click="loadData"> 刷新日志(最新{{ logRowCount }}行) </el-button>
          <!-- <el-button @click="triggerFileDownload">下载</el-button> -->
          <el-button @click="triggerFileGzDownload">下载日志</el-button>
          <el-button @click="clearLog">清理日志</el-button>
          <el-button @click="restartGw">重启网关服务</el-button>
          <el-button @click="stopGw">停止网关服务</el-button>
        </div>
      </div>
    </template>
    <el-row>
      <el-col>
        <!-- <el-input type="textarea" :value="logData" :rows="32" :readonly="true"></el-input> -->
        <el-input type="textarea" ref="logInput" :value="logData" :rows="32" :readonly="true"></el-input>
        <!-- <el-input type="textarea" ref="logInput" v-model="logData" :rows="32"></el-input> -->
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts" name="home">
// import { ref, onMounted } from "vue";
import { ref, onMounted, nextTick, Ref } from "vue";
import { ElInput } from "element-plus";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import { getLogContent, clearLogFile, downloadLogGz, restartGwSrv, stopGwSrv } from "@/api/modules/sysadmin";
import { confirmAction } from "@/api/modules/utilfuns";
const logData = ref({});
const logRowCount = ref(500);
const logInput: Ref<InstanceType<typeof ElInput> | null> = ref(null);
// const loadData = async () => {
//   // 请求后端服务加载数据
//   const { data } = await getLogContent();
//   // console.log(JSON.stringify(data, null, 2));
//   logData.value = data.logData;
//   logRowCount.value = data.logRowCount;
//   // console.log(logData.value);
//   // 确保 DOM 更新后再滚动到底部
//   await nextTick();
//   if (logInput.value) {
//     logInput.value.$el.scrollTop = logInput.value.$el.scrollHeight;
//   }
// };
const loadData = async () => {
  // 请求后端服务加载数据
  const { data } = await getLogContent();
  // console.log(JSON.stringify(data, null, 2));
  logData.value = data.logData;
  logRowCount.value = data.logRowCount;
  // console.log(logData.value);
  // 确保 DOM 更新后再滚动到底部
  await nextTick();
  if (logInput.value) {
    logInput.value.$el.dispatchEvent(new Event("input"));
    logInput.value.$el.scrollTop = logInput.value.$el.scrollHeight;
  }
};

const clearLog = async () => {
  // 请求后端服务加载数据
  confirmAction("确定要清理运行日志吗？", clearLogFile, "运行日志清理完成。");
  // 清理完毕后，重新加载
  loadData();
};

const triggerFileGzDownload = async () => {
  try {
    // 请求后端服务加载数据
    const resultData = await downloadLogGz();
    // 构建 Blob 对象
    const blob = new Blob([resultData as unknown as BlobPart], { type: "application/octet-stream" });

    // 生成文件名,加入时间串
    const timestamp = dayjs().format("YYYYMMDDHHmm");
    const filename = `udpsrv_log_${timestamp}.tar.gz`;

    // 使用 FileSaver API 保存文件
    saveAs(blob, filename);
    // saveAs(blob, "udpsrv_post.tar.gz");
  } catch (error) {
    console.error("Failed to download file:", error);
  }
};
const restartGw = async () => {
  // 请求后端服务加载数据
  confirmAction("确定要重启网关服务吗？", restartGwSrv, "网关服务重启完成。");
};
const stopGw = async () => {
  // 显示操作确认提示
  confirmAction("你确认要停止网关服务吗？", stopGwSrv, "网关服务已停止。");
};

// 页面加载完毕后调用这个方法
onMounted(() => loadData());
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
