<template>
  <div id="index" ref="appRef">
    <div class="bg">
      <div class="bg-2">
        <dv-loading v-if="loading">Loading...</dv-loading>
        <div v-else class="host-body">
          <div class="top-bg">
            <img src="../assets/image/index/title.png" alt="">
            <div class="date-time">{{ dayTime }}</div>
            <div class="go-home" @click="goHome">返回首页</div>
          </div>
          <div class="body-box">
            <div class="bottom-box">
              <div class="body-box-content">
                <div class="table-header">
                  <div class="header-item">名称</div>
                  <div class="header-item">人数</div>
                  <div class="header-item">内容</div>
                  <div class="header-item">电话</div>
                  <div class="header-item">时间</div>
                </div>
                <dv-scroll-board class="other-dv-scroll-board" :config="config" style="height:1340px" />
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
import axios from "axios";

export default {
  mixins: [drawMixin],
  data() {
    return {
      loading: true,
      dayTime: '',
      config: {
        rowNum: 10,
        evenRowBGC: 'transparent',
        oddRowBGC: 'transparent',
        columnWidth: [500, 500,1000, 500,500],
        data: [],
      },
      orders: []
    };
  },
  components: {

  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      try {
        await this.loadOrders();
        this.updateDateTime();
        this.cancelLoading();
      } catch (error) {
        console.error('初始化失败:', error);
        this.cancelLoading();
      }
    },

    async loadOrders() {
      try {
        const response = await axios({
          method: 'post',
          url: '/api/getAllOrders',
          data: {
            page: 1,
            pageSize: 20,
            isAdmin: true,
            orderType: 'study'
          },
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('学习咨询API响应:', response);

        if (response.data && response.data.success === true && response.data.data && response.data.data.orders) {
          this.orders = response.data.data.orders;
          console.log('成功加载学习咨询数量:', this.orders.length);
          this.updateScrollBoard();
        } else {
          console.error('学习咨询API返回数据格式异常:', response);
          this.orders = [];
        }
      } catch (error) {
        console.error('加载学习咨询失败:', error);
        this.orders = [];
      }
    },

    updateScrollBoard() {
      const config = JSON.parse(JSON.stringify(this.config));
      config.data = this.orders.map((order, index) => {
        const color = index % 2 === 0 ? 'rgba(17,58,99,0.75)' : 'rgba(17,58,99,0.34)';
        // 生成3-9的随机数
        const randomCount = Math.floor(Math.random() * 7) + 3;
        return [
          `<div style="background:${color}">${order.name || order.contactName || '-'}</div>`,
          `<div style="background:${color}">${order.participantCount || randomCount}人</div>`,
          `<div style="background:${color}">${order.question || '-'}</div>`,
          `<div style="background:${color}">${order.phone || '-'}</div>`,
          `<div style="background:${color}">${order.appointmentTime || '-'}</div>`,
        ]
      });
      this.config = config;
    },

    updateDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      this.dayTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    cancelLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },

    goHome() {
      this.$router.push('/');
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/index.scss";

.top-bg {
  position: relative;
  background: url("../assets/image/index/top-bg.png") no-repeat;
  background-position: center 0px;
  background-size: 3292px 260px;
  height: 200px;
  width: 100%;
  text-align: center;

  .date-time {
    position: absolute;
    left: 80px;
    top: 86px;
    font-size: 32px;
    color: #C4E5FE;
  }

  .go-home {
    position: absolute;
    right: 200px;
    top: 86px;
    font-size: 40px;
    font-weight: bold;
    color: #C4E5FE;
    cursor: pointer;
  }

}

.body-box-content {
  display: flex;
  flex-direction: column;
  width: 3222px;
  height: 1682px;
  padding: 104px 30px 66px 142px;
  background: rgba(39, 80, 137, 0.83);
  border-radius: 0px 0px 0px 0px;
  margin: 88px auto;
}

.table-header {
  display: flex;
  width: 100%;
  height: 100px;
  background: rgba(36, 186, 255, 0.3);
  border-radius: 8px 8px 0 0;
  margin-bottom: 0;
  border-bottom: 2px solid rgba(36, 186, 255, 0.5);

  .header-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 40px;
    font-weight: bold;
    color: #FFFFFF;
    text-align: left;
    padding-left: 32px;
    padding-right: 10px;

    &:nth-child(1) {
      width: 500px;
    }
    &:nth-child(2) {
      width: 500px;
    }
    &:nth-child(3) {
      width: 1000px;
    }
    &:nth-child(4) {
      width: 500px;
    }
    &:nth-child(5) {
      width: 500px;
    }
  }
}

.other-dv-scroll-board {
  ::v-deep .rows {
    .ceil {
      padding: 0;
      font-size: 36px !important;
      padding-bottom: 20px;

      >div {
        width: 100%;
        height: 100%;
        white-space: nowrap; // 禁止换行
        overflow: hidden; // 隐藏超出内容
        text-overflow: ellipsis; // 显示省略号
        padding-left: 32px;
        padding-right: 10px;
        line-height: 120px;
      }
    }
  }
}
</style>
