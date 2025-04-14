<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="580px" :title="`${drawerProps.title}签名者`">
    <el-form
      ref="formRef"
      label-width="120px"
      label-suffix=" :"
      :rules="formCheckRules"
      :disabled="drawerProps.isView"
      :model="drawerProps.rowData"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="签名者名称" prop="signerName">
        <el-input v-model="drawerProps.rowData.signerName" placeholder="请填写签名者名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="签名者描述" prop="signerDesc">
        <el-input v-model="drawerProps.rowData.signerDesc" placeholder="请填写签名者说明信息" clearable></el-input>
      </el-form-item>
      <el-form-item label="签名者证书主题" prop="signerCertSubject" v-if="drawerProps.isView">
        <el-input v-model="drawerProps.rowData.signerCertSubject" clearable></el-input>
      </el-form-item>
      <el-form-item label="签名者创建时间" prop="createdAt" v-if="drawerProps.isView">
        <el-input v-model="drawerProps.rowData.createdAt" clearable></el-input>
      </el-form-item>
      <el-form-item label="签名者修改时间" prop="updatedAt" v-if="drawerProps.isView">
        <el-input v-model="drawerProps.rowData.updatedAt" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="SignerDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";

const formCheckRules = reactive({
  certName: [{ required: true, message: "请填写证书名称" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  rowData?: any;
  api?: (params: any) => Promise<any>;
  getTableList?: () => Promise<any>;
}

// drawer框状态
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: ""
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps): void => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const formRef = ref<FormInstance>();

const handleSubmit = () => {
  formRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      // 请求后台服务，处理增加和修改，根据后台需构建请求参数
      let reqData = {
        id: drawerProps.value.rowData.id,
        signerName: drawerProps.value.rowData.signerName,
        signerDesc: drawerProps.value.rowData.signerDesc
      };
      await drawerProps.value.api!(reqData);
      ElMessage.success({ message: `${drawerProps.value.title}签名者成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
