<template>
  <div id="index" ref="appRef">
    <div class="bg">
      <div class="bg-2">
        <dv-loading v-if="loading">Loading...</dv-loading>
        <div v-else class="host-body">
          <div class="top-bg">
            <img src="../assets/image/index/title.png" alt="">
            <div class="date-time">{{ dayTime }}</div>
          </div>
          <div class="body-box">
            <div class="bottom-box">
              <div class="body-box-content">
                <div class="item" v-for="(item, index) in goods" :key="index">
                  <div class="video">{{ item.url }}</div>
                  <div class="title">{{ item.name }}</div>
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

export default {
  mixins: [drawMixin],
  data() {
    return {
      loading: true,
      goods: [
        { url: '', name: '商品1号' },
        { url: '', name: '商品2号' },
        { url: '', name: '商品3号' },
        { url: '', name: '商品4号' },
        { url: '', name: '商品1号' },
        { url: '', name: '商品2号' },
        { url: '', name: '商品3号' },
        { url: '', name: '商品4号' },
      ]
    };
  },
  components: {

  },
  mounted() {
    this.cancelLoading();
  },
  methods: {
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

}

.body-box-content {
  display: flex;
  flex-wrap: wrap;
  width: 3222px;
  height: 1682px;
  padding: 104px 30px 66px 142px;
  background: rgba(39, 80, 137, 0.83);
  border-radius: 0px 0px 0px 0px;
  margin: 88px auto;

  .item {
    width: 651px;
    height: 644px;
    background: linear-gradient(180deg, rgba(11, 98, 138, 0) 0%, rgba(22, 125, 173, 0.77) 100%);
    box-shadow: 0px 26px 59px 0px rgba(0, 0, 0, 0.29);
    border-radius: 12px 12px 12px 12px;
    border: 3px solid rgba(36, 186, 255, 0.85);
    margin-right: 111px;
    padding: 28px 25px 32px;

    .video {
      width: 600px;
      height: 480px;
      border-radius: 12px 12px 12px 12px;
    }

    .title {
      width: 100% !important;
      height: 88px;
      line-height: 88px;
      font-weight: bold;
      font-size: 64px;
      background: linear-gradient(#FFFFFF 0%, #46AEFA 100%);
      color: transparent;
      background-clip: text;
    }
  }
}
</style>
