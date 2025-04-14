<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>签名服务器配置</span>
      </div>
    </template>
    <el-row>
      <el-col>
        <el-form v-for="item in vssConfigData" label-width="150px" :key="item.key">
          <el-form-item :label="`${item.label} :`">
            <el-input v-if="item.type == 'input'" type="input" v-model="item.value" style="width: 200px" />
            <el-switch v-if="item.type == 'checkbox'" v-model="item.value" style="width: 200px" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-button @click="testConfig">测试</el-button>
        <el-button @click="loadData">重新加载</el-button>
        <el-button type="primary" @click="saveData" :disabled="!testPass">保存</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts" name="VssMgr">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { loadVssConfig, testVssConfig, saveVssConfig } from "@/api/modules/sysadmin";

const vssConfigData = ref<any>();
const testPass = ref(false);

const loadData = async () => {
  const { data } = await loadVssConfig();
  vssConfigData.value = data;
  // console.log(vssConfigData.value);
  testPass.value = false;
};
onMounted(() => loadData());

const getReqData = () => {
  let reqData: any = {};
  vssConfigData.value.forEach((element: any) => {
    reqData[element.key] = element.value;
  });
  return reqData;
};
const testConfig = () => {
  let reqData = getReqData();
  // console.log(reqData);
  testVssConfig(reqData)
    .then((res: any) => {
      // console.log(res);
      testPass.value = res.code == 200;
      ElMessage.success("测试成功, 可保存配置。");
    })
    .catch((err: any) => {
      console.log(err);
      testPass.value = false;
    });
  // const res = await testVssConfig(reqData);
  // console.log(res);
  // testPass.value = true;
};
const saveData = async () => {
  let reqData = getReqData();
  // console.log(reqData);
  await saveVssConfig(reqData);
  testPass.value = false;
};
</script>
<style scoped lang="scss">
@use "./index.scss";
</style>
