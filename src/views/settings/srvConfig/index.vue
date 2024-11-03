<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <el-space><span>服务配置</span></el-space>
        <el-space>
          <el-button @click="restartGw">重启网关服务</el-button>
        </el-space>
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
          <div style="width: 100%; height: 170px; overflow: auto">
            <el-row type="flex" align="middle" style="margin-bottom: 10px">
              <el-col :span="5" class="text-right"><span>服务器时间：</span></el-col>
              <el-col :span="14" style="min-height: 36px">
                <el-input type="input" v-model="sysTime" style="width: 240px"></el-input>
              </el-col>
              <el-col :span="5" style="min-height: 36px">
                <el-button @click="refreshTime">刷新</el-button>
                <el-button @click="saveTime">保存</el-button>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" style="margin-bottom: 10px">
              <el-col :span="5" class="text-right"><span>以太网Mac地址：</span></el-col>
              <el-col :span="14"><el-input type="input" v-model="ethMac" style="width: 240px"></el-input></el-col>
              <el-col :span="5">
                <el-button @click="refreshEthMac">刷新</el-button>
                <el-button @click="saveEthMac">保存</el-button>
              </el-col>
            </el-row>
            <!-- <el-row type="flex" align="middle" style="margin-bottom: 10px">
              <el-col :span="5" class="text-right"><span>天津工场测试模式：</span></el-col>
              <el-col :span="14">
                <el-checkbox v-model="tjTestMode">
                  <span class="stdfs">{{ tjTestMode ? "打开" : "关闭" }}</span>
                </el-checkbox>
              </el-col>
              <el-col :span="5">
                <el-button @click="loadTJTestMode">刷新</el-button>
                <el-button @click="saveTJTestMode">保存</el-button>
              </el-col>
            </el-row> -->
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>服务器以太网设置(保存后需要重启设备方可生效)</span>
            </div>
          </template>
          <div style="width: 100%; height: 170px; overflow: auto">
            <el-row type="flex" align="middle">
              <el-col :span="24">
                <el-input type="textarea" v-model="ethConf" :rows="4"></el-input>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle">
              <el-col :span="24" class="text-right">
                <el-button style="margin-right: 10px" @click="refreshEthConf">刷新</el-button>
                <el-button style="margin-right: 10px" @click="getEthConfDefault">加载默认配置</el-button>
                <el-button @click="saveEthConf">保存</el-button>
                <el-button @click="rebootDevCall">重启设备</el-button>
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
              <span>采集服务及日志配置(保存后重启网关服务方可生效)</span>
            </div>
          </template>
          <div style="width: 100%; height: 290px; overflow: auto">
            <el-row type="flex" align="middle" style="margin-bottom: 10px">
              <el-col :span="5" class="text-right">采集数据配置：</el-col>
              <el-col :span="19">
                <div>
                  <el-space>
                    <span>采集网卡:</span>
                    <el-input type="input" v-model="logShowConf.cap_device" style="width: 70px"></el-input>
                    <span>采集等待:</span>
                    <el-input-number
                      v-model="logShowConf.timeout_ms"
                      controls-position="right"
                      :min="0"
                      :max="2000"
                      :step="100"
                      style="width: 6em"
                    ></el-input-number>
                    <span class="stdfs">毫秒</span>
                  </el-space>
                </div>
                <div>
                  <el-space>
                    <span class="stdfs">INS采集端口:</span>
                    <el-input-number
                      v-model="logShowConf.ins_cap_port"
                      controls-position="right"
                      :min="1025"
                      :max="65534"
                      :step="100"
                      style="width: 7em"
                    ></el-input-number>
                  </el-space>
                  <el-space>
                    <span class="stdfs">CPT7采集端口:</span>
                    <el-input-number
                      v-model="logShowConf.cpt7_cap_port"
                      controls-position="right"
                      :min="1025"
                      :max="65534"
                      :step="100"
                      style="width: 7em"
                    ></el-input-number>
                  </el-space>
                </div>
                <div>
                  <el-space>
                    <span class="stdfs">采集过滤条件:</span>
                    <el-input type="input" v-model="logShowConf.filter_info" style="width: 240px"></el-input>
                    <el-checkbox v-model="logShowConf.promisc_mode">
                      <span class="stdfs">混杂模式</span>
                    </el-checkbox>
                  </el-space>
                </div>
              </el-col>
              <el-col :span="5" class="text-right">系统服务配置：</el-col>
              <el-col :span="19">
                <el-space>
                  <el-checkbox v-model="logShowConf.reply_original_pkg" disabled>
                    <span class="stdfs">转发原始报文</span>
                  </el-checkbox>
                  <el-checkbox v-model="logShowConf.proc_ins_pkg">
                    <span class="stdfs">处理INS报文</span>
                  </el-checkbox>
                  <el-checkbox v-model="logShowConf.proc_ins_pkg2">
                    <span class="stdfs">处理INS报文2</span>
                  </el-checkbox>
                  <el-checkbox v-model="logShowConf.reply_not_loc_pkg">
                    <span class="stdfs">转发INS非位置报文</span>
                  </el-checkbox>
                </el-space>
                <div>
                  <el-space>
                    <span class="stdfs">审计数据上报间隔:</span>
                    <el-input-number
                      v-model="logShowConf.adata_time_interval"
                      controls-position="right"
                      :min="1"
                      :max="120"
                      :step="1"
                      style="width: 5em"
                    ></el-input-number>
                    <span class="stdfs">分钟</span>
                  </el-space>
                  <el-space>
                    <span class="stdfs">审计事件上报间隔:</span>
                    <el-input-number
                      v-model="logShowConf.aevt_time_interval"
                      controls-position="right"
                      :min="5"
                      :max="180"
                      :step="10"
                      style="width: 5em"
                    ></el-input-number>
                    <span class="stdfs">分钟</span>
                  </el-space>
                </div>
                <el-space>
                  <span class="stdfs">系统时间源:</span>
                  <el-checkbox v-model="logShowConf.sync_sys_time_by_cpt7">
                    <span class="stdfs">CPT7</span>
                  </el-checkbox>
                  <el-checkbox v-model="logShowConf.sync_sys_time_by_ins">
                    <span class="stdfs">INS</span>
                  </el-checkbox>
                </el-space>
              </el-col>
              <el-col :span="5" class="text-right">日志输出配置：</el-col>
              <el-col :span="19">
                <el-space>
                  <el-checkbox v-model="logShowConf.show_filter_pkg">
                    <span class="stdfs">UDP包过滤</span>
                  </el-checkbox>
                  <el-checkbox v-model="logShowConf.show_loc_info">
                    <span class="stdfs">坐标数据</span>
                  </el-checkbox>
                  <el-checkbox v-model="logShowConf.show_pkg_info">
                    <span class="stdfs">UDP包摘要</span>
                  </el-checkbox>
                  <el-checkbox v-model="logShowConf.show_sec_info">
                    <span class="stdfs">偏转任务</span>
                  </el-checkbox>
                </el-space>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle">
              <el-col :span="24" class="text-right">
                <el-button @click="loadLogShowConf">刷新</el-button>
                <el-button @click="saveLogShowConf">保存</el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>数据处理配置(保存后重启网关服务方可生效)</span>
            </div>
          </template>
          <div style="width: 100%; height: 290px; overflow: auto">
            <el-tabs type="card" v-model="activeTab">
              <el-tab-pane label="CPT7数据处理配置" name="cpt7">
                <!-- CPT7配置内容 -->
                <el-row type="flex" align="middle">
                  <el-col :span="24">
                    <el-input type="textarea" v-model="cpt7Conf" :rows="7"></el-input>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-col :span="24" class="text-right">
                    <el-button style="margin-right: 10px" @click="refreshCpt7Conf">刷新</el-button>
                    <el-button style="margin-right: 10px" @click="getCpt7ConfDefault">加载默认配置</el-button>
                    <el-button @click="saveCpt7Conf">保存</el-button>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="INS数据处理配置" name="ins">
                <!-- INS配置内容 -->
                <el-row type="flex" align="middle">
                  <el-col :span="24">
                    <el-input type="textarea" v-model="insConf" :rows="6"></el-input>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-col :span="24" class="text-right">
                    <el-button style="margin-right: 10px" @click="refreshInsConf">刷新</el-button>
                    <el-button style="margin-right: 10px" @click="getInsConfDefault">加载默认配置</el-button>
                    <el-button @click="saveInsConf">保存</el-button>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts" name="srvConfig">
import { ref, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import {
  getSysTime,
  setSysTime,
  getEthMac,
  setEthMac,
  rebootDev,
  getEthConf,
  setEthConf,
  loadEthConfDefault,
  getINSConf,
  setINSConf,
  loadINSConfDefault,
  getCPT7Conf,
  setCPT7Conf,
  loadCPT7ConfDefault,
  // getTJTestMode,
  // setTJTestMode,
  restartGwSrv,
  getLogShowConf,
  updateLogShowConf
} from "@/api/modules/sysadmin";
// 导入共用方法
import { confirmAction } from "@/api/modules/utilfuns";
const activeTab = ref("cpt7");
const sysTime = ref();
const ethMac = ref();
const ethConf = ref();
const insConf = ref();
const cpt7Conf = ref();
// const tjTestMode = ref(false);
const logShowConf = ref({
  show_filter_pkg: false,
  show_pkg_info: false,
  show_loc_info: false,
  show_sec_info: false,
  reply_original_pkg: false,
  reply_not_loc_pkg: false,
  sync_sys_time_by_cpt7: true,
  sync_sys_time_by_ins: false,
  proc_ins_pkg: false,
  proc_ins_pkg2: false,
  promisc_mode: false,
  ins_cap_port: 30018,
  cpt7_cap_port: 7003,
  adata_time_interval: 5,
  aevt_time_interval: 10,
  filter_info: "udp",
  cap_device: "eth0",
  timeout_ms: 3
});

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
  ElMessage({
    message: "配置更新成功！",
    type: "info"
  });
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
  ElMessage({
    message: "配置更新成功！",
    type: "info"
  });
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
  ElMessage({
    message: "配置更新成功！",
    type: "info"
  });
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

// import { MessageBox } from 'element-ui';

const rebootDevCall = async () => {
  // 显示操作确认提示
  ElMessageBox.confirm("你确认要重启网关设备吗？", "操作确认", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "info"
  })
    .then(async () => {
      // 请求后端服务加载数据
      const { data } = await rebootDev();
      console.log(data);
      ElMessage({
        message: `设备重启完成，稍等30秒后重新访问。`,
        type: "info"
      });
    })
    .catch(() => {
      // 用户点击了取消按钮，不做任何事情
    });
};

const restartGw = async () => {
  // 显示操作确认提示
  confirmAction("你确认要重启网关服务吗？", restartGwSrv, "网关服务已重启。");
};

// const loadTJTestMode = async () => {
//   // 请求后端服务加载数据
//   const { data } = await getTJTestMode();
//   // console.log(JSON.stringify(data, null, 2));
//   tjTestMode.value = data.tjTestMode;
//   // console.log(data);
// };

// const saveTJTestMode = async () => {
//   // 请求后端服务加载数据
//   let param = { tjTestMode: tjTestMode.value };
//   const { data } = await setTJTestMode(param);
//   console.log(data);
//   ElMessage({
//     message: "配置更新成功！",
//     type: "info"
//   });
// };

const loadLogShowConf = async () => {
  // 请求后端服务加载数据
  const { data } = await getLogShowConf();
  console.log(JSON.stringify(data, null, 2));
  logShowConf.value = data;
  // console.log(data);
};

const saveLogShowConf = async () => {
  // 请求后端服务更新配置
  // let param = { logShowConf: logShowConf.value };
  let param = logShowConf.value;
  const { data } = await updateLogShowConf(param);
  console.log(data);
  ElMessage({
    message: "配置更新成功！",
    type: "info"
  });
};

const loadData = async () => {
  // 请求后端服务加载数据
  refreshTime();
  refreshEthMac();
  refreshEthConf();
  refreshInsConf();
  refreshCpt7Conf();
  // loadTJTestMode();
  loadLogShowConf();
};
// 页面加载完毕后调用这个方法
onMounted(() => loadData());
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
