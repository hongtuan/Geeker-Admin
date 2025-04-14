<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>已上传{{ tableData?.length }}个OTA文件</span>
        <el-button type="primary" link :icon="UploadFilled" @click="openUploadDlg(acceptProps.dvcData)">上传OTA文件</el-button>
      </div>
    </template>
    <div style="width: 100%; height: 160px; overflow: auto">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column width="60" type="index" label="序号" :index="indexMethod" />
        <el-table-column prop="fileVersion" label="文件版本" width="150" />
        <el-table-column prop="fileDesc" label="文件说明" width="160" />
        <el-table-column prop="signedFileName" label="签名文件名" />
        <el-table-column prop="signedFileSize" label="大小M" width="80" />
        <el-table-column label="文件操作" width="200">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">签名</el-button>
            <el-button size="small" type="success" @click="handleDownload(scope.row)">下载</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script lang="ts" setup name="OtaFileMgr">
import { ref, onMounted } from "vue";
import { ElNotification, ElMessage } from "element-plus";
import { getOtaFileList, deleteOtaFile } from "@/api/modules/device";
import { UploadFilled } from "@element-plus/icons-vue";
import { uploadOtaFile, signOtaFile, downloadOtaFile } from "@/api/modules/device";
import { downloadFile } from "@/utils/fileDownload";

// 接收父组件传过来的属性
const acceptProps = defineProps<{ dvcData: any; dlgRef: any }>();

const handleEdit = (row: any) => {
  // console.log(row);
  signOtaFile(row.did, row.id).then(res => {
    console.log(res);
    loadData();
  });
};

const handleDownload = async (row: any) => {
  ElNotification({
    title: "温馨提示",
    message: "如果数据庞大会导致下载缓慢哦，请您耐心等待！",
    type: "info",
    duration: 2000
  });
  try {
    // 调用后端接口获取文件数据
    const response = await downloadOtaFile(row.id); // 底层方法已设置 responseType 为 blob
    // 使用提取的工具方法处理文件下载
    downloadFile(response, `${row.signedFileName}_.zip`);
  } catch (error) {
    console.error("文件下载失败", error);
    ElMessage.error("文件下载失败，请稍后重试！");
  }
};

const handleDelete = (row: any) => {
  console.log(row);
  deleteOtaFile(row.id).then(res => {
    console.log(res);
    loadData();
  });
};
const indexMethod = (index: number) => {
  return index + 1;
};
// 填充表格的数据
const tableData = ref<[any]>();

const loadData = async () => {
  if (Object.keys(acceptProps.dvcData).length > 0) {
    // 请求后端服务加载数据
    const { data } = await getOtaFileList(acceptProps.dvcData.id);
    tableData.value = data;
  }
};

// 组件被加载完毕后回调用这个方法
onMounted(() => loadData());
// 打开上传文件弹窗
const openUploadDlg = (rowData: any) => {
  const params = {
    title: "上传文件",
    rowData,
    uploadApi: uploadOtaFile,
    getTableList: loadData
  };

  // 调用子组件暴露出来的方法
  acceptProps.dlgRef.acceptParams(params);
  // acceptProps.dlgRef.clearFiles(); // 清空文件列表
};
</script>
