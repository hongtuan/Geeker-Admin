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
        <div class="card content-box" style="width: 100%; height: 360px">
          <ECharts :option="option" style="width: 100%; height: 100%" />
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="statData2Table" style="width: 100%" border max-height="300">
          <el-table-column
            v-for="(column, index) in statTbColConf"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :width="index === 0 ? '100' : ''"
            :header-cell-style="{ backgroundColor: '#blue' }"
            align="right"
          >
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="logData2Table" style="width: 100%" border max-height="300">
          <el-table-column type="index" label="行号" width="80"></el-table-column>
          <el-table-column
            v-for="(column, index) in tableColumnConfig"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :width="index === 0 ? '170' : ''"
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

const isAutoRefresh = ref(false);
// const endTimeStr = ref("2024-06-18 17:45:09");
// 使用系统当前时间作为默认值
let crtSysTimeStr = dayjs().format("YYYY-MM-DD HH:mm:ss");
const endTimeStr = ref(crtSysTimeStr);
const rowCount = ref<number>(60);
const minOffset = ref<number>(10);

const statTbColConf = [
  { prop: "STAT_ROWS", label: "统计行数" },
  { prop: "DATA_TYPE", label: "数据包类型" },
  { prop: "INS_EXPT_CT", label: "预期接收总包数" },
  { prop: "INS_RCV_CT", label: "实际收到总包数" },
  { prop: "INS_LOST_RT", label: "接收丢包率" },
  { prop: "INS_LOC_EXPT_CT", label: "预期接收、处理坐标数据包数" },
  { prop: "INS_LOC_RCV_CT", label: "实际收到、处理坐标数据包数" },
  { prop: "INS_LOC_LOST_RT", label: "坐标数据接收、处理丢包率" }
];
// 统计表数据
let statData2Table = ref<{ [key: string]: any }[]>([]);

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

const logData2Table = ref<{ [key: string]: any }[]>([]);
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

    console.log("rowCount.value:", rowCount.value);
    if (logData2Table.value.length > 0) {
      statData2Table.value = [];
      const firstRow = logData2Table.value[0];
      const lastRow = logData2Table.value[logData2Table.value.length - 1];
      // 统计INS基础数据包
      let insStatDataRow: { [key: string]: any } = {};
      insStatDataRow["DATA_TYPE"] = "INS全量数据";
      insStatDataRow["STAT_ROWS"] = rowCount;
      if (logData.reply_not_loc_pkg) {
        insStatDataRow["INS_EXPT_CT"] = 210 * Number(rowCount);
      } else {
        insStatDataRow["INS_EXPT_CT"] = 10 * Number(rowCount);
      }
      insStatDataRow["INS_RCV_CT"] = firstRow["UP_INS_CT"] - lastRow["UP_INS_CT"];
      // 统计实际接收到的INS数据包数，在有数据进入的情况下，需要增加210，消除区间首尾相减算法的影响
      if (insStatDataRow["INS_RCV_CT"] > 0) {
        if (logData.replay_not_loc_pkg) {
          insStatDataRow["INS_RCV_CT"] += 210;
        } else {
          insStatDataRow["INS_RCV_CT"] += 10;
        }
      }
      // 计算采集丢包率
      insStatDataRow["INS_LOST_RT"] = ((1 - insStatDataRow["INS_RCV_CT"] / insStatDataRow["INS_EXPT_CT"]) * 100).toFixed(4) + "%";

      // 填充位置报文数据
      insStatDataRow["INS_LOC_EXPT_CT"] = 10 * Number(rowCount);
      insStatDataRow["INS_LOC_RCV_CT"] = firstRow["UP_INS_LOC_CT"] - lastRow["UP_INS_LOC_CT"];
      // 统计实际接收到的INS坐标数据包数，在有数据进入的情况下，需要增加10，消除区间首尾相减算法的影响
      if (insStatDataRow["INS_LOC_RCV_CT"] > 0) {
        insStatDataRow["INS_LOC_RCV_CT"] += 10;
      }
      // 计算位置报文转发丢包率
      insStatDataRow["INS_LOC_LOST_RT"] =
        ((1 - insStatDataRow["INS_LOC_RCV_CT"] / insStatDataRow["INS_LOC_EXPT_CT"]) * 100).toFixed(4) + "%";
      statData2Table.value.push(insStatDataRow);

      // 统计CPT7全量数据包
      let cpt7StatDataRow: { [key: string]: any } = {};
      cpt7StatDataRow["DATA_TYPE"] = "CPT7全量数据";
      cpt7StatDataRow["STAT_ROWS"] = rowCount;
      cpt7StatDataRow["INS_EXPT_CT"] = 100 * Number(rowCount);
      cpt7StatDataRow["INS_RCV_CT"] = firstRow["UP_CPT7_CT"] - lastRow["UP_CPT7_CT"];
      // 统计实际接收到的CPT7数据包数，在有数据进入的情况下，需要增加100，消除区间首位相减算法的影响
      if (cpt7StatDataRow["INS_RCV_CT"] > 0) {
        cpt7StatDataRow["INS_RCV_CT"] += 100;
      }
      cpt7StatDataRow["INS_LOST_RT"] =
        ((1 - cpt7StatDataRow["INS_RCV_CT"] / cpt7StatDataRow["INS_EXPT_CT"]) * 100).toFixed(4) + "%";
      cpt7StatDataRow["INS_LOC_EXPT_CT"] = 100 * Number(rowCount);
      cpt7StatDataRow["INS_LOC_RCV_CT"] = firstRow["UP_CPT7_LOC_CT"] - lastRow["UP_CPT7_LOC_CT"];
      // 统计实际接收到的CPT7坐标数据包数，在有数据进入的情况下，需要增加100，消除区间首位相减算法的影响
      if (cpt7StatDataRow["INS_LOC_RCV_CT"] > 0) {
        cpt7StatDataRow["INS_LOC_RCV_CT"] += 100;
      }
      cpt7StatDataRow["INS_LOC_LOST_RT"] =
        ((1 - cpt7StatDataRow["INS_LOC_RCV_CT"] / cpt7StatDataRow["INS_LOC_EXPT_CT"]) * 100).toFixed(4) + "%";
      statData2Table.value.push(cpt7StatDataRow);
    }
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
  // 通过后台数据更新截止时间串
  let LatestLogTime = logData["LatestLogTime"];
  // console.log(LatestLogTime);
  let dateObj = dayjs(LatestLogTime);
  endTimeStr.value = dateObj.format("YYYY-MM-DD HH:mm:ss");
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
