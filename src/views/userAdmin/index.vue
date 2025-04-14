<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :init-param="initParam" :request-api="getUseList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDlg('新增')">新增管理员</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDlg('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDlg('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="EditPen" @click="assignSignerRef.openDialog(scope.row)">分配证书</el-button>
        <el-button type="primary" link :icon="Delete" @click="confirmDeleteRole(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <!-- 新增及修改用户信息的对话框 -->
    <UserUpdateDlg ref="userFormRef" />
    <AssignSigner title="分配证书" ref="assignSignerRef" :reload-fun="loadData" />
  </div>
</template>
h
<script setup lang="tsx" name="roleAdmin">
import { ref, reactive } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getUseList, addUser, updateUseInfo, deleteUser } from "@/api/modules/sysadmin";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import UserUpdateDlg from "./UserUpdateDlg.vue";
import AssignSigner from "./AssignSigner.vue";

const proTable = ref<ProTableInstance>();
const initParam = reactive({});
// 用户对话框组件的引用
const userFormRef = ref();
const assignSignerRef = ref();

// 表格配置项，使用any也可以，但是会失去类型提示
const columns: ColumnProps<any>[] = [
  { type: "index", label: "序号", width: 80 },
  {
    prop: "name",
    label: "管理员账号",
    width: 120,
    search: { el: "input", order: 2 }
  },
  {
    prop: "certSubject",
    label: "证书主题",
    isShow: false,
    search: { el: "input", order: 2 }
  },
  {
    prop: "isValid",
    label: "有效",
    width: 80
  },
  {
    prop: "isSuperAdmin",
    label: "超管",
    width: 80
  },
  {
    prop: "roleName",
    label: "角色名",
    render: scope => {
      return (
        <el-button type="primary" onClick={() => nameClickCallback(scope.row)}>
          {scope.row.roleName}
        </el-button>
      );
    },
    width: 150
  },
  {
    prop: "createdAt",
    label: "创建时间",
    width: 170
  },
  {
    prop: "updatedAt",
    label: "更新时间",
    width: 170
  },
  { prop: "operation", label: "操作", fixed: "right" }
];

const openDlg = (title: string, rowData: any = {}) => {
  // console.log(type, row);
  const params = {
    title,
    rowData: { ...rowData },
    isView: title === "查看",
    updateApi: title === "新增" ? addUser : title === "编辑" ? updateUseInfo : "",
    queryApi: proTable.value?.getTableList
  };
  userFormRef.value.acceptParams(params);
};

const confirmDeleteRole = (row: any) => {
  ElMessageBox.confirm("是否删除该管理员？", "提示", {
    type: "warning",
    showCancelButton: true,
    cancelButtonText: "取消",
    confirmButtonText: "确定"
  })
    .then(async () => {
      // 调用删除接
      await deleteUser(row.id);
      proTable.value?.getTableList!();
    })
    .catch(() => {
      console.log("删除失败");
    });
};
const loadData = async () => {
  // 请求后端服务加载数据
  proTable.value?.getTableList!();
};

const nameClickCallback = (params: any) => {
  // console.log(params);
  ElMessage.success("look" + params.roleName);
};

// const showRolePermMgrDlg = (row: any) => {
//   // console.log(row);
//   const params = {
//     title: "角色权限设置",
//     rowData: { ...row },
//     isView: false,
//     updateApi: updateAuthMenu,
//     queryApi: getRoleMenuData
//   };
//   rolePermMgrDlg.value.acceptParams(params);
// };
</script>
<style scoped lang="scss">
@use "./index.scss";
</style>
