<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getSignerList"
      :init-param="initParam"
      :search-col="{ xs: 1, sm: 1, md: 2, lg: 4, xl: 4 }"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增签名者</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="EditPen" @click="confirmSyncCert(scope.row)">同步</el-button>
        <el-button type="primary" link :icon="Delete" @click="confirmDeleteDevice(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <SignerDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="SignerMgr">
import { ref, reactive } from "vue";
import { ElMessageBox } from "element-plus";
import { Signer } from "@/api/interface/index";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import SignerDrawer from "./SignerDrawer.vue";
// import OtaFileUploader from "./OtaFileUploader.vue";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import { getSignerList, addSigner, updateSigner, deleteSigner, syncSigner } from "@/api/modules/sysadmin";

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

// 表格配置项
const columns: ColumnProps<Signer.ResSignerList>[] = [
  // { type: "selection", fixed: "left", width: 80 },
  { type: "index", label: "序号", width: 80 },
  {
    prop: "signerName",
    label: "签名者名称",
    search: { el: "input", order: 2 }
  },
  {
    prop: "signerDesc",
    label: "签名者描述"
  },
  { prop: "signerCertSubject", label: "签名者证书主题", search: { el: "input", order: 2 }, isShow: false },
  { prop: "signerCertCode", label: "签名者证书编码", isShow: false },
  { prop: "usedTimes", label: "使用次数", isShow: false },
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
  { prop: "operation", label: "操作", fixed: "right", width: 350 }
];

const confirmDeleteDevice = (row: any) => {
  // 确认切换
  ElMessageBox.confirm(`确定要删除【${row.signerName}】签名者吗?`, "操作确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true
  })
    .then(async () => {
      // 请求后台进行状态更新
      await deleteSigner(row.id);
      proTable.value.getTableList!();
      // loadData();
    })
    .catch(() => {
      // 操作者选择取消，do nothing
    });
};

const confirmSyncCert = (row: any) => {
  // 确认切换
  ElMessageBox.confirm(`确定要同步【${row.signerName}】证书吗?`, "操作确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true
  })
    .then(async () => {
      // 请求后台进行状态更新
      await syncSigner(row.id);
      proTable.value.getTableList!();
    })
    .catch(() => {
      // 操作者选择取消，do nothing
    });
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref();

const openDrawer = (title: string, rowData: Partial<Signer.ResSignerList> = {}) => {
  const params = {
    title,
    rowData: { ...rowData },
    isView: title === "查看",
    api: title === "新增" ? addSigner : title === "编辑" ? updateSigner : "",
    getTableList: proTable.value.getTableList
  };
  drawerRef.value.acceptParams(params);
};
</script>
