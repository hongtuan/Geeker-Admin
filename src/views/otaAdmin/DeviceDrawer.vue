<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="580px" :title="`${drawerProps.title}任务`">
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.rowData"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="任务名称" prop="dvcName">
        <el-input v-model="drawerProps.rowData.dvcName" placeholder="请填写控制器名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="控制器类别" prop="dvcType">
        <el-select v-model="drawerProps.rowData.dvcType" placeholder="请选择控制器类别" clearable>
          <el-option v-for="item in devieTypeDict" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="签名者" prop="sid">
        <el-input v-if="drawerProps.isView" type="input" v-model="drawerProps.rowData.signerName"></el-input>
        <el-select v-else v-model="drawerProps.rowData.sid" placeholder="请选择签名者" clearable>
          <el-option v-for="item in userAssignedSigner" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="控制器签名配置" prop="signConfig" style="overflow: auto">
        <el-tabs type="border-card">
          <el-tab-pane label="文本编辑(可增加节点)">
            <el-input type="textarea" v-model="signConfigStore.jsonStr" :rows="15" style="width: 330px"></el-input>
          </el-tab-pane>
          <el-tab-pane label="对象展示(仅可修改值)">
            <vue-json-pretty
              v-model:data="signConfigStore.jsonObj"
              :deep="5"
              :virtual="true"
              :height="300"
              :show-line="true"
              :show-line-number="true"
              :show-length="true"
              :show-icon="true"
              :editable-trigger="'dblclick'"
              :editable="!drawerProps.isView"
            />
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item label="控制器硬件信息" prop="dvcHdInfo">
        <el-input v-model="drawerProps.rowData.dvcHdInfo" placeholder="请填写控制器硬件信息" clearable></el-input>
      </el-form-item>
      <el-form-item label="控制器操作系统" prop="dvcOsInfo">
        <el-input v-model="drawerProps.rowData.dvcOsInfo" placeholder="请填写控制器操作系统信息" clearable></el-input>
      </el-form-item>
      <el-form-item label="控制器创建时间" prop="createdAt" v-if="drawerProps.isView">
        <el-input v-model="drawerProps.rowData.createdAt" clearable></el-input>
      </el-form-item>
      <el-form-item label="控制器修改时间" prop="updatedAt" v-if="drawerProps.isView">
        <el-input v-model="drawerProps.rowData.updatedAt" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="DeviceDrawer">
import { ref, reactive, watch } from "vue";
import { devieTypeDict } from "@/utils/serviceDict";
import { ElMessage, FormInstance } from "element-plus";
import { getUserAssignedSigner } from "@/api/modules/sysadmin";

import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

const rules = reactive({
  dvcName: [{ required: true, message: "请填写任务名称" }],
  dvcType: [{ required: true, message: "请选择控制器类型" }]
});

const userAssignedSigner = ref<any>();

const signConfigStore = reactive({
  jsonStr: JSON.stringify({}, null, 2),
  jsonObj: {}
});

interface DrawerProps {
  title: string;
  isView: boolean;
  rowData?: any;
  api?: (params: any) => Promise<any>;
  getTableList?: () => Promise<any>;
}

watch(
  () => signConfigStore.jsonStr,
  newVal => {
    try {
      signConfigStore.jsonObj = JSON.parse(newVal);
    } catch (err) {
      console.log("JSON ERROR");
    }
  }
);

watch(
  () => signConfigStore.jsonObj,
  newVal => {
    try {
      signConfigStore.jsonStr = JSON.stringify(newVal, null, 2);
    } catch (err) {
      console.log("JSON ERROR");
    }
  }
);
// drawer框状态
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: ""
});

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  // 使用父组件传入数据填充本地数据
  signConfigStore.jsonObj = {};
  signConfigStore.jsonStr = drawerProps.value.rowData?.signConfig;
  // 增加一个数据的初始同步转换
  // try {
  //   signConfigStore.jsonObj = JSON.parse(signConfigStore.jsonStr);
  //   signConfigStore.jsonStr = JSON.stringify(signConfigStore.jsonObj, null, 2); // 格式化为带换行的 JSON
  // } catch (err) {
  //   console.log("JSON ERROR");
  //   signConfigStore.jsonObj = {};
  // }
  console.log("look", signConfigStore.jsonStr);
  // 调用接口获取签名者
  const { data } = await getUserAssignedSigner(drawerProps.value.rowData?.uid);
  userAssignedSigner.value = data;
  // 打开抽屉
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      // 回填本地数据
      drawerProps.value.rowData.signConfig = JSON.stringify(signConfigStore.jsonObj);
      // 定义一个变量，用于存储需要提交的数据，并且只提交drawerProps.value.rowData部分属性
      const { id, uid, sid, dvcName, dvcType, dvcHdInfo, dvcOsInfo, signConfig } = drawerProps.value.rowData;
      const submitData = { id, uid, sid, dvcName, dvcType, dvcHdInfo, dvcOsInfo, signConfig };
      // 请求后台服务，处理增加和修改
      await drawerProps.value.api!(submitData);
      ElMessage.success({ message: `${drawerProps.value.title}控制器成功！` });
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
