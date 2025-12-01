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
          <div class="monitor">
            <div class="monitor-title">
              <div class="tit">数据监测</div>
              <div class="go-home" @click="handleGoHome">返回首页</div>
            </div>
            <div class="monitor-content">
              <div class="item">
                <div class="tit">
                  <div>气象数据</div>
                </div>
                <div class="tabs">
                  <div class="tab" v-for="(item, index) in data1" :key="index">
                    <img :src="item.icon" alt="" width="96px" />
                    <div class="c-t">
                      <div class="label">
                        <div>{{ item.name }}</div>
                      </div>
                      <div class="value">
                        <div class="num">{{ item.value }}</div>
                        <div class="unit">{{ item.unit }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="tit">
                  <div>环境数据</div>
                </div>
                <div class="tabs">
                  <div class="tab" v-for="(item, index) in data2" :key="index" style="width: 33.333%;">
                    <img :src="item.icon" alt="" width="148px" />
                    <div class="c-t">
                      <div class="label">
                        <div>{{ item.name }}</div>
                      </div>
                      <div class="value">
                        <div class="num">{{ item.value }}</div>
                        <div class="unit">{{ item.unit }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="tit">
                  <div>环境数据</div>
                </div>
                <div class="tabs">
                  <div class="tab" v-for="(item, index) in data3" :key="index" style="width: 33.333%;">
                    <img :src="item.icon" alt="" width="148px" />
                    <div class="c-t">
                      <div class="label">
                        <div>{{ item.name }}</div>
                      </div>
                      <div class="value">
                        <div class="num">{{ item.value }}</div>
                        <div class="unit">{{ item.unit }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="tit">
                  <div>虫情数据</div>
                </div>
                <div class="n-menus">
                  <div class="menu-box">
                    <div @click="pot4 = index" :class="['menu', pot4 === index ? 'active' : '']" v-for="(item, index) in data4" :key="index">
                      <div class="index">{{ index + 1 }}</div>
                      <div class="name"> {{ item.name }}</div>
                      <div class="value">
                        <div class="num">{{ item.number }}</div>
                        <div class="unit">只</div>
                      </div>
                    </div>
                  </div>
                  <div class="img-box">
                    <img :src="data4[pot4].image" alt="" width="100%" height="100%" />
                  </div>
                </div>
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
import { getShopInfo } from "@/api/cockpit.js";

export default {
  mixins: [drawMixin],
  data() {
    return {
      loading: true,
      mainTitle: '宁海县长街镇博园区域性农事服务中心',
      data1: [{
        name: '空气湿度',
        value: 63.7,
        unit: '%',
        icon: require('../assets/image/monitor/icon-1.png')
      }, {
        name: '空气温度',
        value: 23.7,
        unit: '°C',
        icon: require('../assets/image/monitor/icon-2.png')
      }, {
        name: '大气压力',
        value: 1000.7,
        unit: 'hPa',
        icon: require('../assets/image/monitor/icon-3.png')
      }, {
        name: '光合有效辐射',
        value: 0,
        unit: 'w/m2',
        icon: require('../assets/image/monitor/icon-4.png')
      }, {
        name: '风速',
        value: 23.7,
        unit: 'm/s',
        icon: require('../assets/image/monitor/icon-5.png')
      }, {
        name: '电池电压',
        value: 23.7,
        unit: 'V',
        icon: require('../assets/image/monitor/icon-6.png')
      }, {
        name: '二氧化碳浓度',
        value: 552,
        unit: 'ppm',
        icon: require('../assets/image/monitor/icon-7.png')
      }],
      data2: [{
        name: '空气湿度',
        value: 63.7,
        unit: '%',
        icon: require('../assets/image/monitor/icon-8.png')
      }, {
        name: '空气温度',
        value: 23.7,
        unit: '°C',
        icon: require('../assets/image/monitor/icon-9.png')
      }, {
        name: '二氧化碳浓度',
        value: 1000.7,
        unit: 'ppm',
        icon: require('../assets/image/monitor/icon-10.png')
      }, {
        name: 'PM2.5',
        value: 0,
        unit: 'ug/m³',
        icon: require('../assets/image/monitor/icon-11.png')
      }, {
        name: 'PM10',
        value: 23.7,
        unit: 'ug/m³',
        icon: require('../assets/image/monitor/icon-12.png')
      }, {
        name: '电池电压',
        value: 23.7,
        unit: 'V',
        icon: require('../assets/image/monitor/icon-13.png')
      }],
      data3: [{
        name: '土壤湿度',
        value: 1000.7,
        unit: '%',
        icon: require('../assets/image/monitor/icon-14.png')
      }, {
        name: '土壤温度',
        value: 23.7,
        unit: '°C',
        icon: require('../assets/image/monitor/icon-15.png')
      }, {
        name: '土壤导电率',
        value: 23.7,
        unit: 'uS/cm',
        icon: require('../assets/image/monitor/icon-16.png')
      }, {
        name: '土壤盐分',
        value: 23.7,
        unit: 'ppm',
        icon: require('../assets/image/monitor/icon-17.png')
      }, {
        name: '干式PH值',
        value: 23.7,
        unit: '',
        icon: require('../assets/image/monitor/icon-18.png')
      }],
      pot4: 0,
      data4: [{
        name: '七星瓢虫',
        image: require('../assets/image/monitor/1.webp'),
        number: 63
      }, {
        name: '茶小绿叶蝉',
        image: require('../assets/image/monitor/2.jpeg'),
        number: 22
      }]
    };
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
        }
      } catch (error) {
        console.error('获取商店信息失败:', error);
      }
    },
    cancelLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    handleGoHome() {
      this.$router.push({
        path: '/'
      })
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/index.scss";

.top-bg {

  position: relative;
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

.monitor {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 230px;
  width: 3176px;
  height: 1722px;
  background: url('../assets/image/index/monitor-bg.png') no-repeat center center;
  background-size: 3176px 1722px;

  .monitor-title {
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .tit {
      padding-left: 120px;
      height: 48px;
      font-weight: bold;
      font-size: 48px;
      line-height: 48px;
      text-align: left;
      background: linear-gradient(180deg, #FFFFFF 39%, #31BEFF 61%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }

    .go-home {
      width: 388px;
      height: 120px;
      background: url('../assets/image/index/go-home.png') no-repeat center center;
      background-size: 100% 100%;
      padding: 65px 0 0 144px;
      font-weight: bold;
      font-size: 48px;
      cursor: pointer;
    }
  }
}

.monitor-content {
  display: flex;
  padding: 0 200px;
  justify-content: space-between;
  flex-wrap: wrap;

  .item {
    margin-top: 64px;
    width: 1352px;
    height: 706px;
    background: url('../assets/image/index/bg-small.png') no-repeat center center;
    background-size: 100% 100%;

    .tit {
      padding: 38px 0 0 40px;
      height: 110px;

      >div {
        height: 40px;
        font-weight: bold;
        font-size: 40px;
        line-height: 40px;
        text-align: left;
        background: linear-gradient(180deg, #FFFFFF 39%, #31BEFF 61%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
      }
    }
  }

  .tabs {
    display: flex;
    padding-left: 40px;
    flex-wrap: wrap;

    img {
      margin-right: 18px;
    }

    .tab {
      display: flex;
      width: 25%;
      margin-top: 60px;

      .c-t {
        padding-top: 10px;

        .label {
          height: 44px;
          min-width: 144px;
          background: url('../assets/image/monitor/text-bg.png') no-repeat center center;
          background-size: 148px 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;

          >div {
            height: 26px;
            font-weight: bold;
            font-size: 26px;
            line-height: 26px;
            text-align: left;
            background: linear-gradient(180deg, #FFFFFF 39%, #31BEFF 61%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
            text-align: center;
          }
        }

        .value {
          display: flex;
          height: 34px;
          justify-content: center;

          .num {
            height: 34px;
            font-weight: bold;
            font-size: 34px;
            line-height: 34px;
            text-align: left;
            background: linear-gradient(180deg, rgba(255, 228, 178, 1) 39%, rgba(255, 192, 76, 1) 61%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
            text-align: center;
          }

          .unit {
            font-weight: 500;
            font-size: 24px;
            height: 34px;
            line-height: 44px;
            color: #C9EBFF;
            text-align: left;
            font-style: normal;
            text-transform: none;
            margin-left: 10px;
          }
        }
      }
    }
  }

  .n-menus {
    display: flex;
    justify-content: space-between;
    padding-right: 26px;
    .menu-box {
      padding-top: 52px;
      padding-left: 58px;
      height: 476px;
      overflow-y: auto;

      .menu {
        cursor: pointer;
        position: relative;
        display: flex;
        justify-content: space-between;
        width: 794px;
        height: 66px;
        line-height: 66px;
        background: url('../assets/image/monitor/chong.png') no-repeat center center;
        background-size: 100% 100%;
        padding-left: 120px;
        padding-right: 36px;
        font-weight: bold;
        margin-bottom: 16px;

        .index {
          position: absolute;
          text-align: center;
          line-height: 46px;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 46px;
          background: linear-gradient(180deg, #008BFF 0%, rgba(0, 149, 255, 0.24) 100%);
          border-radius: 48px;
          font-size: 32px;
          font-weight: bold;
        }

        .name {
          font-size: 32px;
        }

        .value {
          display: flex;

          .num {
            color: rgba(255, 192, 76, 1);
            font-size: 34px;
            font-weight: bold;
          }

          .unit {
            color: rgba(201, 235, 255, 1);
            font-size: 24px;
            font-weight: bold;
            margin-left: 10px;
          }
        }
      }

      .menu.active {
        background: url('../assets/image/monitor/chong-selected.png') no-repeat center center;
        background-size: 100% 100%;
        .name{
          color: rgba(255, 190, 25, 1);
        }
      }
    }
    .img-box{
      padding: 8px;
      margin-top: 52px;
      width: 416px;
      height: 470px;
      background: url('../assets/image/monitor/img-box-bg.png') no-repeat center center;
      background-size: 100% 100%;
    }
  }
}
</style>
