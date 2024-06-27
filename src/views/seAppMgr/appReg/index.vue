<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>偏转应用配置</span>
      </div>
    </template>
    <div style="width: 100%; height: 296px; overflow: auto">
      <el-row type="flex" align="middle">
        <el-col :span="24">
          <el-input type="textarea" v-model="asdInfo" :rows="10"></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="24">
          <el-button @click="onSubmit">保存</el-button>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script setup lang="ts" name="appReg">
// import dayjs from "dayjs";
import { appRegSrv } from "@/api/modules/seappmgr";
import { ElMessage } from "element-plus";
import { ref } from "vue";

// do not use same name with ref
const asdInfo = ref("");

const onSubmit = async () => {
  // ElMessage.success("提交的数据为 : " + JSON.stringify(formData));
  const { data } = await appRegSrv(asdInfo.value);
  console.log(data);
  ElMessage.success("应用注册完成。");
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
