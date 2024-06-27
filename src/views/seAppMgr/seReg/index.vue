<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>偏转芯片配置</span>
      </div>
    </template>
    <el-row>
      <el-col>
        <el-form :model="formData" label-width="140px">
          <el-form-item label="芯片类型:">
            <el-input v-model="formData.seType" class="input-line" />
          </el-form-item>
          <el-form-item label="芯片序列号:">
            <el-input v-model="formData.seSN" class="input-line" />
            <el-button @click="querySeSn">查询</el-button>
          </el-form-item>
          <el-form-item label="芯片注册标识:">
            <el-input v-model="formData.rmid" class="input-line" />
          </el-form-item>
          <el-form-item label="网关设备序列号:">
            <el-input v-model="formData.gwDevSN" class="input-line" />
          </el-form-item>
          <el-form-item label="车辆型号:">
            <el-input v-model="formData.vehType" class="input-line" />
          </el-form-item>
          <el-form-item label="车辆标识(VIN):">
            <el-input v-model="formData.vecVin" class="input-line" />
          </el-form-item>
          <el-form-item label="图商标识:">
            <el-input v-model="formData.mspSN" class="input-line" />
          </el-form-item>
          <el-form-item label="数据密钥:">
            <el-input v-model="formData.dKey" class="input-line" />
          </el-form-item>
          <el-form-item label="信任根证PEM文件内容:">
            <el-input v-model="formData.trcal" type="textarea" :rows="10" style="width: 640px" />
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

<script setup lang="ts" name="seReg">
// import { ref, onMounted } from "vue";
// import { ElInput } from "element-plus";
// import dayjs from "dayjs";
// import { confirmAction } from "@/api/modules/utilfuns";
import { getSeSnSrv, seRegSrv } from "@/api/modules/seappmgr";
import { ElMessage } from "element-plus";
import { reactive } from "vue";

// do not use same name with ref
const formData = reactive({
  seType: "XT-M580",
  seSN: "",
  rmid: "XTSE567812345678",
  gwDevSN: "gw001",
  vehType: "红旗Exxx",
  vecVin: "xxx-yyy",
  mspSN: "SW-2024",
  dKey: "1234567887654321",
  trcal: ""
});

const onSubmit = async () => {
  // ElMessage.success("提交的数据为 : " + JSON.stringify(formData));
  const { data } = await seRegSrv(formData);
  console.log(data);
  ElMessage.success("芯片注册完成。");
};
const querySeSn = async () => {
  // todo...
  const { data } = await getSeSnSrv();
  console.log(data);
  formData.seSN = data;
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
