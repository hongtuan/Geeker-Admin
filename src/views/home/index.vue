<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>系统特点及功能简介</span>
      </div>
    </template>
    <el-row :gutter="5">
      <el-col :span="10">
        <ul>
          系统特点
          <li>可支持多种OTA文件格式的解析</li>
          <li>灵活定制签名组包模式</li>
          <li>灵活定制签名、加密算法</li>
          <li>对设备验签提供验证适配支持</li>
        </ul>
        <ul>
          系统功能
          <li>设备管理 一个设备使用相同签名文件配置、相同签名密钥和证书，可以包含多个OTA文件</li>
          <li>签名服务器管理</li>
          <li>签名证书标识管理</li>
          <li>对设备签名提供审计日志</li>
        </ul>
        <p class="desc-text">
          本产品核心价值在于能够提升OTA升级包构建和发布效率，简化应用开发商对其物联网设备OTA升级包的安全签名处理过程。
          提供友好的管理界面来实现对OTA升级文件的管理，包括OTA升级文件的上传、签名处理、下载、删除、版本管理等。
        </p>
        <p class="desc-text">
          其核心功能为对OTA升级文件进行安全处理，可根据OTA设备升级校验规则要求，对OTA升级文件进行解析、签名和组包处理，处理过程为对文件指定区块内容进行签名，
          并将签名结果填充到文件指定区域，支持处理常见的S19、Mot、Hex等OTA升级包格式。
        </p>
        <p class="desc-text">
          产品与签名服务器产品密切配合，通过调用签名服务器来实现签名，并对签名业务请求进行安全审计管理；同时提供对OTA升级文件信息的管理功能，
          包括文件版本、升级设备类型、发布方式、发布时间等，方便对多类设备及其不同版本的升级包进行集中管理。
        </p>
      </el-col>
      <el-col :span="14">
        <img class="home-bg" src="@/assets/images/otass_desc.png" alt="welcome" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts" name="home">
// const markdownText = ref<string>(`
// ## 1. 项目管理
// - 项目列表

// ## 2. 用例管理
// - 用例列表

// ## 3. 任务管理
// `);
//
</script>
<style scoped lang="scss">
@use "./index.scss";
</style>
