import { ElMessage } from "element-plus";

/**
 * 下载文件工具方法
 * @param response 后端返回的 Axios 响应对象
 * @param defaultFileName 默认文件名
 */
export const downloadFile = (response: any, defaultFileName: string = "downloaded_file") => {
  try {
    let downloadFileName = defaultFileName;
    // 从响应头中提取 Content-Disposition
    const contentDisposition = response.headers["content-disposition"];
    // 解析文件名
    if (contentDisposition) {
      // 优先解析 filename* 格式
      const fileNameMatch = contentDisposition.match(/filename\*=utf-8''(.+)/);
      if (fileNameMatch && fileNameMatch[1]) {
        downloadFileName = decodeURIComponent(fileNameMatch[1]); // 解码文件名
      } else {
        // 如果没有 filename*，尝试解析 filename="..."
        const fileNameFallbackMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameFallbackMatch && fileNameFallbackMatch[1]) {
          downloadFileName = decodeURIComponent(fileNameFallbackMatch[1]); // 解码文件名
        }
      }
    }

    // 构建文件下载的 URL
    const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
    // 创建一个 a 标签
    const downloadLink = document.createElement("a");
    downloadLink.style.display = "none";
    downloadLink.download = downloadFileName; // 设置文件名
    downloadLink.href = fileUrl;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(fileUrl);

    ElMessage.info("文件下载完成。");
  } catch (error) {
    console.error("文件下载失败", error);
    ElMessage.error("文件下载失败，请稍后重试！");
  }
};
