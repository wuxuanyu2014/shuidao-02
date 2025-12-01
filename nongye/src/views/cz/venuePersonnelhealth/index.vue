<template>
  <div class="venuePersonnelhealth d-flex jc-start">

    <div style="width: 50%; padding-right: 6px;">
      <Xtitle name="经营场所管理" style="margin-bottom: 36px;" />
      <div class="box">
        <div v-for="(item, index) in venues" :key="item.name + index" :class="['box_wrap', item.class]">
          <data-popover :ref="item.component" :refName="item.component" :width="item.width" placement="bottom-end"
            :visible.sync="item.visible" @close="item.visible = false">
            <component slot="dataSlot" :id="item.component" :is="item.component"></component>
            <div slot="btnSlot" @click="changePopoverVisible('venues',item, index)" class="d-flex jc-start ai-center"
              style="flex: 1;">
              <div class="icon-box d-flex jc-center ai-center">
                <img :src="item.icon" :style="item.style" />
              </div>
              <span class="box--title">{{item.name}}</span>
            </div>
          </data-popover>
        </div>
      </div>
    </div>
    <div style="width: 50%; padding-left: 6px;">
      <Xtitle name="人员健康管理" style="margin-bottom: 36px;" />
      <div class="box">
        <div v-for="(item, index) in personnelHealth" :key="item.name + index" :class="['box_wrap', item.class]">
          <data-popover :ref="item.component" :refName="item.component" :width="item.width" placement="bottom-end"
            :visible.sync="item.visible" @close="item.visible = false">
            <component :height="item.height" slot="dataSlot" :id="item.component" :is="item.component"></component>
            <div slot="btnSlot" @click="changePopoverVisible('personnelHealth',item, index)"
              class="d-flex jc-start ai-center" style="flex: 1;">
              <div class="icon-box d-flex jc-center ai-center">
                <img :src="item.icon" :style="item.style" />
              </div>
              <span class="box--title">{{item.name}}</span>
            </div>
          </data-popover>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script >

import Xtitle from "@/components/Xtitle";

import coldStorage from './components/coldStorage'
import aiCapture from './components/aiCapture'
import carGPS from './components/carGPS'
import personnelHealth from './components/personnelHealth'
import personCapture from './components/personCapture'
import personnelHealthBack from './components/personnelHealthBack'

export default {
  name: 'venuePersonnelhealth',
  components: {
    Xtitle,
    coldStorage,
    aiCapture,
    carGPS,
    personnelHealth,
    personCapture,
    personnelHealthBack
  },
  computed: {
    scale() {
      return this.$store.state.scale
    }
  },
  data() {
    return {
      venues: [
        { component: 'coldStorage', visible: false, width: '1230', height: '590', name: '冷库管理', icon: require('../../../assets/image/index/temperature.png'), style: { width: '15px', height: '27px', } },
        { component: 'aiCapture', visible: false, width: '1230', height: '590', name: 'AI抓拍', icon: require('../../../assets/image/index/aicapture.png'), class: 'box_wrap1', style: { width: '18px', height: '21px', } },
        { component: 'carGPS', visible: false, width: '1230', height: '590', name: '配送车辆GPS', icon: require('../../../assets/image/index/gps.png'), style: { width: '24px', height: '24px', } },
      ],
      personnelHealth: [
        { component: 'personnelHealth', visible: false, width: '1230', eight: '590', name: '人员健康证', icon: require('../../../assets/image/index/healthcard.png'), style: { width: '24px', height: '19px', } },
        { component: 'personCapture', visible: false, width: '1230', eight: '590', name: '人体测温抓拍', icon: require('../../../assets/image/index/personcapture.png'), style: { width: '19px', height: '23px', } },
      ],
    }
  },
  methods: {
    changePopoverVisible(dataName, item, index, visible = true) {
      // setTimeout(() => {
      // this.$nextTick(() => {

      //   let el = this.$refs[item.component][0].$children[0]
      //   let popperElm = el.popperElm
      //   console.log(popperElm,el)
      //   let id = el.$refs.popper.id
      //   let ref = document.querySelector('#'+id)
      //   let refWrap = document.querySelector('#'+id+' .ztable')
      //   let width = Number.parseFloat(ref.style.width)* 1 
      //   let height = 590 
      //   let translate = `translate(${this.scale.width * width}px, -${this.scale.height * height}px)`
      //   let scale = `scale(${this.scale.width}, ${this.scale.height})`
      //   console.log(refWrap.style, ref.style.left,'ref.style.left')
      //   // ref.style.transform  = `${scale} ${translate}`
      //   // ref.style.left = '300px!important'
      //   // ref.style.bottom = Number.parseFloat(ref.style.height) * this.scale.height + 'px!important'

      //   // el.updatePopper()
      //   this.$set(this[dataName][index], 'visible', visible)
      // })
      // }, 600)
    }
  }
}
</script>
  
<style lang="scss" scoped>
.venuePersonnelhealth {
  width: 906px
}

.box {
  width: 449px;
  height: 392px;
  padding: 62px 6px 10px 25px;
  background: url(../../../assets/image/index/vp0.png)no-repeat center;

}

.box_wrap {
  font-size: 22px;
  font-weight: 400;
  color: #07C6FF;
  cursor: pointer;

  // background: url(../../../assets/image/index/circle8.png)no-repeat 90% center / 100%;
  // background-size: 16px 16px;

  .box--title {
    padding-left: 21px;
    padding-right: 30px;
    flex: 1;
    height: 46px;
    line-height: 46px;
    background: rgba(19, 89, 106, 0.3);

  }

  .icon-box {
    width: 48px;
    height: 46px;
    background: rgba(24, 77, 131, 0.64);
    border: 1px solid rgba(48, 198, 254, 0.64);
  }

  /* &:hover{
    color: #F8B685;
    background-image: url(../../../assets/image/index/circle3.png);
    .icon-box{
      background: rgba(248, 182, 133, 0.64);
      border-color: rgba(248, 182, 133, 0.64);
    }
  } */
}

.box_wrap1 {
  color: #F8B685;

  .icon-box {
    background: rgba(255, 212, 190, 0.12);
    border-color: #F8B685;
  }

  .box--title {
    background: rgba(255, 212, 190, 0.12);
  }
}

.box_wrap+.box_wrap {
  margin-top: 21px;
}
</style>