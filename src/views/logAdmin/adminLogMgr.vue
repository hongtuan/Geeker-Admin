<template>
  <div class="table-box">
    <ProTable :columns="columns" :request-api="getLogList" :search-col="{ xs: 1, sm: 1, md: 2, lg: 4, xl: 4 }"> </ProTable>
  </div>
</template>

<script setup lang="ts" name="AdminLogMgr">
// import { ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { logTypeDict } from "@/utils/serviceDict";
import { getLogList, getAdminIdName } from "@/api/modules/sysadmin";

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
// const proTable = ref();

// 表格配置项，使用any也可以，但是会失去类型提示
// const columns: ColumnProps<Log.ResLogList>[] = [
const columns: ColumnProps<any>[] = [
  { type: "index", label: "序号", width: 80 },
  {
    prop: "logType",
    label: "日志类型",
    width: 100,
    enum: logTypeDict,
    search: { order: 1, el: "select", props: { filterable: true } },
    fieldNames: { label: "label", value: "value" }
  },
  {
    prop: "uid",
    label: "管理员",
    width: 150,
    enum: getAdminIdName,
    search: { order: 2, el: "select", props: { filterable: true } },
    fieldNames: { label: "label", value: "value" }
  },
  {
    prop: "logContent",
    label: "日志内容",
    search: { el: "input", order: 2 }
  },
  {
    prop: "createdAt",
    label: "日志时间",
    width: 180
  }
];
</script>
