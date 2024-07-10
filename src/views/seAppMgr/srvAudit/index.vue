<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>偏转服务审计</span>
        <div>
          <el-space>
            <el-button @click="loadData">刷新</el-button>
          </el-space>
        </div>
      </div>
    </template>
    <el-row>
      <el-col>
        <el-table :data="logData2Table" style="width: 100%" border max-height="640">
          <el-table-column type="index" label="行号" width="80"></el-table-column>
          <el-table-column prop="ID" label="主键" width="80"></el-table-column>
          <el-table-column prop="LOG_TIME" label="时间" width="180"></el-table-column>
          <el-table-column prop="W2C_ACCUM_TOTAL_CT" label="累计请求次数"></el-table-column>
          <el-table-column prop="W2C_ACCUM_SUCCESS_CT" label="成功次数"></el-table-column>
          <el-table-column prop="W2C_ACCUM_FAILED_CT" label="失败次数"></el-table-column>
          <el-table-column prop="SYNC_OK" label="已同步云端"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts" name="srvAudit">
import { ref, onMounted } from "vue";
import dayjs from "dayjs";
import { srvAuditSrv } from "@/api/modules/seappmgr";
let logData2Table = ref<{ [key: string]: any }[]>([]);

const loadData = async () => {
  const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");
  let param = { endTimeStr: timestamp, rowCount: 60 };
  // 请求后端服务加载数据
  const { data } = await srvAuditSrv(param);
  // console.log(JSON.stringify(data, null, 2));
  logData2Table.value = data.rowData;
};

onMounted(() => {
  // 页面加载完毕后调用这个方法
  loadData();
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
