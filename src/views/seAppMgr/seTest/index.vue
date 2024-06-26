<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>偏转芯片测试</span>
      </div>
    </template>
    <el-row>
      <el-col>
        <el-form :model="formData" label-width="140px">
          <el-form-item label="经度lng:">
            <el-input v-model="formData.lng" class="input-line" />
          </el-form-item>
          <el-form-item label="纬度lat:">
            <el-input v-model="formData.lat" class="input-line" />
          </el-form-item>
          <el-form-item label="高度heit:">
            <el-input v-model="formData.heit" class="input-line" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit"> 确定 </el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
        <el-input v-model="testResult" type="textarea" :rows="10" style="width: 640px" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts" name="seTest">
// import dayjs from "dayjs";
import { seTestSrv } from "@/api/modules/seappmgr";
import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";

// do not use same name with ref
const formData = reactive({
  lng: "125.15588895",
  lat: "44.33206306",
  heit: "200.6"
});

const testResult = ref("");

const onSubmit = async () => {
  // ElMessage.success("提交的数据为 : " + JSON.stringify(formData));
  const { data } = await seTestSrv(formData);
  console.log(data);
  testResult.value = JSON.stringify(data, null, 2);
  ElMessage.success("测试完成，请查看响应数据。");
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
