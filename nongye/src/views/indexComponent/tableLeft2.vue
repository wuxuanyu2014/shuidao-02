<template>
  <div id="centerRight1">
    <div class="bg-color-black">
      <Xtitle name="检测共享实验室" />

      <div id="jczy_bar" style="height:365px;width:100%px;margin-top:20px"></div>
      <!-- <Echart :options="options" id="jczy_bar" height="300px" width="100%"></Echart> -->
      <div @click="openImg" class="Headline s-flex-center">
        <el-image class="inspectionProcess" style="width: 100%; height: 55px" :src="url" :preview-src-list="srcList">
        </el-image>
        <div class="s-flex-center">
          <img style="padding-left: 37px;;margin-right:19px" src="../../assets/image/index/title10.png" alt />
          <span style="margin-right:0px" class="Subtitle-title">检测流程</span>
        </div>
      </div>
      <div class="Subtitle s-flex-start">
        <span class="Subtitle-title">一级供应商分色管理</span>
      </div>
      <div class="water-box s-flex-center">
        <div @click="clickBoard1('3', 'water1', 'A级供应商', levelA.total)" class="water-son s-fles-end">
          <div class="water-level">
            <dv-water-level-pond :config="config1" style="width:100px;height:100px" />
          </div>
          <div class="water-detail">
            <div class="name">A级供应商</div>
            <div class="number">
              <span class="detail">{{ levelA.total }}</span>
              家
            </div>
          </div>
        </div>
        <div @click="clickBoard1('2', 'water2', 'B级供应商', levelB.total)" class="water-son water-son1 s-fles-end">
          <div class="water-level">
            <dv-water-level-pond :config="config2" style="width:100px;height:100px" />
          </div>
          <div class="water-detail water-detail1">
            <div class="name">B级供应商</div>
            <div class="number">
              <span class="detail">{{ levelB.total }}</span>
              家
            </div>
          </div>
        </div>
        <div @click="clickBoard1('1', 'water3', 'C级供应商', levelC.total)" class="water-son water-son2 s-fles-end">
          <div class="water-level">
            <dv-water-level-pond :config="config3" style="width:100px;height:100px" />
          </div>
          <div class="water-detail water-detail2">
            <div class="name">C级供应商</div>
            <div class="number">
              <span class="detail">{{ levelC.total }}</span>
              家
            </div>
          </div>
        </div>
      </div>
      <div class="Subtitle Subtitle1 s-flex-start">
        <span class="Subtitle-title">信用信息管理</span>
      </div>
      <div class="information-management s-flex-between">
        <div @click="clickBoard('evaluate')" class="information-box s-flex-center">
          <div class="information-number s-flex-center">
            {{ evaluateDate.total > 99 ? "99+" : evaluateDate.total }}
          </div>
          <img style="margin-right:11px;width:25px;height:22px" src="../../assets/image/index/information.png" alt />
          以评促改
        </div>
        <div @click="clickBoard('Histogram')" class="information-box information-box1 s-flex-center">
          <div class="information-number information-number1 s-flex-center">
            {{ systemMsgDate.total > 99 ? "99+" : systemMsgDate.total }}
          </div>
          <img style="margin-right:11px;width:31px;height:27px" src="../../assets/image/index/horn.png" alt />
          信息推送
        </div>
      </div>
    </div>

    <data-dialog v-model="dialogData.visible" :width="1320" :height="590" @close="dialogClose">
      <component :type="dialogData.type" slot="dataSlot" :id="dialogData.componentName" :is="dialogData.componentName">
      </component>
    </data-dialog>
    <data-dialog v-model="dialogData1.visible" :width="1320" :height="590" @close="dialogClose1">
      <component :name="dialogData1.name" :select="dialogData1.select" :type="dialogData1.type" slot="dataSlot"
        :id="dialogData1.type" :index="dialogData1.index" :is="dialogData1.componentName">
      </component>

    </data-dialog>
    <slot name="content"></slot>
  </div>
</template>

<script>
import Xtitle from "../../components/Xtitle";
const data = ["未检批次数量", "已检批次数量", "合格批次数量", "不合格批次数量"];

import { setIntervalPublic } from "../../utils/index";

import {
  getReport,
  getSupplyShop,
  getSystemMsg,
  getEvaluate,
} from "@/api/cockpit";
import Histogram from './components/Histogram'
import evaluate from './components/evaluate'
import bar from './components/bar'
import water from './components/water'

export default {
  components: {
    Xtitle,
    Histogram,
    evaluate,
    bar,
    water
  },
  data() {
    return {
      dialogData: {
        visible: false,
        type: ''
      },
      dialogData1: {
        visible: false,
        type: '',
        componentName: '',
        index: '',
        select: '0家'
      },
      venues: [
        { component: 'Histogram', visible: false, width: '1230', height: '590', name: '冷库管理', icon: require('../../assets/image/index/temperature.png'), style: { width: '15px', height: '27px', } },
        { component: 'evaluate', visible: false, width: '1230', height: '590', name: '冷库管理', icon: require('../../assets/image/index/temperature.png'), style: { width: '15px', height: '27px', } },
        { component: 'bar', visible: false, width: '1230', height: '590', name: '冷库管理', icon: require('../../assets/image/index/temperature.png'), style: { width: '15px', height: '27px', } },
      ],
      dialogTableVisible: true,
      url: require("../../assets/image/index/Inspection Process.png"),
      srcList: [require("../../assets/image/index/Inspection Process.png")],
      statisticsplatformData: [data, []],
      config1: {
        data: [50],
        shape: "round",
        waveHeight: 8,
        colors: ["#0CF46E", "#31E7A5"],
        waveOpacity: 1
      },
      config2: {
        data: [50],
        shape: "round",
        waveHeight: 8,
        colors: ["#EA776E", "#FFD290"],
        waveOpacity: 1
      },
      config3: {
        data: [50],
        shape: "round",
        waveHeight: 8,
        colors: ["#FA4D61", "#EC515C"],
        waveOpacity: 1
      },
      serveTBar: null,
      levelA: 0,
      levelB: 0,
      levelC: 0,
      evaluateDate: 0, //
      systemMsgDate: 0,
      timer: null
    };
  },
  created() { },
  async mounted() {
    //供应商分色管理
    this.getSupplyShop();
    //消息推送
    this.getSystemMsg();
    //信用评价
    this.getEvaluate();
    await this.getReport();
    this.init();
  },
  updated() {
    this.resizeChart();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    clickBoard(componentName) {
      this.dialogData.componentName = componentName
      this.dialogData.visible = true
      console.log('type:', componentName)
    },
    dialogClose(closeCalc = false) {
      console.log('我点了')
      this.$emit('dialogClose', closeCalc);
    },
    clickBoard1(index, componentName, name, select) {
      this.dialogData1.componentName = 'water'
      this.dialogData1.type = index
      this.dialogData1.name = name
      this.dialogData1.select = select
      this.dialogData1.index = index
      this.dialogData1.visible = true
      // this.getWaterTable(index)
      console.log(this.dialogData1, componentName, 'componentName')
    },
    dialogClose1(closeCalc = false) {
      console.log('我点了')
      this.$emit('dialogClose', closeCalc);
    },

    openImg() { },
    //信用评价
    async getEvaluate() {
      let { data } = await getEvaluate();
      this.evaluateDate = data;
    },
    //消息推送
    async getSystemMsg() {
      let { data } = await getSystemMsg();
      this.systemMsgDate = data;
    },
    //供应商分色管理
    async getSupplyShop() {
      let { data } = await getSupplyShop();
      let { levelA, levelB, levelC } = data;
      this.levelA = levelA;
      this.levelB = levelB;
      this.levelC = levelC;
    },
    getEcharts3DBar() {
      var barWidth = 30;
      var option = {
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            var str = params[0].name + "：";
            params.filter(function (item) {
              if (item.componentSubType == "bar") {
                str += item.value == "" ? 0 : item.value;
              }
            });
            return str;
          }
        },
        grid: {
          x: "5%",
          x2: "0%",
          y: "10%",
          y2: "20%"
        },
        legend: {
          show: false,
          data: ["本期"],
          textStyle: {
            color: "#fff",
            fontSize: "20"
          }
        },
        xAxis: {
          data: [
            "未检批次数量",
            "已检批次数量",
            "合格批次数量",
            "不合格批次数量"
          ],
          //坐标轴
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "#214776"
            },
            textStyle: {
              color: "#fff",
              fontSize: "20"
            }
          },
          offset: 18,
          type: "category",
          axisLabel: {
            textStyle: {
              color: "#fff",
              fontWeight: 500,
              fontSize: "20"
            }
          },
          axisTick: {
            textStyle: {
              color: "#fff",
              fontSize: "20"
            },
            show: false
          },
          splitLine: { show: false }
        },
        yAxis: {
          type: "value",
          //坐标轴
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "#5C71A8"
            },
            textStyle: {
              color: "#fff",
              fontSize: "16"
            }
          },
          axisTick: {
            show: false
          },
          //坐标值标注
          axisLabel: {
            show: true,
            textStyle: {
              color: "#C5DFFB",
              fontSize: "16"
            }
          },
          //分格线
          splitLine: {
            lineStyle: {
              color: "#13365f"
            }
          }
        },
        series: [
          {
            z: 1,
            // name: "本期",
            type: "bar",
            animationDuration: 2000,	// 动画时长 默认值 1000
            animationEasing: 'linear',     //动画初始化缓动效果 默认值 linear



            barWidth: barWidth,
            barGap: "0%",
            data: this.statisticsplatformData[1],
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = [
                    ["#E7A85C", "#DD6E5C"],
                    ["#30CEFA", "#4D8BFA"],
                    ["#3AF2AA", "#10ED72"],
                    ["#FC6B75", "#EC3A42"]
                  ];
                  var colorItem = colorList[params.dataIndex];
                  return {
                    type: "linear",
                    x: 0,
                    x2: 1,
                    y: 0,
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0,
                        color: colorItem[0]
                      },
                      {
                        offset: 1,
                        color: colorItem[0]
                      },
                      {
                        offset: 0,
                        color: colorItem[1]
                      },
                      {
                        offset: 1,
                        color: colorItem[1]
                      }
                    ]
                  };
                },
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "#FFFFFF",
                    fontSize: 20,
                    fontFamily: "微软雅黑"
                  },
                  offset: [0, -2]
                }
              }
            }
          },
          {
            z: 2,
            // name: "本期",
            type: "pictorialBar",
            animationDuration: 2000,	// 动画时长 默认值 1000
            // 动画缓动具体参考 https://echarts.apache.org/examples/zh/editor.html?c=line-easing
            animationEasing: 'linear',     //动画初始化缓动效果 默认值 linear



            data: this.statisticsplatformData[1],
            symbol: "diamond",
            symbolOffset: ["0%", "50%"],
            symbolSize: [barWidth, 10],
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = [
                    ["#E7A85C", "#DD6E5C"],
                    ["#30CEFA", "#4D8BFA"],
                    ["#3AF2AA", "#10ED72"],
                    ["#FC6B75", "#EC3A42"]
                  ];
                  var colorItem = colorList[params.dataIndex];
                  return {
                    type: "linear",
                    x: 0,
                    x2: 1,
                    y: 0,
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0,
                        color: colorItem[0]
                      },
                      {
                        offset: 1,
                        color: colorItem[0]
                      },
                      {
                        offset: 0,
                        color: colorItem[1]
                      },
                      {
                        offset: 1,
                        color: colorItem[1]
                      }
                    ]
                  };
                }
              }
            },
            tooltip: {
              show: false
            }
          },
          {
            z: 3,
            //name: "本期",
            type: "pictorialBar",
            animationDuration: 2000,	// 动画时长 默认值 1000
            // 动画缓动具体参考 https://echarts.apache.org/examples/zh/editor.html?c=line-easing
            animationEasing: 'linear',     //动画初始化缓动效果 默认值 linear




            symbolPosition: "end",
            data: this.statisticsplatformData[1],
            symbol: "diamond",
            symbolOffset: ["0", "-50%"],
            symbolSize: [barWidth - 4, (10 * (barWidth - 4)) / barWidth],
            itemStyle: {
              normal: {
                borderWidth: 2,
                color: function (params) {
                  var colorList = [
                    ["#E7A85C", "#DD6E5C"],
                    ["#30CEFA", "#4D8BFA"],
                    ["#3AF2AA", "#10ED72"],
                    ["#FC6B75", "#EC3A42"]
                  ];
                  var colorItem = colorList[params.dataIndex];
                  return {
                    type: "linear",
                    x: 0,
                    x2: 1,
                    y: 0,
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0,
                        color: colorItem[0]
                      },
                      {
                        offset: 1,
                        color: colorItem[0]
                      },
                      {
                        offset: 0,
                        color: colorItem[1]
                      },
                      {
                        offset: 1,
                        color: colorItem[1]
                      }
                    ]
                  };
                }
              }
            },
            tooltip: {
              show: false
            }
          }
        ]
      };
      return option;
    },
    async getReport() {
      let { data } = await getReport();
      let { checkData, qualified, unCheckData, unQualified } = data;
      let list = [];
      list[0] = unCheckData.count == 0 ? "" : unCheckData.count;
      list[1] = checkData.count == 0 ? "" : checkData.count;
      list[2] = qualified.count == 0 ? "" : qualified.count;
      list[3] = unQualified.count == 0 ? "" : unQualified.count;
      this.statisticsplatformData[1] = list;
    },
    async init() {
      this.serveTBar = this.$echarts.init(document.getElementById("jczy_bar"));
      this.serveTBar.setOption(this.getEcharts3DBar());
      this.windowResize();
      this.getSupplyShop();
      //消息推送
      this.getSystemMsg();
      //信用评价
      this.getEvaluate();
      await this.getReport();
      this.serveTBar.setOption(this.getEcharts3DBar());

      this.serveTBar.getZr().off("click");
      this.serveTBar.getZr().on("click", (params) => {
        console.log('我点击了')
        const pointerInPixel = [params.offsetX, params.offsetY]

        console.log('params:', params, this.serveTBar.containPixel('grid', pointerInPixel))
          && params.target
        console.log('index:', this.serveTBar.containPixel('grid', pointerInPixel))
        if (this.serveTBar.containPixel('grid', pointerInPixel)) {
          let index = this.serveTBar.convertFromPixel({ seriesIndex: 0 }, pointerInPixel)[0]
          console.log('index:', index)
          if (index > 2) {
            this.dialogData.componentName = 'bar'
            this.dialogData.type = 'unQualified'
            this.dialogData.visible = true
          }
        }
      });
      this.timer = setIntervalPublic(async () => {
        this.statisticsplatformData = [data, ['', '', '', '']],
          this.serveTBar.setOption(this.getEcharts3DBar());
        //供应商分色管理
        this.getSupplyShop();
        //消息推送
        this.getSystemMsg();
        //信用评价
        this.getEvaluate();
        await this.getReport();
        setTimeout(() => {
          this.serveTBar.setOption(this.getEcharts3DBar());
        }, 500);

      }, 5000);
    },
    //重绘
    resizeChart() {
      if (this.serveTBar && this.serveTBar.resize) this.serveTBar.resize();
    },
    windowResize() {
      window.addEventListener("resize", this.resizeChart);
      this.$once("hook:beforeDestroy", () => {
        window.removeEventListener("resize", this.resizeChart);
      });
      this.$once("hook:deactivated", () => {
        window.removeEventListener("resize", this.resizeChart);
      });
    }
  }
};
</script>
<style lang="scss">
.data-dialog {
  .el-dialog__body {
    padding: 0 !important;
  }

  .el-dialog__header {
    display: none !important;
  }
}
</style>
<style lang="scss" scoped>
$box-height: 810px;
$box-width: 960px;

#centerRight1 {
  width: 100% !important;
  height: 100% !important;

  .water-box {
    width: 100%;
    height: 100px;

    .water-son {
      width: 33%;
      height: 100%;
      position: relative;
      background: url("../../assets/image/index/title6.png") no-repeat left;
      background-size: 100%;

      .water-level {
        width: 100px;
        height: 100px;
        position: absolute;
        left: 0;
        bottom: 0;
      }

      .water-detail {
        height: 100%;
        width: 100%;
        margin-left: 65px;
        //background: #29e999;
        padding-left: 65px;
        // opacity: 0.16;

        .name {
          font-size: 17px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
          margin: 10px 0 21px 0;
        }

        .number {
          font-size: 20px;
          font-family: DIN;
          font-weight: 500;
          color: white;
          text-shadow: 10px 14px 38px rgba(20, 34, 76, 0.73);
          background: linear-gradient(17deg,
              #0cf46e 2.1484375%,
              #31e7a5 97.65625%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          .detail {
            font-size: 48px;
            font-weight: 500;
            text-shadow: 10px 14px 38px rgba(20, 34, 76, 0.73);
            color: #ffffff;
            text-shadow: 10px 14px 38px rgba(20, 34, 76, 0.73);

            background: linear-gradient(17deg,
                #0cf46e 2.1484375%,
                #31e7a5 97.65625%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }

      .water-detail1 {
        .number {
          background: linear-gradient(0deg, #ea776e 0%, #ffd290 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          .detail {
            background: linear-gradient(0deg, #ea776e 0%, #ffd290 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }

      .water-detail2 {
        .number {
          background: linear-gradient(17deg,
              #e95258 2.1484375%,
              #ec515c 97.65625%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          .detail {
            background: linear-gradient(17deg,
                #e95258 2.1484375%,
                #ec515c 97.65625%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }
    }

    .water-son1 {
      background: url("../../assets/image/index/title7.png") no-repeat left;
    }

    .water-son2 {
      background: url("../../assets/image/index/title8.png") no-repeat left;
    }
  }

  .information-management {
    width: 100%;
    height: 100px;

    .information-box {
      position: relative;
      height: 100%;
      width: 45%;
      background: url("../../assets/image/index/title12.png") no-repeat left;
      background-size: 100%;
      font-weight: bold;
      color: #04cefc;
      font-size: 22px;

      .information-number {
        position: absolute;
        right: 14px;
        top: 13px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #ffffff;
        width: 39px;
        height: 23px;
        background: linear-gradient(167deg, #01a7fc, #07fffd);
        border-radius: 6px;
      }

      .information-number1 {
        background: linear-gradient(0deg, #ea776e, #ffd290);
        box-shadow: -1px 1px 1px 0px rgba(255, 227, 197, 0.59);
      }
    }

    .information-box1 {
      background: url("../../assets/image/index/title13.png") no-repeat left;
      background-size: 100%;
      color: #f3b283;
    }
  }
}

.Headline {
  position: relative;
  width: 100%;
  height: 55px;
  background: url("../../assets/image/index/title5.png") no-repeat left;
  background-size: 100% 55px;
  margin-bottom: 33px;

  .inspectionProcess {
    position: absolute;
    left: 0px;
    bottom: 0px;
    opacity: 0;
  }

  .Subtitle-title {
    font-size: 22px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #02bcfc;
    margin-right: 12px;
  }
}

.Subtitle {
  margin-bottom: 22px;
  width: 100%;
  height: 46px;
  background: url("../../assets/image/index/title4.png") no-repeat left;
  background-size: 428px 46px;
  padding-left: 69px;

  .Subtitle-title {
    font-size: 22px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #02bcfc;
    margin-right: 12px;
  }
}

.Subtitle1 {
  margin: 40px 0 25px;
  background: url("../../assets/image/index/title11.png") no-repeat left;
}

::v-deep .dv-water-pond-level text {
  display: none;
}

.bg-color-black {
  //height: $box-height - 30px;
}
</style>
