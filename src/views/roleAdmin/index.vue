<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :init-param="initParam" :request-api="getRoleList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDlg('新增')">新增角色</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDlg('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDlg('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="EditPen" @click="showRolePermMgrDlg(scope.row)">分配权限</el-button>
        <el-button type="primary" link :icon="Delete" @click="confirmDeleteRole(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <RoleUpdateDlg ref="roleUpdateDlg" />
    <RolePermMgrDlg ref="rolePermMgrDlg" />
  </div>
</template>

<script setup lang="ts" name="roleAdmin">
import { ref, reactive } from "vue";
import { ElMessageBox } from "element-plus";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
// import { logTypeDict } from "@/utils/serviceDict";
import { getRoleList, addRole, updateRole, deleteRole } from "@/api/modules/sysadmin";
import { getRoleMenuData, updateAuthMenu } from "@/api/modules/sysadmin";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import RoleUpdateDlg from "./RoleUpdateDlg.vue";
import RolePermMgrDlg from "./RolePermMgrDlg.vue";

const proTable = ref();
const initParam = reactive({});
// 角色对话框引用(新增、查看、编辑)
const roleUpdateDlg = ref();
const rolePermMgrDlg = ref();

// 表格配置项，使用any也可以，但是会失去类型提示
const columns: ColumnProps<any>[] = [
  { type: "index", label: "序号", width: 80 },
  {
    prop: "name",
    label: "角色名称",
    width: 150,
    search: { el: "input", order: 2 }
  },
  {
    prop: "roleDesc",
    label: "角色描述",
    search: { el: "input", order: 2 }
  },
  {
    prop: "createdAt",
    label: "日志时间",
    width: 180
  },
  {
    prop: "updatedAt",
    label: "更新时间",
    width: 180
  },
  { prop: "operation", label: "操作", fixed: "right", width: 350 }
];

const openDlg = (title: string, rowData: any = {}) => {
  // console.log(type, row);
  const params = {
    title,
    rowData: { ...rowData },
    isView: title === "查看",
    updateApi: title === "新增" ? addRole : title === "编辑" ? updateRole : "",
    queryApi: proTable.value.getTableList
  };
  roleUpdateDlg.value.acceptParams(params);
};

const confirmDeleteRole = (row: any) => {
  ElMessageBox.confirm("是否删除该角色？", "提示", {
    type: "warning",
    showCancelButton: true,
    cancelButtonText: "取消",
    confirmButtonText: "确定"
  })
    .then(async () => {
      // 调用删除接
      await deleteRole(row.id);
      proTable.value.getTableList!();
    })
    .catch(() => {
      console.log("删除失败");
    });
};

const showRolePermMgrDlg = (row: any) => {
  // console.log(row);
  const params = {
    title: "角色权限设置",
    rowData: { ...row },
    isView: false,
    updateApi: updateAuthMenu,
    queryApi: getRoleMenuData
  };
  rolePermMgrDlg.value.acceptParams(params);
};
</script>
<style scoped lang="scss">
@use "./index.scss";
</style>
