<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>偏转任务执行态势</span>
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
          <el-table-column prop="W2C_CT" label="待偏转"></el-table-column>
          <el-table-column prop="W2CED_CT" label="已偏转"></el-table-column>
          <el-table-column prop="TOTAL_DELAY_PKG" label="总堆积"></el-table-column>
          <el-table-column prop="W2C_INS_CT" label="INS待偏转"></el-table-column>
          <el-table-column prop="W2CED_INS_CT" label="INS已偏转"></el-table-column>
          <el-table-column prop="INS_DELAY_PKG" label="INS堆积"></el-table-column>
          <el-table-column prop="W2C_CPT7_CT" label="CPT7待偏转"></el-table-column>
          <el-table-column prop="W2CED_CPT7_CT" label="CPT7已偏转"></el-table-column>
          <el-table-column prop="CPT7_DELAY_PKG" label="CPT7堆积"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>
<script setup lang="ts" name="pkgFilter">
import { ref, onMounted, onUnmounted } from "vue";
import { ECOption } from "@/components/ECharts/config";
import ECharts from "@/components/ECharts/index.vue";
import { getW2CProcTrend } from "@/api/modules/sysadmin";
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
    text: "偏转任务处理",
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
  const { data } = await getW2CProcTrend();
  // console.log(JSON.stringify(data, null, 2));
  logData = data;
  if (logData) {
    // 更新option的数据
    let columnNames = logData["columnNames"].slice(1);
    let optionValue = option.value as any;
    if (optionValue.legend?.data) {
      optionValue.legend.data = columnNames;
    }
    if (optionValue.xAxis?.[0]) {
      optionValue.xAxis[0].data = logData["LOG_TIME"];
    }
    let series = optionValue.series as any[];
    series.length = 0; // 清空数组
    // 更新折线图数据
    for (let columnName of columnNames) {
      // 修改展示每秒接收包的趋势图：修改数据：从0~n-2,开始n=(n+1)-n
      let pces = []; // pkg cout each second
      // 填充pces首值，处理策略：按照列名分别放入理论值
      switch (columnName) {
        case "W2C_CT":
          pces.push(110); // 110
          break;
        case "W2CED_CT":
          pces.push(110); // 110
          break;
        case "W2C_INS_CT":
          pces.push(10); // 10
          break;
        case "W2CED_INS_CT":
          pces.push(10); // 10
          break;
        case "W2C_CPT7_CT":
          pces.push(100); // 100
          break;
        case "W2CED_CPT7_CT":
          pces.push(100); // 100
          break;
        default:
          break;
      }
      // 填充1-n列,丢弃掉原始数据的第一列
      let columnData = logData[columnName];
      for (let i = 1; i < columnData.length; i++) {
        pces.push(columnData[i] - columnData[i - 1]);
      }

      let serie = {
        name: columnName,
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: {
          focus: "series"
        },
        data: pces
      };
      series.push(serie);
    }
    // let tbDatas = logData["columnNames"].slice(1);
    // 在tbDatas中添加两列
    columnNames.splice(3, 0, "TOTAL_DELAY_PKG");
    columnNames.splice(6, 0, "INS_DELAY_PKG");
    columnNames.splice(9, 0, "CPT7_DELAY_PKG");
    // 将数据转换为适合表格展示的数据
    logData2Table.value = [];
    let rowCount = logData["LOG_TIME"].length;
    for (let i = rowCount - 1; i >= 0; i--) {
      let row: { [key: string]: any } = {};
      row["LOG_TIME"] = logData["LOG_TIME"][i];
      // for (let columnName of columnNames) {
      //   if (columnName === "TOTAL_DELAY_PKG") {
      //     row[columnName] = row["W2C_CT"] - row["W2CED_CT"];
      //   } else if (columnName === "INS_DELAY_PKG") {
      //     row[columnName] = row["W2C_INS_CT"] - row["W2CED_INS_CT"];
      //   } else if (columnName === "CPT7_DELAY_PKG") {
      //     row[columnName] = row["W2C_CPT7_CT"] - row["W2CED_CPT7_CT"];
      //   } else {
      //     row[columnName] = logData[columnName][i];
      //   }
      // }
      for (let columnName of columnNames) {
        switch (columnName) {
          case "TOTAL_DELAY_PKG":
            row[columnName] = row["W2C_CT"] - row["W2CED_CT"];
            break;
          case "INS_DELAY_PKG":
            row[columnName] = row["W2C_INS_CT"] - row["W2CED_INS_CT"];
            break;
          case "CPT7_DELAY_PKG":
            row[columnName] = row["W2C_CPT7_CT"] - row["W2CED_CPT7_CT"];
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
