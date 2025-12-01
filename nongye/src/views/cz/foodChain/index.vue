<template>
  <div class="foodChain">
    <Xtitle name="浙食链应用管理" style="margin-bottom: 44px;" />
    <div class="d-flex jc-between ai-center" style="">
      <div class=" " style="">
        <div class="box">智能分拣秤采集</div>
        <div class="box box1">一级供应商录入</div>
      </div>
      <div class="chains d-flex jc-start ai-start">
        <div v-for="(item, index) in chains" :key="index" class="chain">
          <pieEchart :key="item.index" :params="item"></pieEchart>
          <div class="pie-title d-flex jc-between ai-center">
            <img :src="item.icon" class="pie-title--icon">
            <div style="font-size: 14px;font-weight: 400;color: #FFFFFF;">{{item.title}}</div>
          </div>
          <div class="pie-count" :style="item.style">
            <dv-digital-flop :config="{ number: [item.seriesData[0]],content: '{nt}'}"
              style="width:130px;height:50px;" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import Xtitle from "@/components/Xtitle";
import pieEchart from './pieEchart'
import {
  getBill,
} from '@/api/cockpit.js'
import {
  setIntervalPublic
} from '@/utils/index.js'

export default {
  name: '',
  components: {
    Xtitle,
    pieEchart,
  },
  data() {
    return {
      chains: [
        {
          colorListIndex: 0,
          seriesData: [0, 0],
          icon: require('../../../assets/image/index/circle6.png'),
          title: '入库批次',
          style: { color: '#2DE1E3', },
          index: 0
        },
        {
          colorListIndex: 1,
          seriesData: [0, 0],
          icon: require('../../../assets/image/index/circle7.png'),
          title: '出库批次',
          style: { color: '#FBBB1D', },
          index: 1
        },
        {
          colorListIndex: 2,
          seriesData: [0, 0],
          icon: require('../../../assets/image/index/circle8.png'),
          title: '领取入库批次',
          style: { color: '#3CB2FA', },
          index: 2
        },
      ],
      timer: null
    }
  },
  mounted() {
    this.getBill()
    this.timer = setIntervalPublic(() => {
      this.getBill()
    })
  },
  // activated () {
  //   if(!this.timer){
  //     this.timer = setIntervalPublic(() => {
  //       this.getBill()
  //     })
  //   }
  // },
  // deactivated () {
  //   clearInterval(this.timer)
  //   this.timer = null
  // },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    async getBill() {
      let { data } = await getBill()
      let { claimedCount, inCount, outCount } = data
      let sum = inCount + outCount
      this.$set(this.chains[0], 'seriesData', [inCount, sum - inCount])
      this.$set(this.chains[1], 'seriesData', [outCount, sum - outCount])
      this.$set(this.chains[2], 'seriesData', [claimedCount, sum - claimedCount])
      this.$set(this.chains[0], 'seriesData', [0, 0])
      this.$set(this.chains[1], 'seriesData', [0, 0])
      this.$set(this.chains[2], 'seriesData', [0, 0])
      this.$nextTick(() => {
        this.$set(this.chains[0], 'index', Math.random())
        this.$set(this.chains[1], 'index', Math.random())
        this.$set(this.chains[2], 'index', Math.random())
        this.$set(this.chains[0], 'seriesData', [inCount, sum - inCount])
        this.$set(this.chains[1], 'seriesData', [outCount, sum - outCount])
        this.$set(this.chains[2], 'seriesData', [claimedCount, sum - claimedCount])
      });



    },
  }
}
</script>
<style scoped lang="scss">
.foodChain {
  // width: 906px;
}

.chains {
  flex: 1;
  margin-left: 58px;
}

.chain+.chain {
  margin-left: 70px;
}

.box {
  width: 200px;
  height: 100px;
  font-size: 20px;
  font-weight: bold;
  padding: 45px 10px 10px;
  color: #04CEFC;
  text-align: center;
  background: url(../../../assets/image/index/foodChain0.png)no-repeat center / 100%;
}

.box+.box {
  margin-top: 30px;
}

.box1 {
  color: #F3B283;
  background-image: url(../../../assets/image/index/foodChain1.png);
}

.pie-count {
  margin: 0 23px;
  font-size: 30px;
  font-weight: 500;
}

.pie-title {
  margin: 30px 23px 23px 23px;

  &--icon {
    width: 15px;
    height: 15px;
    margin-right: 15px;
  }
}
</style>
