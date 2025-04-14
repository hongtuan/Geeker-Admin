<template>
  <el-dialog v-model="dialogVisible" :title="`${dialogrProps.title}用户`" width="30%" draggable>
    <el-form ref="formRef" :model="dialogrProps.rowData" label-width="120px">
      <el-form-item label="用户名 :">
        <el-input v-model="dialogrProps.rowData.name" style="width: 200px" />
      </el-form-item>
      <el-form-item label="口令 :">
        <el-input v-model="dialogrProps.rowData.pwd" style="width: 200px" />
      </el-form-item>
      <el-form-item label="电子邮件 :">
        <el-input v-model="dialogrProps.rowData.email" style="width: 200px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit()">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts" name="UserUpdateDlg">
import { ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { DialogProps } from "@/api/interface/index";

const dialogVisible = ref(false);
const dialogrProps = ref<DialogProps>({
  isView: false,
  title: ""
});

const acceptParams = (params: DialogProps): void => {
  dialogrProps.value = params;
  dialogVisible.value = true;
};

const formRef = ref<FormInstance>();

const handleSubmit = () => {
  formRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      // 请求后台服务，处理增加和修改，根据后台需构建请求参数
      let reqData = {
        id: dialogrProps.value.title == "编辑" ? dialogrProps.value?.rowData.id : 0,
        name: dialogrProps.value?.rowData.name,
        pwd: dialogrProps.value?.rowData.pwd,
        email: dialogrProps.value?.rowData.email
      };
      console.log(reqData);
      await dialogrProps.value?.updateApi!(reqData);
      ElMessage.success({ message: `${dialogrProps.value?.title}用户成功！` });
      dialogrProps.value?.queryApi!();
      dialogVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};
defineExpose({
  acceptParams
});
</script>
