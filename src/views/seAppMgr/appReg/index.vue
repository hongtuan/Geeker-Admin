<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>偏转应用配置</span>
      </div>
    </template>
    <el-row>
      <el-col>
        <el-form :model="formData" label-width="140px">
          <el-form-item label="应用签名数据:">
            <el-input v-model="formData.asd" type="textarea" :rows="20" style="width: 800px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit"> 确定 </el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts" name="appReg">
// import dayjs from "dayjs";
import { appRegSrv } from "@/api/modules/seappmgr";
import { ElMessage } from "element-plus";
import { reactive } from "vue";

// do not use same name with ref
const formData = reactive({
  asd: "XT-M580"
});

const onSubmit = async () => {
  // ElMessage.success("提交的数据为 : " + JSON.stringify(formData));
  const { data } = await appRegSrv(formData);
  console.log(data);
  ElMessage.success("应用注册完成。");
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
