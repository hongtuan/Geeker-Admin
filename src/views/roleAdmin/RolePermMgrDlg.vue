<template>
  <!-- 菜单分配对话框  @check="handleCheck" @check-change="handleCheckChange" v-model="selectedMenuData"-->
  <el-dialog v-model="dlgVisible" :title="dlgProps.title" width="30%" draggable>
    <div>为角色分配菜单权限</div>
    <el-tree
      ref="treeRef"
      :data="menuTreeData"
      show-checkbox
      highlight-current
      accordion
      node-key="id"
      :height="200"
      :default-checked-keys="checkedMenuKeys"
      :props="defaultProps"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="updataMenu()">保存</el-button>
        <el-button @click="dlgVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="RolePermMgrDlg">
import { ref } from "vue";
import { DialogProps } from "@/api/interface";
const dlgVisible = ref(false);

const defaultProps = {
  children: "children",
  label: "label",
  disabled: "disabled"
};

const menuTreeData = ref<[any]>();

const treeRef = ref<any>();

const checkedMenuKeys = ref<[number]>();
const treeSelectedNodes = ref<[any]>();

const getSelectedMenuData = () => {
  // 采用false、true调用，可以获取到已选择节点数据
  treeSelectedNodes.value = treeRef.value.getCheckedNodes(false, true);
  let menuKeysList: number[] = [];
  let menuDataList: any[] = [];
  // 从组件给出的已选择的节点数据中提取数据
  treeSelectedNodes.value?.forEach(sd => {
    // console.log(item);
    menuDataList.push(sd);
    menuKeysList.push(sd["id"]);
  });
  console.log(menuKeysList);
  console.log(menuDataList);
  // 对menuDataList进行重新组装，处理父子关系
  let mergedMenuDataList: any[] = [];
  let tmpId: number = -1;
  menuDataList.forEach(md => {
    // 对md进行筛选
    // console.log(md);
    if ("children" in md) {
      tmpId = md.id;
      // console.log("timId", tmpId);
      // console.log("haschildren", md.children);
      // 从menuDataList提取pid==tmpId元素
      let tmpList: any[] = [];
      menuDataList.forEach(_md => {
        if (_md.pid == tmpId) {
          tmpList.push(_md);
        }
      });
      // 深度复制
      let md_copy = { ...md };
      md_copy.children = tmpList;
      mergedMenuDataList.push(md_copy);
      if (md_copy.children.length != md.children.length) {
        const index = menuKeysList.indexOf(tmpId);
        if (index !== -1) {
          menuKeysList.splice(index, 1);
        }
        // console.log(`tmpId=${tmpId},index=${index}`);
      }
    } else {
      if (md.pid != tmpId) {
        mergedMenuDataList.push(md);
      } else {
        console.log("jump child:", md);
      }
    }
  });
  console.log(mergedMenuDataList);
  let menuData: any = { id: dlgProps.value.rowData.id, authedMenuKeys: menuKeysList, authedMenuData: mergedMenuDataList };
  // console.log(menuData);
  return menuData;
};

const updataMenu = async () => {
  let selectedMenuData = getSelectedMenuData();
  const { data } = await dlgProps.value.updateApi!(selectedMenuData);
  console.log(data);
  // 关闭对话框
  dlgVisible.value = false;
};

const dlgProps = ref<DialogProps>({
  isView: false,
  title: ""
});

// 接收父组件传过来的参数
const acceptParams = (params: DialogProps): void => {
  console.log(params);
  dlgProps.value = params;
  dlgVisible.value = true;
  loadData();
  // console.log(dlgProps.value.rowData);
};

const loadData = async () => {
  checkedMenuKeys.value = [0];
  // console.log("loadData");
  // console.log(dlgProps.value.rowData);

  // 请求后端服务加载数据,不能调用queryApi，因为它不接受参数,已解决。
  // const { data } = await getRoleMenuData(dlgProps.value.rowData.id);
  const { data } = await dlgProps.value.queryApi!(dlgProps.value.rowData.id);
  // console.log(data);
  menuTreeData.value = data.allMenu;
  checkedMenuKeys.value = data.authedMenuKeys;
};

defineExpose({
  acceptParams
});
</script>
