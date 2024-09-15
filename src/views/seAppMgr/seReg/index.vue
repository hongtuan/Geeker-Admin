<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>偏转芯片配置</span>
      </div>
    </template>
    <el-row>
      <el-col>
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="160px">
          <el-form-item label="芯片类型:" prop="seType">
            <el-input v-model="formData.seType" class="input-line" />
          </el-form-item>
          <el-form-item label="芯片序列号:" prop="seSN">
            <el-space>
              <el-input v-model="formData.seSN" class="input-line" />
              <el-button @click="querySeSn">查询</el-button>
            </el-space>
          </el-form-item>
          <el-form-item label="芯片注册标识:" prop="rmid">
            <el-input v-model="formData.rmid" class="input-line" />
          </el-form-item>
          <el-form-item label="网关设备序列号:" prop="gwDevSN">
            <el-input v-model="formData.gwDevSN" class="input-line" />
          </el-form-item>
          <el-form-item label="车辆型号:" prop="vehType">
            <el-input v-model="formData.vehType" class="input-line" />
          </el-form-item>
          <el-form-item label="车辆标识(VIN):" prop="vehVin">
            <el-input v-model="formData.vehVin" class="input-line" />
          </el-form-item>
          <el-form-item label="图商标识:" prop="mspID">
            <el-input v-model="formData.mspID" class="input-line" />
          </el-form-item>
          <el-form-item label="数据密钥:" prop="dKey">
            <el-input v-model="formData.dKey" class="input-line" />
          </el-form-item>
          <el-form-item label="信任根证PEM编码:" prop="trcal">
            <el-input v-model="formData.trcal" type="textarea" :rows="10" style="width: 660px" />
          </el-form-item>
        </el-form>
        <div class="button-container">
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="submitForm">保存</el-button>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts" name="seReg">
import { getSeSnSrv, seRegSrv, seLoadConfSrv } from "@/api/modules/seappmgr";
import { ElMessage } from "element-plus";
import { ref } from "vue";
import { FormInstance } from "element-plus"; // 假设使用 Element Plus

const formData = ref({
  seType: "XT-M580",
  seSN: "",
  rmid: "XTSE567812345678",
  gwDevSN: "gw001",
  vehType: "红旗Exxx",
  vehVin: "xxx-yyy",
  mspID: "SW-2024",
  dKey: "1234567887654321",
  trcal: ""
});
const rules = {
  seType: [{ required: true, message: "请输入芯片类型", trigger: "blur" }],
  seSN: [{ required: true, message: "请输入芯片序列号", trigger: "blur" }],
  rmid: [{ required: true, message: "请输入芯片注册标识", trigger: "blur" }],
  gwDevSN: [{ required: true, message: "请输入网关设备序列号", trigger: "blur" }],
  vehType: [{ required: true, message: "请输入车辆型号", trigger: "blur" }],
  vehVin: [{ required: true, message: "请输入车辆标识(VIN)", trigger: "blur" }],
  mspID: [{ required: true, message: "请输入图商标识", trigger: "blur" }],
  dKey: [
    { required: true, message: "请输入数据密钥", trigger: "blur" },
    { pattern: /^\d{16}$/, message: "数据密钥必须是16位数字", trigger: "blur" }
  ],
  trcal: [{ required: true, message: "信任根证PEM编码", trigger: "blur" }]
};

// const formRef = ref(null);
const formRef = ref<FormInstance | null>(null);

const submitForm = async () => {
  if (formRef.value) {
    formRef.value.validate(async valid => {
      if (valid) {
        try {
          const { data } = await seRegSrv(formData.value); // 假设 formData 也是一个 ref，需要使用 .value 访问
          console.log(data);
          ElMessage.success("芯片注册完成。");
        } catch (error) {
          console.error("注册失败:", error);
          ElMessage.error("注册失败。");
        }
      } else {
        console.log("表单校验失败");
        return false;
      }
    });
  }
};

const resetForm = async () => {
  // load form init data from backend
  // seLoadConfSrv
  const { data } = await seLoadConfSrv();
  console.log(data);
  // 用data内容填充formData
  formData.value = data;
};
const querySeSn = async () => {
  // todo...
  const { data } = await getSeSnSrv();
  console.log(data);
  formData.value.seSN = data;
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
