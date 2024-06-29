<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>偏转应用配置</span>
      </div>
    </template>
    <el-form ref="formRef" :model="form" :rules="rules">
      <div style="width: 100%; height: 296px; overflow: auto">
        <el-row type="flex" align="middle">
          <el-col :span="24">
            <el-form-item label="应用签名数据(ASD):" prop="asdInfo">
              <el-input type="textarea" v-model="form.asdInfo" :rows="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="24" class="button-container">
            <el-button @click="onSubmit">保存</el-button>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ElMessage, ElForm } from "element-plus";
import { ref } from "vue";
import { appRegSrv } from "@/api/modules/seappmgr";

const formRef = ref<typeof ElForm | null>(null);
const form = ref({
  asdInfo: ""
});

const rules = {
  asdInfo: [{ required: true, message: "应用签名数据(ASD)", trigger: "blur" }]
};

const onSubmit = async () => {
  if (!formRef.value) return;
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const { data } = await appRegSrv(form.value.asdInfo);
        console.log(data);
        ElMessage.success("应用注册完成。");
      } catch (error) {
        console.error("注册失败:", error);
        ElMessage.error("注册失败。");
      }
    } else {
      console.log("表单校验失败");
      return false;
    }
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
