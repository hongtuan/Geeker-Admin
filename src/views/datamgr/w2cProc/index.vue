<template>
  <!-- <div>
    <el-button @click="loadData"> 刷新 </el-button>
  </div> -->
  <div class="card content-box">
    <ECharts :option="option" />
  </div>
</template>
<script setup lang="ts" name="w2cProc">
import { ref, onMounted, onUnmounted } from "vue";
import { ECOption } from "@/components/ECharts/config";
import ECharts from "@/components/ECharts/index.vue";
import { getW2CProcTrend } from "@/api/modules/sysadmin";

const option = ref<ECOption>({
  title: {
    text: "偏转任务处理势图",
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
    // data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
    // data: ["UDP过滤总包数", "INS过滤包数", "CPT7过滤包数"],
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
      // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
  // W2C_COUNT,W2CED_COUNT,W2C_INS_COUNT,W2CED_INS_COUNT,W2C_CPT7_COUNT,W2CED_CPT7_COUNT
  series: [
    {
      name: "W2C_COUNT",
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      // data: [120, 132, 101, 134, 90, 230, 210]
      data: []
    },
    {
      name: "W2CED_COUNT",
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      // data: [220, 182, 191, 234, 290, 330, 310]
      data: []
    },
    {
      name: "W2C_INS_COUNT",
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      // data: [150, 232, 201, 154, 190, 330, 410]
      data: []
    },
    {
      name: "W2CED_INS_COUNT",
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      // data: [150, 232, 201, 154, 190, 330, 410]
      data: []
    },
    {
      name: "W2C_CPT7_COUNT",
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      // data: [150, 232, 201, 154, 190, 330, 410]
      data: []
    },
    {
      name: "W2CED_CPT7_COUNT",
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      // data: [150, 232, 201, 154, 190, 330, 410]
      data: []
    }
  ]
});
// W2C_COUNT,W2CED_COUNT,W2C_INS_COUNT,W2CED_INS_COUNT,W2C_CPT7_COUNT,W2CED_CPT7_COUNT
type LogData = {
  columnNames: string[];
  LOG_TIME: string[];
  W2C_COUNT: number[];
  W2CED_COUNT: number[];
  W2C_INS_COUNT: number[];
  W2CED_INS_COUNT: number[];
  W2C_CPT7_COUNT: number[];
  W2CED_CPT7_COUNT: number[];
};

let intervalId: number | undefined;
const logData = ref<LogData | null>(null);
// const logData = ref({});
const loadData = async () => {
  // 请求后端服务加载数据
  const { data } = await getW2CProcTrend();
  // console.log(JSON.stringify(data, null, 2));
  logData.value = data;
  if (logData.value) {
    // 更新option的数据
    if ((option.value.legend as any).data) {
      (option.value.legend as any).data = logData.value["columnNames"].slice(1);
    }
    if ((option.value.xAxis as any[])[0]) {
      (option.value.xAxis as any[])[0].data = logData.value["LOG_TIME"];
    }
    for (let i = 0; i < 6; i++) {
      // W2C_COUNT,W2CED_COUNT,W2C_INS_COUNT,W2CED_INS_COUNT,W2C_CPT7_COUNT,W2CED_CPT7_COUNT
      if ((option.value.series as any[])[i]) {
        switch (i) {
          case 0:
            (option.value.series as any[])[i].data = logData.value["W2C_COUNT"];
            break;
          case 1:
            (option.value.series as any[])[i].data = logData.value["W2CED_COUNT"];
            break;
          case 2:
            (option.value.series as any[])[i].data = logData.value["W2C_INS_COUNT"];
            break;
          case 3:
            (option.value.series as any[])[i].data = logData.value["W2CED_INS_COUNT"];
            break;
          case 4:
            (option.value.series as any[])[i].data = logData.value["W2C_CPT7_COUNT"];
            break;
          case 5:
            (option.value.series as any[])[i].data = logData.value["W2CED_CPT7_COUNT"];
            break;
        }
      }
    }
    console.log("data refreshed.");
  } else {
    console.log("logData.value is not defined");
  }
};
// 页面加载完毕后调用这个方法
// onMounted(() => loadData());

onMounted(() => {
  // 页面加载完毕后调用这个方法
  loadData();
  // 设置定时器，每隔6秒自动刷新数据
  intervalId = setInterval(loadData, 10000) as unknown as number;
});

onUnmounted(() => {
  // 当组件卸载时，清除定时器
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
