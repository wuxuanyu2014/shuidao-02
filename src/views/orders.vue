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
                <dv-scroll-board class="other-dv-scroll-board" :config="config" style="height:1440px" />
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
      config: {
        rowNum: 10,
        evenRowBGC: 'transparent',
        oddRowBGC: 'transparent',
        columnWidth: [332, 332],
        data: [],
      },
      datas: [
        { name: '洋芋', num: '10斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
        { name: '洋芋', num: '11斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
        { name: '洋芋', num: '12斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
        { name: '洋芋', num: '13斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
        { name: '洋芋', num: '10斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
        { name: '洋芋', num: '11斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
        { name: '洋芋', num: '12斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
        { name: '洋芋', num: '13斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
        { name: '洋芋', num: '10斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
        { name: '洋芋', num: '11斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
        { name: '洋芋', num: '12斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
        { name: '洋芋', num: '13斤', address: '上海市浦东新区康桥镇秀沿路2783弄' }
      ],

    };
  },
  components: {

  },
  mounted() {
    this.cancelLoading();
    this.init();
  },
  methods: {
    cancelLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    init() {
      const config = JSON.parse(JSON.stringify(this.config));
      config.data = this.datas.map((item, index) => {
        const color = index % 2 === 0 ? 'rgba(17,58,99,0.75)' : ' rgba(17,58,99,0.34)';
        return [
          `<div style="background:${color}">${item.name}</div>`,
          `<div style="background:${color}">${item.num}</div>`,
          `<div style="background:${color}">${item.address}</div>`,
        ]
      })
      this.config = config
    },
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
