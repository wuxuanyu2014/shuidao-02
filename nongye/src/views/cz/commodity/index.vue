<template>
  <div class="commodity">
    <!-- <svg-icon icon-class="test"></svg-icon>
    <svg-icon icon-class="test" style="width: 200px;height: 200px;color: green;"></svg-icon>
    <svg-icon icon-class="test" style="width: 200px;height: 200px;color: red;"></svg-icon> -->
    <Xtitle name="食品溯源" />
    <div class="tabs">
      <div v-for="(tabs, tabsIndex) in tabs" :key="tabsIndex" class="tab_wrap d-flex jc-start ai-center">
        <div @click="tabChange(tab, tabIndex, tabsIndex)" v-for="(tab, tabIndex) in tabs" :key="tabIndex" :class="[
          'tab',
          {
            'tab--active':
              activeTab[0] === tabsIndex && activeTab[1] === tabIndex
          }
        ]">
          {{ tab.categoryName }}
        </div>
      </div>
    </div>
    <div class="char_wrap d-flex jc-between ai-start">
      <Echart :options="options" id="ringChart" height="342px" width="342px"></Echart>
      <div class="legends d-flex flex-wrap ai-start">
        <div v-for="(item, index) in tabData" :key="item.productId" :class="['legend', 'legend' + index]">
          <el-image class="inspectionProcess" :src="url" :preview-src-list="srcList"></el-image>
          <div class="legend-list d-flex jc-between ai-center">
            <span class="legend-list--left">{{ item.productName }}</span>
            <span class="legend-list--right">{{ item.count }}批次</span>
          </div>
          <div class="legend-list d-flex jc-between ai-center">
            <span class="legend-list--left ">合格</span>
            <span class="legend-list--right">{{ item.qualified }}批次</span>
          </div>
          <div class="legend-list legend-list--fail d-flex jc-between ai-center" style="color:rgb(238, 89, 96)">
            <!-- :style="{ color: item.itemStyle.color }" -->
            <span class="legend-list--left">不合格</span>
            <span class="legend-list--right ">{{ item.unQualified }}批次</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Xtitle from "@/components/Xtitle";
import Echart from "@/common/echart";

import { getCategory, getReportByCategory } from "@/api/cockpit.js";

let color = [
  "#EE5960",
  "#9F82FA",
  "#38CFF2",
  "#FAB725",
  "#53DC8A",
  "#DB7721",
  "#61D5FC",
  "#F2FF64",
  "#4C68D1",
  "#3FFFC4",
  "#D3854C",
  "#3CB1F9"
];

export default {
  components: {
    Echart,
    Xtitle
  },

  data() {
    return {
      url: require("../../../assets/image/index/bujige.png"),
      srcList: [require("../../../assets/image/index/bujige.png")],
      options: {},
      tabs: [],
      tabData: [],
      seriesData: [],
      activeTab: [0, 0],
      myChart: null
    };
  },
  computed: {
    activeTabIndex() {
      return this.activeTab[0] * 6 + this.activeTab[1];
    }
  },
  async mounted() {
    await this.getTabs();

    await this.echartListenr();
    this.myChart.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: 0
    });
  },
  methods: {
    // echart事件监听
    echartListenr() {
      let myChart = this.$echarts.init(document.querySelector("#ringChart"));
      // ehcart鼠标移入移出监听
      // 移入时隐藏总计的label
      myChart.on("mouseover", e => {
        if (e.dataIndex != this.activeTabIndex) {
          myChart.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: this.activeTabIndex
          });
        }
        this.options = this.getOptions(this.seriesData, false);
      });
      // 移出时显示总计的label
      myChart.on("mouseout", () => {
        this.options = this.getOptions(this.seriesData, true);
        this.myChart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: this.activeTabIndex
        });
      });
      this.myChart = myChart;
    },
    // 商品类别tab切换
    async tabChange(tab, tabIndex, tabsIndex) {
      let _activeTabIndex = this.activeTabIndex;
      this.activeTab = [tabsIndex, tabIndex];
      await this.getTabData(tab.categoryId);
      if (tabsIndex * 6 + tabIndex !== _activeTabIndex) {
        this.myChart.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          dataIndex: _activeTabIndex
        });
        this.myChart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: this.activeTabIndex
        });
      }
      // await this.echartListenr()
    },
    // 获取分类
    async getTabs() {
      let { data } = await getCategory();

      let seriesData = JSON.parse(JSON.stringify(data));
      seriesData.forEach((item, index) => {
        item.value = item.ratio;
        item.name = item.categoryName;
        // 设置颜色样式
        item.itemStyle = {
          color: color[index]
        };
      });
      this.seriesData = seriesData;

      this.tabs = this.resizeArr(seriesData.slice(0, 12));
      this.options = this.getOptions(seriesData);
      this.tabs.length && this.tabChange(this.tabs[0][0], 0, 0);
    },
    // 获取该分类下的数据
    async getTabData(categoryId) {
      let { data } = await getReportByCategory(categoryId);
      data.forEach((item, index) => {
        item.value = item.count;
        item.name = item.productName;
        // 设置颜色样式
        item.itemStyle = {
          color: color[index]
        };
      });
      this.tabData = data;
      // this.options = this.getOptions(data)
    },
    // 重新分组
    resizeArr(tabs, groupLen = 6) {
      // 默认六个一组
      let arr = [];
      let sliceStart = 0;

      while (tabs.length > groupLen) {
        let _tabs = tabs.splice(sliceStart, sliceStart + groupLen);
        arr.push(_tabs);
      }
      tabs.length && arr.push(tabs);
      return arr;
    },
    getOptions(data, seriesLabelShow = true) {
      console.log(
        seriesLabelShow,
        this.tabs,
        this.tabs[this.activeTab[0]],
        "total"
      );
      // let obj = this.tabs[this.activeTab[0]][this.activeTab[1]]
      // let total = obj.ratio
      // total = total * 100 + '%'

      return {
        // tooltip: {
        //   trigger: 'item',
        //   formatter: '{a} <br/>{b}: {c} ({d}%)'
        // },
        series: [
          {
            // name: '蔬菜类',
            type: "pie",
            radius: ["80%", "90%"],
            clockWise: false,
            // silent: true, // 取消hover效果
            // hoverAnimation: false, // 取消hover动画
            // avoidLabelOverlap: false,
            // minAngle: 1,
            label: {
              show: false,
              position: "center",
              formatter() {
                // return `{b|${total}}{bblock|}\n{a|${obj.name}}{ablock|}`
              },
              width: 250,
              height: 160,
              borderRadius: 125,
              backgroundColor: "transparent",
              verticalAlign: "middle",
              padding: [90, 0, 0, 0],
              rich: {
                a: {
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: 500
                },
                ablock: {
                  padding: [10, 0, 40, 0]
                },
                b: {
                  color: "#33C7FA",
                  fontSize: 37,
                  fontWeight: 500
                },
                bblock: {
                  height: 40
                }
              }
            },
            // 分割
            itemStyle: {
              // borderRadius: 20,
              // borderColor: '#fff',
              // borderWidth: 2
            },
            emphasis: {
              label: {
                show: true,
                formatter(params) {
                  return `{b|${params.percent + "%"}}{bblock|}\n{a|${params.name
                    }}{ablock|}`;
                  // return `{b|${params.value}}{bblock|}\n{a|${params.name}}{ablock|}`
                },
                width: 250,
                height: 160,
                borderRadius: 125,
                backgroundColor: "transparent",
                verticalAlign: "middle",
                padding: [90, 0, 0, 0],
                rich: {
                  a: {
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: 500
                  },
                  ablock: {
                    padding: [10, 0, 40, 0]
                  },
                  b: {
                    fontSize: 37,
                    fontWeight: 500
                  },
                  bblock: {
                    height: 40
                  }
                }
              }
            },
            color,
            data
          },
          {
            name: "外边框",
            type: "pie",
            avoidLabelOverlap: false,
            labelLine: {
              show: false
            },
            clockWise: false,
            silent: true, // 取消hover效果
            hoverAnimation: false, // 取消hover动画
            radius: ["90%", "90%"], //边框大小
            center: ["50%", "50%"], //边框位置
            data: [
              {
                value: 0,
                itemStyle: {
                  normal: {
                    borderWidth: 16, //设置边框粗细
                    borderColor: "#22274E" //边框颜色
                  }
                }
              }
            ]
          },
          {
            name: "内边框",
            type: "pie",
            avoidLabelOverlap: false,
            labelLine: {
              show: false
            },
            clockWise: false,
            silent: true, // 取消hover效果
            hoverAnimation: false, // 取消hover动画
            radius: ["77.5%", "77.5%"], //边框大小
            center: ["50%", "50%"], //边框位置
            data: [
              {
                value: 0,
                itemStyle: {
                  normal: {
                    borderWidth: 10, //设置边框粗细
                    borderColor: "#22274E" //边框颜色
                  }
                }
              }
            ]
          }
        ]
      };
    },
    // 获取echart的options
    getOptions1(data, seriesLabelShow = true) {
      console.log(
        seriesLabelShow,
        this.tabs,
        this.tabs[this.activeTab[0]],
        "total"
      );
      let obj = this.tabs[this.activeTab[0]][this.activeTab[1]];
      let total = obj.ratio;
      total = total * 100 + "%";

      return {
        // tooltip: {
        //   trigger: 'item',
        //   formatter: '{a} <br/>{b}: {c} ({d}%)'
        // },
        series: [
          {
            // name: '蔬菜类',
            type: "pie",
            radius: ["80%", "90%"],
            clockWise: false,
            // silent: true, // 取消hover效果
            // hoverAnimation: false, // 取消hover动画
            // avoidLabelOverlap: false,
            minAngle: 1,
            label: {
              show: seriesLabelShow,
              position: "center",
              formatter() {
                return `{b|${total}}{bblock|}\n{a|${obj.categoryName}}{ablock|}`;
              },
              width: 250,
              height: 160,
              borderRadius: 125,
              backgroundColor: "transparent",
              verticalAlign: "middle",
              padding: [90, 0, 0, 0],
              rich: {
                a: {
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: 500
                },
                ablock: {
                  padding: [10, 0, 40, 0]
                },
                b: {
                  color: "#33C7FA",
                  fontSize: 37,
                  fontWeight: 500
                },
                bblock: {
                  height: 40
                }
              }
            },
            // 分割
            itemStyle: {
              // borderRadius: 20,
              // borderColor: '#fff',
              // borderWidth: 2
            },
            emphasis: {
              label: {
                show: true,
                formatter(params) {
                  return `{b|${params.percent + "%"}}{bblock|}\n{a|${params.name
                    }}{ablock|}`;
                  // return `{b|${params.value}}{bblock|}\n{a|${params.name}}{ablock|}`
                },
                width: 250,
                height: 160,
                borderRadius: 125,
                backgroundColor: "transparent",
                verticalAlign: "middle",
                padding: [90, 0, 0, 0],
                rich: {
                  a: {
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: 500
                  },
                  ablock: {
                    padding: [10, 0, 40, 0]
                  },
                  b: {
                    fontSize: 37,
                    fontWeight: 500
                  },
                  bblock: {
                    height: 40
                  }
                }
              }
            },
            color,
            data
          },
          {
            name: "外边框",
            type: "pie",
            avoidLabelOverlap: false,
            labelLine: {
              show: false
            },
            clockWise: false,
            silent: true, // 取消hover效果
            hoverAnimation: false, // 取消hover动画
            radius: ["90%", "90%"], //边框大小
            center: ["50%", "50%"], //边框位置
            data: [
              {
                value: 0,
                itemStyle: {
                  normal: {
                    borderWidth: 16, //设置边框粗细
                    borderColor: "#22274E" //边框颜色
                  }
                }
              }
            ]
          },
          {
            name: "内边框",
            type: "pie",
            avoidLabelOverlap: false,
            labelLine: {
              show: false
            },
            clockWise: false,
            silent: true, // 取消hover效果
            hoverAnimation: false, // 取消hover动画
            radius: ["77.5%", "77.5%"], //边框大小
            center: ["50%", "50%"], //边框位置
            data: [
              {
                value: 0,
                itemStyle: {
                  normal: {
                    borderWidth: 10, //设置边框粗细
                    borderColor: "#22274E" //边框颜色
                  }
                }
              }
            ]
          }
        ]
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.commodity {
  // width: 906px;
}

#ringChart {
  flex-shrink: 0;
}

.tabs {
  margin-bottom: 30px;
}

.tab_wrap {
  // width: 906px;
  padding: 3px 2px;
  background-color: rgba(24, 77, 131, 0.7);
  border: 1px solid #30c6fe;
}

.tab_wrap {
  margin-top: 8px;
}

.tab {
  font-size: 18px;
  font-weight: bold;
  width: 146px;
  height: 49px;
  line-height: 49px;
  cursor: pointer;
  text-align: center;
  color: #e3f9ff;

  &--active {
    background: linear-gradient(17deg, #4d8bfa, #30cefa);
    box-shadow: 1px 1px 0px 0px rgba(112, 221, 255, 0.85);
  }
}

.tab+.tab {
  margin-left: 4px;
}

.legends {
  flex: 1;
  margin-left: 36px;
  margin-top: 20px;
}

.legend {
  position: relative;
  font-size: 18px;
  font-weight: bold;
  width: 260px;
  height: 100px;
  padding: 13px 36px 13px 56px;
  background: #1c2857;

  // border: 1px solid #ccc;
  // box-shadow: 1px 1px 2px 0px rgba(76,84,153,0.85);
  border-radius: 3px;
  color: #fff;

  .inspectionProcess {
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    opacity: 0;
  }

  &:before {
    content: "";
    position: absolute;
    top: 15px;
    left: 19px;
    width: 15px;
    height: 15px;
    background: url(../../../assets/image/index/circle0.png) no-repeat center / 100%;
  }

  &:nth-child(2n-1) {
    margin: 0 8px 8px 0;
  }
}

.legend0:before {
  background-image: url(../../../assets/image/index/circle0.png);
}

.legend1:before {
  background-image: url(../../../assets/image/index/circle1.png);
}

.legend2:before {
  background-image: url(../../../assets/image/index/circle2.png);
}

.legend3:before {
  background-image: url(../../../assets/image/index/circle3.png);
}

.legend4:before {
  background-image: url(../../../assets/image/index/circle4.png);
}

.legend5:before {
  background-image: url(../../../assets/image/index/circle5.png);
}

.legend-list {
  &--fail {
    color: #ee5960;
  }
}

.legend-list+.legend-list {
  margin-top: 11px;
}

.c1 {
  color: #ee5960;
}
</style>
