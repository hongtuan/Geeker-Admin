import { ElMessageBox, ElMessage } from "element-plus";

// 可复用的操作确认方法
export const confirmAction = async (message: string, action: () => Promise<any>, successMessage: string): Promise<void> => {
  ElMessageBox.confirm(message, "操作确认", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "info"
  })
    .then(async () => {
      const { data } = await action();
      console.log(data);
      ElMessage({
        message: successMessage,
        type: "info"
      });
    })
    .catch(() => {
      // 用户点击了取消按钮，不做任何事情
    });
};
