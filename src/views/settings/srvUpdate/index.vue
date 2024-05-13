<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>网关程序更新</span>
      </div>
    </template>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>网关服务程序</span>
        </div>
      </template>
      <div style="width: 100%; height: 360px; overflow: auto">
        <el-row type="flex" justify="start" style="margin-bottom: 10px">
          <el-col style="text-align: left" flex>
            <span class="margin-right-10">程序版本：</span>
            <el-input type="input" v-model="appVerInfo" class="margin-right-10" style="width: 240px" readonly></el-input>
            <el-button @click="refreshAppVerInfo">刷新</el-button>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" style="margin-bottom: 10px">
          <el-col style="text-align: left" flex>
            <el-upload
              class="upload"
              ref="uploadRef"
              v-model:file-list="selectedFileList"
              :drag="false"
              :multiple="false"
              :limit="1"
              :show-file-list="true"
              :on-exceed="handleExceed"
              :on-change="handleChange"
              :on-remove="handleRemove"
              :before-upload="handleBeforeUpload"
              :accept="'.gz'"
              :auto-upload="false"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text"><em class="vip-text-blue">点击选择程序升级包文件</em></div>
            </el-upload>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" style="margin-bottom: 10px">
          <el-col style="text-align: left" flex>
            <el-button type="primary" @click="doUploadTask" :disabled="uploadDisabled">上传</el-button>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" style="margin-bottom: 10px">
          <el-col style="text-align: left" flex>
            <el-input type="textarea" :value="logData" :rows="10" :readonly="true"></el-input>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </el-card>
</template>

<script setup lang="ts" name="srvUpdate">
import { ref, onMounted } from "vue";
import { ElMessage, UploadUserFile, UploadInstance } from "element-plus";
import { getAppVerInfo, uploadAppFile } from "@/api/modules/sysadmin";
const appVerInfo = ref();
const selectedFileList = ref<UploadUserFile[]>();
const uploadRef = ref<UploadInstance>();
const uploadDisabled = ref(true);
const logData = ref({});
// 文件数超出提示
const handleExceed = (): void => {
  ElMessage.warning("最多只能上传一个文件！");
};
const handleBeforeUpload = (file: any) => {
  uploadDisabled.value = false;
  console.log("handleBeforeUpload", file);
  return true;
};

const handleChange = (file: any) => {
  uploadDisabled.value = false;
  console.log("handleChange", file);
};

const handleRemove = (param: any) => {
  uploadDisabled.value = true;
  console.log("handleRemove", param);
};

const doUploadTask = async () => {
  console.log("doUploadTask");
  if (selectedFileList.value == undefined || selectedFileList.value?.length == 0) {
    ElMessage.warning("请选择文件");
    return;
  }
  // 从selectedFileList中提取第一个文件的信息	// Q: 为什么要这样做？	// A: 因为selectedFileList是一个数组，而且只能上传一个文件
  const file = selectedFileList.value[0] as any;
  // 实现对文件扩展名的限制，只允许上传.s19文件
  const fileExt = file.name.split(".").pop().toLowerCase();
  if (fileExt != "gz") {
    ElMessage.warning("只能上传扩展名为.gz的文件");
    return;
  }
  let fileSize = file.size;

  if (fileSize / 1024 / 1024 > 32) {
    ElMessage.warning("上传文件大小不能超过 32MB ");
    return;
  }
  let myFormData = new FormData();
  // 添加选中文件到formData
  myFormData.append("file", file?.raw);
  // 调用后端服务上传文件
  const { data } = await uploadAppFile!(myFormData);
  console.log(JSON.stringify(data, null, 2));
  logData.value = data;
  // 上传成功后，清理文件列表
  uploadRef.value?.clearFiles();
};

const refreshAppVerInfo = async () => {
  // 请求后端服务加载数据
  const { data } = await getAppVerInfo();
  console.log(JSON.stringify(data, null, 2));
  appVerInfo.value = data;
  console.log(appVerInfo.value);
};

const loadData = async () => {
  // 请求后端服务加载数据
  refreshAppVerInfo();
};
// 页面加载完毕后调用这个方法
onMounted(() => loadData());
</script>

<style scoped lang="scss">
@import "./index.scss";
.margin-right-10 {
  margin-right: 10px;
}
</style>
