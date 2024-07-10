<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>系统事件查看</span>
        <div>
          <el-space>
            <el-checkbox v-model="isAutoRefresh" @change="setAutoRefresh">
              <span>{{ isAutoRefresh ? "自动刷新中" : "自动刷新暂停" }}</span>
            </el-checkbox>
            <el-button :disabled="isAutoRefresh" @click="loadData">手动刷新</el-button>
            <el-button @click="resetGwDevDb">重置日志数据库</el-button>
            <el-button @click="triggerDownloadDB">下载数据库</el-button>
          </el-space>
        </div>
      </div>
    </template>
    <el-row>
      <el-col>
        <el-table :data="logData2Table" style="width: 100%" border max-height="320">
          <el-table-column type="index" label="行号" width="80"></el-table-column>
          <el-table-column prop="EVT_TIME" label="事件时间" width="180"></el-table-column>
          <el-table-column prop="EVT_NAME" label="服务事件说明" width="200"></el-table-column>
          <el-table-column prop="EVT_CONTENT" label="服务事件详情"></el-table-column>
          <el-table-column prop="SYNC_OK" label="已同步云端" width="120"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-space>
          <span class="highlight-text">接收服务启动时间：</span>
          <span>{{ capStartTime }} </span>
          <span class="highlight-text">开始接收数据：</span>
          <span>{{ refRowCount }} 秒.</span>
          <span class="highlight-text">已运行：</span>
          <span>{{ captureRunningInfo }}</span>
        </el-space>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <el-table :data="tableInfo" style="width: 100%" border max-height="80">
          <el-table-column type="index" label="行号" width="80"></el-table-column>
          <el-table-column prop="GW_EVENT_COUNT" label="事件记录数" width="180"></el-table-column>
          <el-table-column prop="UP_FT_RP_LOG_COUNT" label="包处理记录数"></el-table-column>
          <el-table-column prop="W2C_PROC_LOG_COUNT" label="偏转任务记录数"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts" name="srvEvt">
import { ref, onMounted, onUnmounted } from "vue";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import { getLastEvtLog, resetDevDb, downloadGwDb } from "@/api/modules/sysadmin";
import { confirmAction } from "@/api/modules/utilfuns";
const isAutoRefresh = ref(false);
const capStartTime = ref("");
const captureRunningInfo = ref("");
const refRowCount = ref(0);
const setAutoRefresh = () => {
  if (isAutoRefresh.value) {
    // 设置每隔10秒刷新一次。
    intervalId = setInterval(loadData, 10000) as unknown as number;
  } else {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined; // 清除intervalId的引用
    }
  }
};

let logData2Table = ref<{ [key: string]: any }[]>([]);
let tableInfo = ref<{ [key: string]: number }[]>([]);
// 自动刷新的计时器
let intervalId: number | undefined;
const loadData = async () => {
  // 请求后端服务加载数据
  const { data } = await getLastEvtLog();
  console.log(JSON.stringify(data, null, 2));
  logData2Table.value = data.rowData;
  tableInfo.value = data.tableInfo.rowData;
  capStartTime.value = data.capStartTime;
  captureRunningInfo.value = data.captureRunTimeInfo;
  let captureRunningSeconds = data.captureRunTimeSeconds;
  // 每秒记录一条日志。
  refRowCount.value = captureRunningSeconds;
};
const resetGwDevDb = async () => {
  // 显示操作确认提示
  confirmAction("你确认要重置网关日志数据库吗？", resetDevDb, "网关日志数据库已重置。");
};
const triggerDownloadDB = async () => {
  try {
    // 请求后端服务加载数据
    const resultData = await downloadGwDb();
    // 构建 Blob 对象
    const blob = new Blob([resultData as unknown as BlobPart], { type: "application/octet-stream" });
    // 生成文件名,加入时间串
    const timestamp = dayjs().format("YYYYMMDDHHmm");
    const filename = `gwapp.db_${timestamp}.tar.gz`;
    // 使用 FileSaver API 保存文件
    saveAs(blob, filename);
    // saveAs(blob, "udpsrv_post.tar.gz");
  } catch (error) {
    console.error("Failed to download file:", error);
  }
};
// 页面加载完毕后调用这个方法
onMounted(() => {
  // 页面加载完毕后调用这个方法
  loadData();
  // 设置定时器，每隔6秒自动刷新数据
  // 只有在isAutoRefresh.value为true时，才设置定时器
  if (isAutoRefresh.value) {
    intervalId = setInterval(loadData, 10000) as unknown as number;
  }
});

onUnmounted(() => {
  // 当组件卸载时，清除定时器
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = undefined;
  }
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
