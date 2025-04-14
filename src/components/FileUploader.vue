<template>
  <el-upload
    class="upload"
    ref="uploadRef"
    v-model:file-list="selectedFileList"
    :drag="false"
    :multiple="false"
    :limit="uploadLimit"
    :show-file-list="true"
    :on-change="handleChange"
    :on-remove="handleRemove"
    :before-upload="handleBeforeUpload"
    :accept="acceptTypes"
    :auto-upload="false"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text"><em class="vip-text-blue">点击选择文件</em></div>
  </el-upload>
</template>

<script setup lang="ts" name="FileUploader">
import { ref } from "vue";
import { ElMessage, UploadUserFile, UploadInstance } from "element-plus";

// 定义组件的 props
const props = defineProps({
  uploadLimit: {
    type: Number,
    default: 1 // 默认只能上传一个文件
  },
  maxFileSize: {
    type: Number,
    default: 32 // 默认文件大小限制为 32MB
  },
  acceptTypes: {
    type: String,
    default: ".s19,.hex,.bin,.mot" // 默认允许的文件类型
  }
});

const selectedFileList = ref<UploadUserFile[]>([]); // 文件列表
const uploadRef = ref<UploadInstance>();
const emit = defineEmits(["fileSelected", "fileRemoved"]);

// 文件上传前的校验
const handleBeforeUpload = (file: any) => {
  const allowedExtensions = props.acceptTypes.split(",");
  const fileExt = file.name.split(".").pop().toLowerCase();
  if (!allowedExtensions.includes(`.${fileExt}`)) {
    ElMessage.warning(`只能上传扩展名为 ${allowedExtensions.join(", ")} 的文件`);
    return false;
  }
  if (file.size / 1024 / 1024 > props.maxFileSize) {
    ElMessage.warning(`上传文件大小不能超过 ${props.maxFileSize}MB`);
    return false;
  }
  return true;
};

// 文件选中时触发
const handleChange = (file: any) => {
  // const file = selectedFileList.value[0]; // 获取当前选中的文件
  //   console.log("选中的文件:", file);
  emit("fileSelected", file); // 传递选中的文件到上层组件
};

// 文件移除时触发
const handleRemove = () => {
  emit("fileRemoved", null); // 通知上层组件文件已移除
};

// 清空文件列表
const clearFiles = () => {
  selectedFileList.value = []; // 清空文件列表
  uploadRef.value?.clearFiles(); // 调用 el-upload 的清空方法
};

// 暴露清空文件的方法
defineExpose({
  clearFiles
});
</script>

<style scoped>
.upload {
  width: 100%;
}
</style>
