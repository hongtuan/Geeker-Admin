<template>
  <el-dialog v-model="dialogVisible" :title="`${parameter.title}`" :destroy-on-close="true" width="580px" draggable>
    <div class="form-title">请为<span class="vip-text" v-html="parameter.rowData?.dvcName"></span>设备上传文件</div>
    <el-form class="drawer-multiColumn-form" label-width="100px">
      <el-form-item label="文件版本">
        <el-input v-model="fileInfo.version" style="width: 360px" placeholder="请输入文件版本" />
      </el-form-item>
      <el-form-item label="文件说明">
        <el-input type="textarea" v-model="fileInfo.desc" :rows="3" style="width: 360px" placeholder="请输入文件说明" />
      </el-form-item>
      <el-form-item label="OTA文件">
        <FileUploader
          ref="fileUploaderRef"
          :upload-limit="1"
          :max-file-size="32"
          :accept-types="'.s19,.hex,.bin,.mot'"
          @file-selected="handleFileSelected"
          @file-removed="handleFileRemoved"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="doUploadTask" :disabled="uploadDisabled">上传</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="OtaFileUploader">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import FileUploader from "@/components/FileUploader.vue";

export interface ParentSendParameterProps {
  title: string; // 标题
  rowData: any;
  uploadApi: (params: any) => Promise<any>; // 上传文件的Api
  getTableList?: () => Promise<any>; // 刷新数据的Api
}

// 为 fileUploaderRef 明确指定类型
const fileUploaderRef = ref<InstanceType<typeof FileUploader> | null>(null);

const dialogVisible = ref(false);
const uploadDisabled = ref(true); // 保留 uploadDisabled
const selectedFile = ref<any>(null); // 单个文件变量
const fileInfo = ref<any>({
  version: "",
  desc: ""
});
const parameter = ref<Partial<ParentSendParameterProps>>({});

// 初始化数据
const initializeData = () => {
  fileUploaderRef.value?.clearFiles(); // 清空文件列表
  uploadDisabled.value = true; // 禁用上传按钮
  fileInfo.value = {
    version: "",
    desc: ""
  }; // 清空输入框内容
};

// 接收父组件参数并打开对话框
const openDialog = (params?: any) => {
  parameter.value = params;
  dialogVisible.value = true;
  initializeData(); // 调用数据初始化方法
};

// 处理文件选中事件
const handleFileSelected = (file: any) => {
  selectedFile.value = file; // 保存单个文件
  uploadDisabled.value = !file; // 如果文件存在，则启用上传按钮
};

// 处理文件移除事件
const handleFileRemoved = () => {
  selectedFile.value = null; // 清空文件
  uploadDisabled.value = true; // 禁用上传按钮
};

// 执行上传任务
const doUploadTask = async () => {
  if (!selectedFile.value) {
    ElMessage.warning("请选择文件");
    return;
  }
  const file = selectedFile.value;
  const myFormData = new FormData();
  myFormData.append("file", file.raw);
  myFormData.append("dvcId", parameter.value.rowData.id);
  myFormData.append("version", fileInfo.value.version);
  myFormData.append("desc", fileInfo.value.desc);
  await parameter.value.uploadApi!(myFormData);
  await parameter.value.getTableList!();
  dialogVisible.value = false;
};

// 接收父组件参数
defineExpose({
  acceptParams: openDialog // 暴露打开对话框的方法
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
