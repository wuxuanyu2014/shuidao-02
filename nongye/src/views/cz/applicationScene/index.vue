<template>
  <div>
    <div style="width: 100%; padding-left: 6px;">
      <Xtitle name="从业人员管理" style="margin-bottom: 36px;" />
      <div class="box">        
        <div v-for="(item, index) in personnelHealth" :key="item.name + index" :class="['box_wrap', item.class]">
          <data-popover :ref="item.component" :refName="item.component" :width="item.width" placement="left-start"
            :visible.sync="item.visible" @close="item.visible = false">
            <component :height="item.height" slot="dataSlot" :id="item.component" :is="item.component"></component>
            <small-personnel-health slot="btnSlot"></small-personnel-health>            
          </data-popover>
        </div>
      </div>
    </div>
    <div class="applicationScene" style=" margin-top:50px;">
      <Xtitle name="应用场景" style="margin-bottom: 36px;" />
      <div class="scenes d-flex jc-start ai-center">
        <div v-for="(item, index) in scenes" :key="item.name" :class="['scene', 'scene--type' + index]">{{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Xtitle from "@/components/Xtitle";
import personnelHealth from '../venuePersonnelhealth/components/personnelHealth'
import smallPersonnelHealth from '../venuePersonnelhealth/components/personnelHealth-1'
export default {
  components: {
    Xtitle,
    personnelHealth,
    smallPersonnelHealth
  },
  data() {
    return {
      scenes: [
        { name: '浙食链' },
        { name: '阳光配送' },
        { name: '共享实验室' },
        { name: '风险管控平台' },
      ],
      personnelHealth: [
         { component: 'personnelHealth', visible: false, width: '1230', eight: '590', name: '人员健康证', icon: require('../../../assets/image/index/healthcard.png'), style: { width: '24px', height: '19px', } },        
      ],
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.applicationScene {
  // width: 906px
}

.box {
  width: 100%;
  height: 392px;
  padding: 32px 6px 10px 10px;
  background: url(../../../assets/image/index/vp0.png)no-repeat center;
  background-size: 100% 100%;

}

.scene {
  width: 206px;
  height: 328px;
  font-size: 22px;
  font-weight: bold;
  padding-top: 60px;
  cursor: pointer;
  text-align: center;
  background: url(../../../assets/image/index/scene0.png)no-repeat center;
  color: #04D2FC;
}

.scene+.scene {
  margin-left: 60px;
}

.scene--type1 {
  color: #F8B685;
  background-image: url(../../../assets/image/index/scene1.png)
}
</style>