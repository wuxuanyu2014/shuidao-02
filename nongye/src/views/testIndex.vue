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
              <div class="box left">
                <corporate-culture />
                <agricultural-machinery-services style="margin-bottom: 8px;"/>
                <agricultural-management style="margin-bottom: 8px;" />
                <agricultural-services style="margin-bottom: 8px;" />
              </div>
              <div class="box center">
                <center-info />
                <center-main />
                <center-bottom />
              </div>
              <div class="box right">
                <meteorological />
                <environment />
                <technology style="margin-bottom: 40px;" />
                <evaluate />
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
import  CorporateCulture from "./index-model/corporate-culture.vue";
import  AgriculturalMachineryServices from "./index-model/agricultural-machinery-services.vue";
import  AgriculturalManagement from "./index-model/agricultural-management.vue";
import  AgriculturalServices from "./index-model/agricultural-services.vue";
import  Meteorological from "./index-model/meteorological.vue";
import  Environment from "./index-model/environment.vue";
import  Technology from "./index-model/technology.vue";
import  Evaluate from "./index-model/evaluate.vue";
import CenterInfo  from "./index-model/center-info.vue";
import CenterBottom  from "./index-model/center-bottom.vue";
import CenterMain  from "./index-model/center-main.vue";
export default {
  mixins: [drawMixin],
  data() {
    return {
      loading: true
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

.center {
  flex: 1;
}

.right,
.left {
  width: 870px;
  height: 1914px;
  padding: 38px 5px 0;
  background: rgba(39, 67, 105, 0.83);
  border-radius: 0px 0px 0px 0px;
}
</style>
