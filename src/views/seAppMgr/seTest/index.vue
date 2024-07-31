<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>偏转功能测试</span>
      </div>
    </template>
    <el-row>
      <el-col>
        <div><b>测试输入</b></div>
        <el-form :model="formData" :rules="rules" label-width="140px" ref="formRef">
          <el-form-item label="经度lng:" prop="lng">
            <el-input v-model="formData.lng" class="input-line" />
          </el-form-item>
          <el-form-item label="纬度lat:" prop="lat">
            <el-input v-model="formData.lat" class="input-line" />
          </el-form-item>
          <el-form-item label="高度heit:" prop="heit">
            <el-input v-model="formData.heit" class="input-line" />
          </el-form-item>
          <el-form-item label="GPSWeek:" prop="gpsWeek">
            <el-input v-model="formData.gpsWeek" class="input-line" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">测试</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
        <div><b>测试输出</b></div>
        <el-input v-model="testResult" type="textarea" :rows="15" style="width: 520px" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { seTestSrv } from "@/api/modules/seappmgr";
import { ElMessage, ElForm } from "element-plus";
import { ref, reactive } from "vue";

const formRef = ref<typeof ElForm | null>(null);
const formData = reactive({
  lng: "125.15588895",
  lat: "44.33206306",
  heit: "200.6",
  gpsWeek: "2306"
});

const testResult = ref("");

const rules = {
  lng: [
    { required: true, message: "经度不能为空", trigger: "blur" },
    { pattern: /^\-?\d+(\.\d+)?$/, message: "经度必须是数字", trigger: "blur" }
  ],
  lat: [
    { required: true, message: "纬度不能为空", trigger: "blur" },
    { pattern: /^\-?\d+(\.\d+)?$/, message: "纬度必须是数字", trigger: "blur" }
  ],
  heit: [
    { required: true, message: "高度不能为空", trigger: "blur" },
    { pattern: /^\-?\d+(\.\d+)?$/, message: "高度必须是数字", trigger: "blur" }
  ],
  gpsWeek: [
    { required: true, message: "gpsWeek不能为空", trigger: "blur" },
    { pattern: /^\-?\d+(\.\d+)?$/, message: "gpsWeek必须是数字", trigger: "blur" }
  ]
};

const onSubmit = async () => {
  if (!formRef.value) return;
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const { data } = await seTestSrv(formData);
      console.log(data);
      testResult.value = JSON.stringify(data, null, 2);
      ElMessage.success("测试完成，请查看响应数据。");
    }
  });
};

const onReset = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
