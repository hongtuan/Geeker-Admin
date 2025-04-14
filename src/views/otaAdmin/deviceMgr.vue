<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getDeviceList"
      :init-param="initParam"
      :search-col="{ xs: 1, sm: 1, md: 2, lg: 4, xl: 4 }"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" v-auth="'add'">新增任务</el-button>
      </template>
      <!-- Expand -->
      <template #expand="exp">
        <OtaFileMgr :dvc-data="exp.row" :dlg-ref="otaFileUploaderRef" />
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="confirmDeleteDevice(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <DeviceDrawer ref="drawerRef" />
    <OtaFileUploader ref="otaFileUploaderRef" />
  </div>
</template>

<script setup lang="ts" name="deviceMgr">
import { ref, reactive } from "vue";
import { ElMessageBox } from "element-plus";
import { Device } from "@/api/interface/index";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { devieTypeDict } from "@/utils/serviceDict";
import DeviceDrawer from "./DeviceDrawer.vue";
import OtaFileUploader from "./OtaFileUploader.vue";
import OtaFileMgr from "./OtaFileMgr.vue";
// import { GlobalStore } from "@/stores";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import { getDeviceList, addDevice, editDevice, deleteDevice } from "@/api/modules/device";
// const globalStore = GlobalStore();
import { useUserStore } from "@/stores/modules/user";
const { userInfo } = useUserStore();
console.log(userInfo);
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

// 表格配置项
const columns: ColumnProps<Device.ResDeviceList>[] = [
  // { type: "selection", fixed: "left", width: 80 },
  { type: "index", label: "序号", width: 80 },
  { type: "expand", label: "升级包", width: 100 },
  {
    prop: "dvcName",
    label: "任务名称",
    search: { el: "input", order: 2 }
  },
  {
    prop: "dvcType",
    label: "控制器类型",
    width: 160,
    enum: devieTypeDict,
    search: { order: 1, el: "select", props: { filterable: true } },
    fieldNames: { label: "label", value: "value" }
  },
  { prop: "dvcHdInfo", label: "硬件信息", isShow: false },
  { prop: "dvcOsInfo", label: "操作系统", isShow: false },
  {
    prop: "createdAt",
    label: "创建时间",
    width: 180
  },
  {
    prop: "updatedAt",
    label: "更新时间",
    width: 180
  },
  { prop: "operation", label: "操作", fixed: "right", width: 220 }
];

const confirmDeleteDevice = (row: any) => {
  // 确认切换
  ElMessageBox.confirm(`确定要删除【${row.dvcName}】设备吗?`, "操作确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true
  })
    .then(async () => {
      // 请求后台进行状态更新
      await deleteDevice(row.id);
      proTable.value.getTableList!();
      // loadData();
    })
    .catch(() => {
      // 操作者选择取消，do nothing
    });
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref();

const openDrawer = (title: string, rowData: Partial<Device.ResDeviceList> = {}) => {
  // console.log(rowData);
  const params = {
    title,
    rowData: { uid: userInfo.userId, ...rowData },
    isView: title === "查看",
    api: title === "新增" ? addDevice : title === "编辑" ? editDevice : "",
    getTableList: proTable.value.getTableList
  };
  // console.log(params);
  drawerRef.value.acceptParams(params);
};
// 文件上传组件的引用，用于传递到子组件OtaFileList中使用
const otaFileUploaderRef = ref();
</script>
