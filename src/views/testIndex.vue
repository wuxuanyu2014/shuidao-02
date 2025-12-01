<template>
  <div id="index" ref="appRef">
    <div class="bg">
      <div class="bg-2">
        <dv-loading v-if="loading">Loading...</dv-loading>
        <div v-else class="host-body">
          <div class="top-bg">
            <div class="big-title">{{ mainTitle }}</div>
            <!-- <img src="../assets/image/index/title.png" alt=""> -->
            <!-- <div class="date-time">{{ dayTime }}</div> -->
          </div>
          <div class="body-box">
            <div class="bottom-box">
              <div class="box left">
                <corporate-culture />
                <agricultural-machinery-services :items="monitorItems" style="margin-bottom: 20px;" />
                <agricultural-services style="margin-bottom: 20px;" />
                <agricultural-management style="margin-bottom: 20px;" :items="plots" />
              </div>
              <div class="box center">
                <center-main  :top-data="topData"/>
                <center-bottom />
              </div>
              <div class="box right">
                <meteorological :online-data="onlineData" />
                <environment style="margin-top: 12px;" />
                <technology style="margin-top: 12px;" />
                <evaluate style="margin-top: 12px;" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import drawMixin from "../utils/drawMixin";
import CorporateCulture from "./index-model/corporate-culture.vue";
import AgriculturalMachineryServices from "./index-model/agricultural-machinery-services.vue";
import AgriculturalManagement from "./index-model/agricultural-management.vue";
import AgriculturalServices from "./index-model/agricultural-services.vue";
import Meteorological from "./index-model/meteorological.vue";
import Environment from "./index-model/environment.vue";
import Technology from "./index-model/technology.vue";
import Evaluate from "./index-model/evaluate.vue";
import CenterInfo from "./index-model/center-info.vue";
import CenterBottom from "./index-model/center-bottom.vue";
import CenterMain from "./index-model/center-main.vue";
import { getShopInfo } from "@/api/cockpit.js";

export default {
  mixins: [drawMixin],
  data() {
    return {
      loading: true,
      mainTitle: '宁海县长街镇博园区域性农事服务中心',
      monitorItems: [{
        title: "监控1",
      }, {
        title: "监控2",
      }, {
        title: "监控3",
      }, {
        title: "监控4",
      }],
      onlineData: {
        all: 102,
        online: 70,
        offline: 17,
        fault: 15
      },
      topData: {
        monitor: 30,
        coldStorage: 45961,
        area: 4596,
        output: 126.37
      },
      plots: [{
        index: 'A',
        name: 'XX地块名称'
      }, {
        index: 'B',
        name: 'XX地块名称'
      }, {
        index: 'C',
        name: 'XX地块名称'
      }, {
        index: 'D',
        name: 'XX地块名称'
      }]
    };
  },
  components: {
    CorporateCulture,
    AgriculturalMachineryServices,
    AgriculturalManagement,
    AgriculturalServices,
    Meteorological,
    Environment,
    Technology,
    Evaluate,
    CenterInfo,
    CenterBottom,
    CenterMain
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.fetchShopInfo();
      this.cancelLoading();
    },
    async fetchShopInfo() {
      try {
        const response = await getShopInfo();
        const resData = response.data;
        let data = null;
        
        // 处理不同的响应格式
        if (resData && resData.success === true && resData.data) {
          data = resData.data;
        } else if (resData && resData.shopInfo) {
          data = resData;
        }
        
        if (data) {
          // 更新标题
          if (data.title && data.title.mainTitle) {
            this.mainTitle = data.title.mainTitle;
          } else if (data.shopInfo && data.shopInfo.title) {
            this.mainTitle = data.shopInfo.title;
          }
          
          // 更新监控项数据
          if (data['agricultural-machinery-services']) {
            const machineryData = data['agricultural-machinery-services'];
            if (machineryData.monitorItems) {
              this.monitorItems = machineryData.monitorItems;
            }
          }
          
          // 更新在线数据
          if (data.meteorological && data.meteorological.onlineData) {
            this.onlineData = data.meteorological.onlineData;
          }
          
          // 更新顶部数据
          if (data['center-main'] && data['center-main'].topData) {
            this.topData = data['center-main'].topData;
          } else if (data['center-info'] && data['center-info'].centetData) {
            // 兼容旧的数据格式
            const centerData = data['center-info'].centetData;
            this.topData = {
              monitor: centerData.number1 || this.topData.monitor,
              coldStorage: centerData.number2 || this.topData.coldStorage,
              area: centerData.number3 || this.topData.area,
              output: centerData.number4 || this.topData.output
            };
          }
          
          // 更新地块数据
          if (data['agricultural-management'] && Array.isArray(data['agricultural-management'])) {
            // 从农业管理数据中提取地块信息
            // 如果数据格式是二维数组，取第一个数组作为地块数据
            if (data['agricultural-management'].length > 0 && Array.isArray(data['agricultural-management'][0])) {
              this.plots = data['agricultural-management'][0].map((item, index) => ({
                index: String.fromCharCode(65 + index), // A, B, C, D...
                name: item.name || `地块${index + 1}`
              }));
            }
          } else if (data.plots) {
            this.plots = data.plots;
          }
          
          console.log('首页数据更新成功:', data);
        }
      } catch (error) {
        console.error('获取商店信息失败:', error);
        // 接口失败时使用默认数据
      }
    },
    cancelLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/index.scss";

.top-bg {

  position: relative;
  // background: url("../assets/image/index/top-bg.png") no-repeat;
  background-position: center 0px;
  background-size: 3292px 260px;
  height: 180px;
  width: 100%;
  text-align: center;

  .big-title {
    position: absolute;
    left: 50%;
    top: 34px;
    transform: translateX(-50%);
    font-weight: bold;
    font-size: 84px;
    color: #EFF8FC;
    height: 84px;
    line-height: 84px
  }

  .date-time {
    position: absolute;
    left: 80px;
    top: 86px;
    font-size: 32px;
    color: #C4E5FE;
  }
}

.center {
  flex: 1;
  position: relative;
}

.right,
.left {
  width: 900px;
  height: 1914px;
  padding: 0 5px 0;
  border-radius: 0px 0px 0px 0px;
}
</style>
