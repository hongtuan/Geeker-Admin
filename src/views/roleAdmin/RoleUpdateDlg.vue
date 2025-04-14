<template>
  <!-- 新增角色对话框 -->
  <el-dialog v-model="dlgVisible" :title="`${dlgProps.title}角色`" width="30%" draggable>
    <!-- 新增管理员	form -->
    <el-form ref="formRef" :model="dlgProps.rowData" label-width="120px">
      <el-form-item label="角色名 :">
        <el-input v-model="dlgProps.rowData.name" style="width: 200px" />
      </el-form-item>
      <el-form-item label="角色描述 :">
        <el-input v-model="dlgProps.rowData.roleDesc" style="width: 200px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dlgVisible = false">取消</el-button>
        <el-button type="primary" v-show="!dlgProps.isView" @click="handleSubmit()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="RoleUpdateDlg">
import { ref } from "vue";
import { DialogProps } from "@/api/interface";
import { ElMessage, FormInstance } from "element-plus";
// const formTitle = ref("新增");
const dlgVisible = ref(false);
const dlgProps = ref<DialogProps>({
  isView: false,
  title: ""
});

// 接收父组件传过来的参数
const acceptParams = (params: DialogProps): void => {
  console.log(params);
  dlgProps.value = params;
  dlgVisible.value = true;
};

// 提交数据（新增/编辑）
const formRef = ref<FormInstance>();
const handleSubmit = () => {
  formRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      // 请求后台服务，处理增加和修改，根据后台需构建请求参数
      let reqData = {
        id: dlgProps.value.rowData.id,
        roleName: dlgProps.value.rowData.name,
        roleDesc: dlgProps.value.rowData.roleDesc
      };
      await dlgProps.value.updateApi!(reqData);
      ElMessage.success({ message: `${dlgProps.value.title}角色成功！` });
      dlgProps.value.queryApi!();
      dlgVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
