<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>偏转服务审计</span>
      </div>
    </template>
    <el-row>
      <el-col>
        <!-- <el-input type="textarea" :value="logData" :rows="32" :readonly="true"></el-input> -->
        <!-- <el-input type="textarea" ref="logInput" :value="logData" :rows="32" :readonly="true"></el-input> -->
        <!-- <el-input type="textarea" ref="logInput" v-model="logData" :rows="32"></el-input> -->
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts" name="srvAudit">
// import { ref, onMounted } from "vue";
// import { ref, onMounted } from "vue";
// import { ElInput } from "element-plus";
// import dayjs from "dayjs";
// import { confirmAction } from "@/api/modules/utilfuns";

// const loadData = async () => {
//   // 请求后端服务加载数据
//   // const { data } = await getLogContent();
//   // // console.log(JSON.stringify(data, null, 2));
//   // logData.value = data.logData;
//   // logRowCount.value = data.logRowCount;
//   // // console.log(logData.value);
//   // // 确保 DOM 更新后再滚动到底部
//   // await nextTick();
//   // if (logInput.value) {
//   //   logInput.value.$el.dispatchEvent(new Event("input"));
//   //   logInput.value.$el.scrollTop = logInput.value.$el.scrollHeight;
//   // }
// };

// 页面加载完毕后调用这个方法
// onMounted(() => loadData());
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
