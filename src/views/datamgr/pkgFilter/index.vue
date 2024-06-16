<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <el-space>
          <span>UDP包采集、转发、发送态势</span>
        </el-space>
        <el-space>
          <el-checkbox v-model="isAutoRefresh" @change="setAutoRefresh">
            <span>{{ isAutoRefresh ? "自动刷新中" : "自动刷新暂停" }}</span>
          </el-checkbox>
          <el-button :disabled="isAutoRefresh" @click="loadData">手动刷新</el-button>
          <el-button @click="queryData">查询</el-button>
          <span>截止到</span>
          <el-date-picker
            v-model="endTimeStr"
            type="datetime"
            placeholder="选择日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 14em"
          ></el-date-picker>
          <span>之前</span>
          <el-input-number
            v-model="rowCount"
            controls-position="right"
            :min="60"
            :max="600"
            :step="60"
            style="width: 5em"
          ></el-input-number>
          <span>行记录数</span>
          <el-button @click="minSubstract">&lt;&lt;</el-button>
          <el-input-number
            v-model="minOffset"
            controls-position="right"
            :min="1"
            :max="180"
            :step="5"
            style="width: 5em"
          ></el-input-number>
          <span>分钟</span>
          <el-button @click="minAdd">&gt;&gt;</el-button>
        </el-space>
      </div>
    </template>
    <el-row>
      <el-col>
        <div class="card content-box" style="width: 100%; height: 400px">
          <ECharts :option="option" style="width: 100%; height: 100%" />
        </div>
      </el-col>
    </el-row>
    <!-- <el-row>
      <el-col>
        <el-space>总采集数据包数:{{ totalPkg }},理论采集包数：{{ rowCount * 200 }}</el-space>
      </el-col>
    </el-row> -->
    <el-row>
      <el-col>
        <el-table :data="logData2Table" style="width: 100%" border max-height="300">
          <el-table-column
            v-for="(column, index) in tableColumnConfig"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :width="index === 0 ? '170' : ''"
            :header-cell-style="{ backgroundColor: '#f2f2f2' }"
          >
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>
<script setup lang="ts" name="pkgFilter">
import { ref, onMounted, onUnmounted } from "vue";
import dayjs from "dayjs";
import { ECOption } from "@/components/ECharts/config";
import ECharts from "@/components/ECharts/index.vue";
import { getUdpFilterTrend } from "@/api/modules/sysadmin";
import { getUdpFilterTrendByPost } from "@/api/modules/sysadmin";

const tableColumnConfig = [
  { prop: "LOG_TIME", label: "时间" },
  { prop: "UP_FT_TIMES", label: "采集次数" },
  { prop: "UP_INS_CT", label: "INS数据包" },
  { prop: "UP_INS_RP_CT", label: "已转发" },
  { prop: "INS_LOST_PKG", label: "转发堆积" },
  { prop: "UP_INS_LOC_CT", label: "需发送" },
  { prop: "UP_INS_SD_CT", label: "已发送" },
  { prop: "INS_LOST_LOC_PKG", label: "发送堆积" },
  { prop: "UP_CPT7_CT", label: "CPT7数据包" },
  { prop: "UP_CPT7_RP_CT", label: "已转发 " },
  { prop: "CPT7_LOST_PKG", label: "转发堆积 " },
  { prop: "UP_CPT7_LOC_CT", label: "需发送 " },
  { prop: "UP_CPT7_SD_CT", label: "已发送 " },
  { prop: "CPT7_LOST_LOC_PKG", label: "发送堆积 " }
];
const excludeColumns = ["INS_LOST_PKG", "INS_LOST_LOC_PKG", "CPT7_LOST_PKG", "CPT7_LOST_LOC_PKG"];
const cnColumnNames = tableColumnConfig
  .filter(item => !excludeColumns.includes(item.prop))
  .map(item => item.label)
  .slice(1);
// console.log(cnColumnNames);
// const tableColumnNames = tableColumnConfig.map(item => item.prop).slice(1);
// console.log(tableColumnNames);
const isAutoRefresh = ref(false);
const endTimeStr = ref("2024-06-16 13:50:25");
const rowCount = ref(60);
const minOffset = ref(10);
const totalPkg = ref(0);
// let totalPkg = 0;
const minSubstract = () => {
  // console.log(minOffset.value);
  let dateObj = dayjs(endTimeStr.value);
  dateObj = dateObj.subtract(minOffset.value, "minute");
  endTimeStr.value = dateObj.format("YYYY-MM-DD HH:mm:ss");
};
const minAdd = () => {
  //
  let dateObj = dayjs(endTimeStr.value);
  dateObj = dateObj.add(minOffset.value, "minute");
  endTimeStr.value = dateObj.format("YYYY-MM-DD HH:mm:ss");
};

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
    text: "UDP包处理数据",
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
    // data: cnColumnNames,
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
let logData: { [key: string]: any };

const fillData = () => {
  if (logData) {
    // 支撑折现图展示的列数据，从1开始
    let tableColumnNames = logData["columnNames"].slice(1);
    // console.log(tableColumnNames);
    // 更新option的数据
    let optionValue = option.value as any;
    if (optionValue.legend?.data) {
      optionValue.legend.data = cnColumnNames;
    }

    if (optionValue.xAxis?.[0]) {
      optionValue.xAxis[0].data = logData["LOG_TIME"];
    }
    let series = optionValue.series as any[];
    series.length = 0; // 清空数组
    // 更新折线图数据
    for (let columnName of tableColumnNames) {
      // 修改展示每秒接收包的趋势图：修改数据：从0~n-2,开始n=(n+1)-n
      let pces = []; // pkg cout each second
      // 填充pces首值，处理策略：按照列名分别放入理论值
      switch (columnName) {
        case "UP_FT_TIMES":
          pces.push(500); // 500
          break;
        case "UP_INS_CT":
          pces.push(210); // 210
          break;
        case "UP_INS_RP_CT":
          pces.push(410); // 210 + 200
          break;
        case "UP_INS_LOC_CT":
          pces.push(10); // 10
          break;
        case "UP_INS_SD_CT":
          pces.push(10); // 10
          break;
        case "UP_CPT7_CT":
          pces.push(100); // 100
          break;
        case "UP_CPT7_RP_CT":
          pces.push(100); // 100
          break;
        case "UP_CPT7_LOC_CT":
          pces.push(100); // 100
          break;
        case "UP_CPT7_SD_CT":
          pces.push(100); // 100
          break;
        default:
          break;
      }
      // 填充1-n列,丢弃掉原始数据的第一列
      let columnData = logData[columnName];
      if (columnData) {
        for (let i = 1; i < columnData.length; i++) {
          pces.push(columnData[i] - columnData[i - 1]);
        }
      }
      // 从tableColumnConfig中根据columnName提取label值，用于填充serie的name属性
      let cnColumnName = tableColumnConfig.find(item => item.prop === columnName)?.label;
      // console.log(cnColumnName);
      let serie = {
        // name: columnName,
        name: cnColumnName,
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
    // 在tbDatas中添加计算列
    tableColumnNames.splice(4, 0, "INS_LOST_PKG");
    tableColumnNames.splice(7, 0, "INS_LOST_LOC_PKG");
    tableColumnNames.splice(10, 0, "CPT7_LOST_PKG");
    tableColumnNames.splice(13, 0, "CPT7_LOST_LOC_PKG");
    console.log("logData.reply_not_loc_pkg=", logData.reply_not_loc_pkg);
    // 将数据转换为适合表格展示的数据
    logData2Table.value = [];
    let rowCount = logData["LOG_TIME"].length;
    for (let i = rowCount - 1; i >= 0; i--) {
      let row: { [key: string]: any } = {};
      row["LOG_TIME"] = logData["LOG_TIME"][i];
      for (let columnName of tableColumnNames) {
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
    // 遍历logData2Table.value，累加其中的UP_FT_TIMES列的值，得到totalPkg
    totalPkg.value = logData2Table.value.reduce((acc, cur) => acc + cur["UP_INS_CT"], 0);
  }
};

const loadData = async () => {
  // Get请求后端服务加载数据
  const { data } = await getUdpFilterTrend();
  // console.log(JSON.stringify(data, null, 2));
  logData = data;
  fillData();
};
const queryData = async () => {
  // ...
  console.log(endTimeStr.value, rowCount.value);
  // console.log(new Date(endTimeStr.value).toISOString(), Number(rowCount.value));
  let params = { endTimeStr: endTimeStr.value, rowCount: Number(rowCount.value) };
  const { data } = await getUdpFilterTrendByPost(params);
  logData = data;
  fillData();
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
