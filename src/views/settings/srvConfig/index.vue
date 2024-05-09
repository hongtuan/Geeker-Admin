<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>服务配置</span>
      </div>
    </template>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>服务器基本配置</span>
            </div>
          </template>
          <div style="width: 100%; height: 210px; overflow: auto">
            <el-row type="flex" align="middle" style="margin-bottom: 10px">
              <el-col :span="5" style="text-align: right"><span>服务器时间：</span></el-col>
              <el-col :span="8" style="min-height: 36px">
                <el-input type="input" v-model="sysTime" style="width: 240px"></el-input>
              </el-col>
              <el-col :span="9" style="min-height: 36px">
                <el-button @click="refreshTime">刷新</el-button>
                <el-button @click="saveTime">保存</el-button>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" style="margin-bottom: 10px">
              <el-col :span="5" style="text-align: right"><span>以太网Mac地址：</span></el-col>
              <el-col :span="8"><el-input type="input" v-model="ethMac" style="width: 240px"></el-input></el-col>
              <el-col :span="9">
                <el-button @click="refreshEthMac">刷新</el-button>
                <el-button @click="saveEthMac">保存</el-button>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" style="margin-bottom: 10px">
              <el-col :span="5" style="text-align: right"><span>天津工场测试模式：</span></el-col>
              <el-col :span="8">
                <el-checkbox v-model="tjTestMode">
                  <span>{{ tjTestMode ? "打开" : "关闭" }}</span>
                </el-checkbox>
              </el-col>
              <el-col :span="9">
                <el-button @click="loadTJTestMode">刷新</el-button>
                <el-button @click="saveTJTestMode">保存</el-button>
                <el-button @click="restartGw">重启网关服务</el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>服务器以太网设置</span>
            </div>
          </template>
          <div style="width: 100%; height: 210px; overflow: auto">
            <el-row type="flex" align="middle">
              <el-col :span="24">
                <el-input type="textarea" v-model="ethConf" :rows="6"></el-input>
              </el-col>
            </el-row>
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="24">
                <el-button style="margin-right: 10px" @click="refreshEthConf">刷新</el-button>
                <el-button style="margin-right: 10px" @click="getEthConfDefault">加载默认配置</el-button>
                <el-button @click="saveEthConf">保存</el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>INS数据处理配置</span>
            </div>
          </template>
          <div style="width: 100%; height: 296px; overflow: auto">
            <el-row type="flex" align="middle">
              <el-col :span="24">
                <el-input type="textarea" v-model="insConf" :rows="10"></el-input>
              </el-col>
            </el-row>
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="24">
                <el-button style="margin-right: 10px" @click="refreshInsConf">刷新</el-button>
                <el-button style="margin-right: 10px" @click="getInsConfDefault">加载默认配置</el-button>
                <el-button @click="saveInsConf">保存</el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>CPT7数据处理配置</span>
            </div>
          </template>
          <div style="width: 100%; height: 296px; overflow: auto">
            <el-row type="flex" align="middle">
              <el-col :span="24">
                <el-input type="textarea" v-model="cpt7Conf" :rows="10"></el-input>
              </el-col>
            </el-row>
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="24">
                <el-button style="margin-right: 10px" @click="refreshCpt7Conf">刷新</el-button>
                <el-button style="margin-right: 10px" @click="getCpt7ConfDefault">加载默认配置</el-button>
                <el-button @click="saveCpt7Conf">保存</el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts" name="srvConfig">
import { ref, onMounted } from "vue";
import { getSysTime, setSysTime, getEthMac, setEthMac, getEthConf, setEthConf, loadEthConfDefault } from "@/api/modules/sysadmin";
import {
  getINSConf,
  setINSConf,
  loadINSConfDefault,
  getCPT7Conf,
  setCPT7Conf,
  loadCPT7ConfDefault,
  getTJTestMode,
  setTJTestMode,
  restartGwSrv
} from "@/api/modules/sysadmin";
// import { ElMessage } from 'element-plus';
// import { getSysTime, setSysTime } from '@/api/settings/srvConfig';
const sysTime = ref();
const ethMac = ref();
const ethConf = ref();
const insConf = ref();
const cpt7Conf = ref();
const tjTestMode = ref();

const refreshTime = async () => {
  // 请求后端服务加载数据
  const { data } = await getSysTime();
  // console.log(JSON.stringify(data, null, 2));
  sysTime.value = data.sysTime;
  // console.log(sysTime.value);
};
const saveTime = async () => {
  // 请求后端服务加载数据
  let param = { sysTime: sysTime.value };
  const { data } = await setSysTime(param);
  console.log(JSON.stringify(data, null, 2));
  sysTime.value = data.sysTime;
  console.log(sysTime.value);
};

const refreshEthMac = async () => {
  // 请求后端服务加载数据
  const { data } = await getEthMac();
  ethMac.value = data.ethMac;
  console.log(ethMac.value);
  // refreshTime();
};

const saveEthMac = async () => {
  // 请求后端服务加载数据
  let param = { ethMac: ethMac.value };
  const { data } = await setEthMac(param);
  ethMac.value = data.ethMac;
  console.log(ethMac.value);
};

const refreshEthConf = async () => {
  // 请求后端服务加载数据
  const { data } = await getEthConf();
  ethConf.value = data.ethConf;
};

const saveEthConf = async () => {
  // 请求后端服务加载数据
  let param = { ethConf: ethConf.value };
  const { data } = await setEthConf(param);
  ethConf.value = data.ethConf;
};

const getEthConfDefault = async () => {
  // 请求后端服务加载数据
  const { data } = await loadEthConfDefault();
  ethConf.value = data.ethConf;
};

const refreshInsConf = async () => {
  // 请求后端服务加载数据
  const { data } = await getINSConf();
  insConf.value = data.insConf;
};

const saveInsConf = async () => {
  // 请求后端服务加载数据
  let param = { insConf: insConf.value };
  const { data } = await setINSConf(param);
  insConf.value = data.insConf;
};

const getInsConfDefault = async () => {
  // 请求后端服务加载数据
  const { data } = await loadINSConfDefault();
  insConf.value = data.insConf;
};

const refreshCpt7Conf = async () => {
  // 请求后端服务加载数据
  const { data } = await getCPT7Conf();
  cpt7Conf.value = data.cpt7Conf;
};

const saveCpt7Conf = async () => {
  // 请求后端服务加载数据
  let param = { cpt7Conf: cpt7Conf.value };
  const { data } = await setCPT7Conf(param);
  cpt7Conf.value = data.cpt7Conf;
};

const getCpt7ConfDefault = async () => {
  // 请求后端服务加载数据
  const { data } = await loadCPT7ConfDefault();
  cpt7Conf.value = data.cpt7Conf;
};

const restartGw = async () => {
  // 请求后端服务加载数据
  const { data } = await restartGwSrv();
  console.log(data);
};

const loadTJTestMode = async () => {
  // 请求后端服务加载数据
  const { data } = await getTJTestMode();
  console.log(JSON.stringify(data, null, 2));
  tjTestMode.value = data.tjTestMode;
  console.log(data);
};

const saveTJTestMode = async () => {
  // 请求后端服务加载数据
  let param = { tjTestMode: tjTestMode.value };
  const { data } = await setTJTestMode(param);
  console.log(data);
};

const loadData = async () => {
  // 请求后端服务加载数据
  refreshTime();
  refreshEthMac();
  refreshEthConf();
  refreshInsConf();
  refreshCpt7Conf();
  loadTJTestMode();
};
// 页面加载完毕后调用这个方法
onMounted(() => loadData());
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
