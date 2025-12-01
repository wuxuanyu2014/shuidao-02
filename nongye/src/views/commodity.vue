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
                <div class="item" v-for="(item, index) in displayGoods" :key="item._id || index">
                  <div class="video">
                    <img v-if="item.image" :src="item.image" :alt="item.name" class="product-image">
                    <div v-else class="no-image">暂无图片</div>
                  </div>
                  <div class="title">{{ item.name }}</div>
                  <div class="product-info">
                    <div class="price">¥{{ item.price }}/{{ item.unit || '件' }}</div>
                    <div class="remark">{{ item.remark }}</div>
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
import axios from "axios";

export default {
  mixins: [drawMixin],
  data() {
    return {
      loading: true,
      goods: [],
      dayTime: ''
    };
  },
  computed: {
    displayGoods() {
      // 只显示前5个商品
      return this.goods.slice(0, 5);
    }
  },
  components: {

  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      try {
        await this.loadProducts();
        this.updateDateTime();
        this.cancelLoading();
      } catch (error) {
        console.error('初始化失败:', error);
        this.cancelLoading();
      }
    },

    async loadProducts() {
      try {
        const response = await axios({
          method: 'post',
          url: '/api/getProductList',
          data: {
            page: 1,
            pageSize: 20,
            isAdmin: true
          },
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('商品列表API响应:', response);

        if (response.data && response.data.success === true && response.data.data && response.data.data.list) {
          this.goods = response.data.data.list;
          console.log('成功加载商品数量:', this.goods.length);
        } else {
          console.error('商品列表API返回数据格式异常:', response);
          this.goods = [];
        }
      } catch (error) {
        console.error('加载商品列表失败:', error);
        this.goods = [];
      }
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
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 3222px;
  height: 1682px;
  padding: 104px 30px 66px 142px;
  background: rgba(39, 80, 137, 0.83);
  border-radius: 0px 0px 0px 0px;
  margin: 88px auto;

  .item {
    width: 520px;
    height: 780px;
    background: linear-gradient(180deg, rgba(11, 98, 138, 0) 0%, rgba(22, 125, 173, 0.77) 100%);
    box-shadow: 0px 26px 59px 0px rgba(0, 0, 0, 0.29);
    border-radius: 12px 12px 12px 12px;
    border: 3px solid rgba(36, 186, 255, 0.85);
    margin-right: 40px;
    padding: 28px 25px 32px;
    margin-bottom: 20px;

    &:nth-child(5n) {
      margin-right: 0;
    }

    .video {
      width: 470px;
      height: 400px;
      border-radius: 12px 12px 12px 12px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f0f0;

      .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .no-image {
        color: #999;
        font-size: 16px;
      }
    }

    .title {
      width: 100% !important;
      height: 60px;
      line-height: 60px;
      font-weight: bold;
      font-size: 32px;
      background: linear-gradient(#FFFFFF 0%, #46AEFA 100%);
      color: transparent;
      background-clip: text;
      margin-bottom: 10px;
      text-align: center;
    }

    .product-info {
      .price {
        font-size: 24px;
        color: #FFD700;
        font-weight: bold;
        margin-bottom: 12px;
        text-align: center;
      }

      .remark {
        font-size: 20px;
        color: #C4E5FE;
        line-height: 1.6;
        min-height: 200px;
        text-align: left;
        word-wrap: break-word;
        white-space: normal;
        padding: 0 10px;
      }
    }
  }
}
</style>
