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
              <div class="tit">地块管理</div>
              <div class="go-home" @click="handleGoHome">返回首页</div>
            </div>
            <div class="monitor-content">
              <div class="monitor-menu">
                <div @click="active = item.value" v-for="item in items" :key="item.value"
                  :class="['item', active === item.value ? 'active' : '']">
                  <div class="name ">{{ item.name }}</div>
                </div>
              </div>
              <div class="c-m">
                <div class="img-box">
                  这里是放内容的
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
      items: [],
      active: 0
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
          
          // 更新地块列表
          if (data.plots && Array.isArray(data.plots)) {
            this.items = data.plots.map((plot, index) => ({
              value: index,
              name: plot.name || `地块${plot.index || index + 1}`
            }));
          } else if (data['agricultural-management'] && Array.isArray(data['agricultural-management'])) {
            // 从农业管理数据中提取地块信息
            if (data['agricultural-management'].length > 0 && Array.isArray(data['agricultural-management'][0])) {
              this.items = data['agricultural-management'][0].map((item, index) => ({
                value: index,
                name: item.name || `地块${String.fromCharCode(65 + index)}`
              }));
            }
          }
          
          // 如果没有数据，使用默认数据
          if (this.items.length === 0) {
            for (let i = 0; i < 20; i++) {
              this.items.push({
                value: i,
                name: `地块${String.fromCharCode(65 + i)}`
              });
            }
          }
        }
      } catch (error) {
        console.error('获取商店信息失败:', error);
        // 接口失败时使用默认数据
        for (let i = 0; i < 20; i++) {
          this.items.push({
            value: i,
            name: `地块${String.fromCharCode(65 + i)}`
          });
        }
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
  padding: 122px 0 0 170px;

  .monitor-menu {
    height: 1378px;
    overflow-y: auto;

    .item {
      width: 516px;
      height: 100px;
      background: url('../assets/image/index/activitys-tab.png') no-repeat center center;
      background-size: 100% 100%;
      margin-bottom: 42px;
      display: flex;
      align-items: center;
      cursor: pointer;

      .name {
        padding-left: 58px;
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

    .item.active {
      background: url('../assets/image/index/activitys-tab-select.png') no-repeat center center;
      background-size: 100% 100%;

      .name {
        padding-left: 58px;
        height: 40px;
        font-weight: bold;
        font-size: 40px;
        line-height: 40px;
        text-align: left;
        background: linear-gradient(180deg, #FFFFFF 39%, #FFCF31 79%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
      }
    }
  }

  .c-m {
    margin-left: 32px;
    width: 2358px;
    height: 1376px;
    background: url('../assets/image/index/c-m.png') no-repeat;
    background-size: 100% 100%;
    padding: 34px;
  }
  .img-box{
    font-size: 40px;
  }
}
</style>
