<template>
  <el-dialog v-model="dialogVisible" :title="acceptProps.title" width="30%" draggable>
    <p>
      为管理员<em>{{ rowData.name }}</em> 分配证书
    </p>
    <el-select v-model="selectedValues" multiple placeholder="Select" style="width: 240px">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit()">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="AssignSigner">
import { ref } from "vue";
import { getSignerListVL, saveAssignedSigner } from "@/api/modules/sysadmin";
// 接收父组件传过来的属性
const acceptProps = defineProps<{ title: string; reloadFun: any }>();
// const acceptProps = defineProps<{ title: string }>();

const dialogVisible = ref(false);
const rowData = ref<any>();
const selectedValues = ref([2]);
const options = ref<any>();
const openDialog = async (row: any) => {
  rowData.value = row;
  // 使用rowData.value.signers赋值给selectedValues.value，用于显示已分配的签名者
  selectedValues.value = rowData.value.assignedSignerIds;
  console.log(row);
  console.log(selectedValues.value);
  const { data } = await getSignerListVL();
  // selectedValues.value = data.assignedCerts;
  // { data } = await getCertSelect();
  console.log(data);
  // 从后台加载证书数据，赋值给options.value，用于显示可选择的签名者列表
  // options.value = data.allCerts;
  options.value = data;
  dialogVisible.value = true;
};

const handleSubmit = async () => {
  // console.log(selectedValues.value);
  await saveAssignedSigner(rowData.value.id, selectedValues.value);
  // 提交后，调用父组件传过来的reloadFun方法，重新加载数据
  acceptProps.reloadFun!();
  dialogVisible.value = false;
};
defineExpose({
  openDialog
});
</script>
