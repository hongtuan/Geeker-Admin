<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>UDP包过滤转发态势</span>
        <div>
          <el-space>
            <el-checkbox v-model="isAutoRefresh" @change="setAutoRefresh">
              <span>{{ isAutoRefresh ? "自动刷新中" : "自动刷新暂停" }}</span>
            </el-checkbox>
            <el-button :disabled="isAutoRefresh" @click="loadData">手动刷新</el-button>
          </el-space>
        </div>
      </div>
    </template>
    <el-row>
      <el-col>
        <div class="card content-box" style="width: 100%; height: 400px">
          <ECharts :option="option" style="width: 100%; height: 100%" />
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="logData2Table" style="width: 100%" border max-height="300">
          <el-table-column prop="LOG_TIME" label="时间" width="180"></el-table-column>
          <el-table-column prop="UP_FT_TIMES" label="采集次数"></el-table-column>
          <el-table-column prop="UP_INS_CT" label="INS需转发"></el-table-column>
          <el-table-column prop="UP_INS_RP_CT" label="已转发"></el-table-column>
          <el-table-column prop="INS_LOST_PKG" label="转发堆积"></el-table-column>
          <el-table-column prop="UP_INS_LOC_CT" label="需偏转发送"></el-table-column>
          <el-table-column prop="UP_INS_SD_CT" label="已偏转发送"></el-table-column>
          <el-table-column prop="INS_LOST_LOC_PKG" label="偏转堆积"></el-table-column>
          <el-table-column prop="UP_CPT7_CT" label="CPT7需转发"></el-table-column>
          <el-table-column prop="UP_CPT7_RP_CT" label="已转发"></el-table-column>
          <el-table-column prop="CPT7_LOST_PKG" label="转发堆积"></el-table-column>
          <el-table-column prop="UP_CPT7_LOC_CT" label="需偏转发送"></el-table-column>
          <el-table-column prop="UP_CPT7_SD_CT" label="已偏转发送"></el-table-column>
          <el-table-column prop="CPT7_LOST_LOC_PKG" label="偏转堆积"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>
<script setup lang="ts" name="pkgFilter">
import { ref, onMounted, onUnmounted } from "vue";
import { ECOption } from "@/components/ECharts/config";
import ECharts from "@/components/ECharts/index.vue";
import { getUdpFilterTrend } from "@/api/modules/sysadmin";
const isAutoRefresh = ref(false);
const setAutoRefresh = () => {
  if (isAutoRefresh.value) {
    // 设置每隔10秒刷新一次。
    intervalId = setInterval(loadData, 10000) as unknown as number;
  } else {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined; // 清除intervalId的引用
    }
  }
};

const option = ref<ECOption>({
  title: {
    text: "UDP包过滤趋势图",
    textStyle: {
      color: "#a1a1a1"
    }
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985"
      }
    }
  },
  legend: {
    // 数据线条名称，从后端获取
    data: [],
    textStyle: {
      color: "#a1a1a1"
    }
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      // 横坐标时间数据
      data: [],
      axisLabel: {
        color: "#a1a1a1"
      }
    }
  ],
  yAxis: [
    {
      type: "value",
      axisLabel: {
        color: "#a1a1a1"
      }
    }
  ],
  series: []
});

let logData2Table = ref<{ [key: string]: any }[]>([]);
// 自动刷新的计时器
let intervalId: number | undefined;
// const logData = ref<LogData | null>(null);
let logData: { [key: string]: any };
// const logData = ref({});
const loadData = async () => {
  // 请求后端服务加载数据
  const { data } = await getUdpFilterTrend();
  // console.log(JSON.stringify(data, null, 2));
  logData = data;
  if (logData) {
    // 更新option的数据
    let optionValue = option.value as any;
    if (optionValue.legend?.data) {
      optionValue.legend.data = logData["columnNames"].slice(1);
    }
    if (optionValue.xAxis?.[0]) {
      optionValue.xAxis[0].data = logData["LOG_TIME"];
    }
    let series = optionValue.series as any[];
    series.length = 0; // 清空数组
    let columnNames = logData["columnNames"].slice(1);
    for (let columnName of columnNames) {
      let serie = {
        name: columnName,
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: {
          focus: "series"
        },
        data: logData[columnName]
      };
      series.push(serie);
    }
    // let columnNames = logData["columnNames"].slice(1);
    // 在tbDatas中添加两列
    columnNames.splice(4, 0, "INS_LOST_PKG");
    columnNames.splice(7, 0, "INS_LOST_LOC_PKG");
    columnNames.splice(10, 0, "CPT7_LOST_PKG");
    columnNames.splice(13, 0, "CPT7_LOST_LOC_PKG");
    console.log("logData.reply_not_loc_pkg=", logData.reply_not_loc_pkg);
    // 将数据转换为适合表格展示的数据
    logData2Table.value = [];
    let rowCount = logData["LOG_TIME"].length;
    // for (let i = 0; i < logData["LOG_TIME"].length; i++) {
    for (let i = rowCount - 1; i >= 0; i--) {
      let row: { [key: string]: any } = {};
      row["LOG_TIME"] = logData["LOG_TIME"][i];
      for (let columnName of columnNames) {
        switch (columnName) {
          case "INS_LOST_PKG":
            if (logData.reply_not_loc_pkg) {
              row[columnName] = 2 * row["UP_INS_CT"] - row["UP_INS_LOC_CT"] - row["UP_INS_RP_CT"];
            } else {
              row[columnName] = row["UP_INS_CT"] - row["UP_INS_RP_CT"];
            }
            break;
          case "INS_LOST_LOC_PKG":
            row[columnName] = row["UP_INS_LOC_CT"] - row["UP_INS_SD_CT"];
            break;
          case "CPT7_LOST_PKG":
            row[columnName] = row["UP_CPT7_CT"] - row["UP_CPT7_RP_CT"];
            break;
          case "CPT7_LOST_LOC_PKG":
            row[columnName] = row["UP_CPT7_LOC_CT"] - row["UP_CPT7_SD_CT"];
            break;
          default:
            row[columnName] = logData[columnName][i];
            break;
        }
      }
      // 填充行数据
      logData2Table.value.push(row);
    }
  }
};
// 页面加载完毕后调用这个方法
onMounted(() => {
  // 页面加载完毕后调用这个方法
  loadData();
  // 设置定时器，每隔6秒自动刷新数据
  // 只有在isAutoRefresh.value为true时，才设置定时器
  if (isAutoRefresh.value) {
    intervalId = setInterval(loadData, 10000) as unknown as number;
  }
});

onUnmounted(() => {
  // 当组件卸载时，清除定时器
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = undefined;
  }
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
