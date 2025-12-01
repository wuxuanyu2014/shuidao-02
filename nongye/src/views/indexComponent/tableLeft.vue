<template>
  <div id="centerRight1">
    <div class="bg-color-black">
      <Xtitle name="经营主体管理" />
      <div @click="clickBoard('productionList')" class="Subtitle s-flex-start">
        <span class="Subtitle-title">源头一级供应商单位</span>
        <span class="Subtitle-numbert">{{ productionCount }}家</span>
      </div>
      <div class="d-flex jc-center body-box">
        <dv-scroll-board @click="clickBoard('productionList')" ref="scrollBoard1" class="dv-scr-board"
          :config="productionList" />
      </div>
      <div @click="clickBoard('saleList')" class="Subtitle Subtitle1 s-flex-start">
        <span class="Subtitle-title">学校配送单位</span>
        <span class="Subtitle-numbert">{{ saleCount }}家</span>
      </div>
      <div @click="clickBoard('saleList')" class="tableLeft-box">
        <div class="s-flex-start">
          <div class="box-img">1</div>
          <div class="box-title">{{ saleList.list[0].shopName && (saleList.list[0].shopName || "") }}</div>
          <!-- <div class="box-shop s-flex-center">
            商家数：
            <span>{{ saleCount }}</span>户
          </div> -->
        </div>
        <div class="box-content">
          <div class="title">所属区县：{{ saleList.list[0].countryName }}</div>
          <div class="title">开办者单位：{{ saleList.list[0].shopName }}</div>
          <div class="title">地址：{{ saleList.list[0].shopAddress }}</div>
        </div>
      </div>
      <div class="d-flex jc-center body-box">
        <dv-scroll-board @click="clickBoard('saleList')" ref="scrollBoard" class="dv-scr-board dv-scr-board2"
          :config="saleList" />
      </div>
      <div @click="clickBoard('restaurantList')" class="Subtitle Subtitle3 s-flex-start">
        <span class="Subtitle-title">餐饮服务单位</span>
        <span class="Subtitle-numbert">{{ restaurantCount }}家</span>
      </div>
      <div @click="clickBoard('restaurantList')" class="tableLeft-box">
        <div class="s-flex-start">
          <div class="box-img">1</div>
          <div class="box-title">
            {{ restaurantList.list[0].shopName || "" }}
          </div>
          <!-- <div class="box-shop s-flex-center">
            商家数：
            <span>{{ restaurantCount }}</span>户
          </div> -->
          <!-- <div class="box-shop s-flex-center">
            摊位数：
            <span>X</span>户
          </div>-->
        </div>
        <div class="box-content">
          <div class="title">
            所属区县：{{ restaurantList.list[0].countryName }}
          </div>
          <div class="title">
            开办者单位：{{ restaurantList.list[0].shopName }}
          </div>
          <div class="title">
            地址：{{ restaurantList.list[0].shopAddress }}
          </div>
        </div>
      </div>
      <div class="d-flex jc-center body-box">
        <dv-scroll-board @click="clickBoard('restaurantList')" ref="scrollBoard1" style="width:100%;height:92px"
          class="dv-scr-board dv-scr-board3" :config="restaurantList" />
      </div>
    </div>

    <data-dialog v-model="dialogData.visible" :width="1320" :height="590" @close="dialogClose">
      <component :name="name" :select="select" :type="dialogData.type" slot="dataSlot" :id="venues[0].component"
        :is="venues[0].component" >
      </component>

    </data-dialog>
    <slot name="content"></slot>
  </div>
</template>

<script>
import Xtitle from "../../components/Xtitle";
const data = [1360, 1320, 732, 701];

const sideData = data.map(item => item + 90);

import { getShop } from "@/api/cockpit";
import businessEntity from './businessEntity'
export default {
  components: {
    Xtitle,
    businessEntity
  },
  data() {
    return {
      dialogData: {
        visible: false,
        type: ''
      },
      venues: [
        { component: 'businessEntity', visible: false, width: '1230', height: '650', name: '冷库管理', icon: require('../../assets/image/index/temperature.png'), style: { width: '15px', height: '27px', } },
      ],
      statisticsplatformData: [data, sideData],
      config1: {
        data: [50],
        shape: "round",
        waveHeight: 8,
        colors: ["#0CF46E", "#31E7A5"],
        waveOpacity: 1
      },
      productionList: {
        // header: ["组件", "分支", "覆盖率"],
        data: [],
        list: [],
        rowNum: 2, //表格行数
        oddRowBGC: "rgba(24,131,115,0.7)",
        evenRowBGC: "rgba(24,77,131,0.7)",
        index: false,
        headerHeight: 46,
        columnWidth: [50, 300, 120, 436],
        align: ["left"],
        hoverPause: true
      },
      restaurantList: {
        // header: ["组件", "分支", "覆盖率"],
        data: [],
        list: [],
        rowNum: 2, //表格行数
        oddRowBGC: "rgba(24,131,115,0.7)",
        evenRowBGC: "rgba(24,77,131,0.7)",
        index: false,
        headerHeight: 46,
        columnWidth: [50, 300, 120, 436],
        align: ["left"]
      },
      saleList: {
        // header: ["组件", "分支", "覆盖率"],
        data: [],
        list: [],
        oddRowBGC: "rgba(24,131,115,0.7)",
        evenRowBGC: "rgba(24,77,131,0.7)",
        rowNum: 4, //表格行数
        index: false,
        headerHeight: 46,
        columnWidth: [50, 300, 120, 436],
        align: ["left"]
      },
      timer: null,
      productionCount: 0,
      saleCount: 0,
      restaurantCount: 0,
      name: '',
      select: ''
    };
  },
  created() { },
  async mounted() {
    await this.getShop();

    // this.timer = setInterval(() => {
    //   this.getShop();
    // }, 5000)
  },
  methods: {
    clickBoard(type) {
      this.dialogData.type = type
      this.dialogData.visible = true
      console.log('type:', type)
      if (type == 'productionList') {
        this.select = this.productionCount + '家'
        this.name = '源头一级供应商单位'
      }
      if (type == 'saleList') {
        this.select = this.saleCount + '家'
        this.name = '学校配送单位'
      }
      if (type == 'restaurantList') {
        this.select = this.restaurantCount + '家'
        this.name = '餐饮服务单位'
      }

    },
    dialogClose(closeCalc = false) {
      console.log('我点了')
      this.$emit('dialogClose', closeCalc);
    },
    async getShop() {
      let { data } = await getShop();
      let {
        productionList,
        restaurantList,
        saleList,
        productionCount,
        saleCount,
        restaurantCount
      } = data;
      let productionListData = [],
        restaurantListData = [],
        saleListData = [];
      this.productionCount = productionCount;
      this.saleCount = saleCount;
      this.restaurantCount = restaurantCount;

      productionList.forEach((element, index) => {
        element.index = index + 1;
        element.shopName = element.shopName || "";

        productionListData[index] = [
          `<div ${index % 2 == 0
            ? ""
            : "style='background:linear-gradient(-13deg, #01FCE1, #07FFB6);'"
          } class='table-label'>${index + 1}</div>`,
          `<span style='padding-left:10px;color:#00EEF5'>${element.shopName ||
          ""}</span>`,
          `<div style="color:white"  class='colorGrass'>${element.countryName ||
          ""}</div>`,
          `<div class="one_hidden" style="color:white">${element.shopAddress ||
          ""}</div>`
        ];
      });
      restaurantList.forEach((element, index) => {
        element.index = index + 1;
        element.shopName = element.shopName || "";

        restaurantListData[index] = [
          `<div ${index % 2 == 0
            ? ""
            : "style='background:linear-gradient(-13deg, #01FCE1, #07FFB6);'"
          } class='table-label'>${index + 1}</div>`,
          `<span style='padding-left:10px;color:#00EEF5'>${element.shopName ||
          ""}</span>`,
          `<div style="color:white"  class='colorGrass'>${element.countryName ||
          ""}</div>`,
          `<div class="one_hidden" style="color:white">${element.shopAddress ||
          ""}</div>`
        ];
      });
      saleList.forEach((element, index) => {
        element.index = index + 1;
        element.shopName = element.shopName || "";

        saleListData[index] = [
          `<div ${index % 2 == 0
            ? ""
            : "style='background:linear-gradient(-13deg, #01FCE1, #07FFB6);'"
          } class='table-label'>${index + 1}</div>`,
          `<span style='padding-left:10px;color:#00EEF5'>${element.shopName ||
          ""}</span>`,
          `<div style="color:white"  class='colorGrass'>${element.countryName ||
          ""}</div>`,
          `<div class="one_hidden" style="color:white">${element.shopAddress ||
          ""}</div>`
        ];
      });

      this.productionList = {
        ...this.productionList,
        data: productionListData
      };
      this.productionList.list = productionList;
      this.restaurantList = {
        ...this.restaurantList,
        data: restaurantListData
      };
      this.restaurantList.list = restaurantList;
      this.saleList = { ...this.saleList, data: saleListData };
      this.saleList.list = saleList;

      console.log("data:", data, saleListData);
    }
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>
<style lang="scss" scoped>
$box-height: 810px;
$box-width: 960px;

#centerRight1 {
  width: 100% !important;
  height: 100% !important;

  .tableLeft-box {
    width: 100%;

    height: 148px;
    padding: 16px;

    background: url("../../assets/image/index/bg-business.png") no-repeat left;
    background-size: 100% 148px;

    .box-content {
      margin-left: 49px;
      margin-top: 25px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;

      .titie {
        margin-bottom: 8px;
      }
    }

    .box-img {
      margin-right: 20px;
      width: 30px;
      height: 30px;
      background: linear-gradient(-13deg, #01a7fc, #07fffd);
      border-radius: 0px 0px 10px 0px;
      text-align: center;
      line-height: 30px;
      font-size: 16px;
      font-family: DIN;
      font-weight: 500;
      color: #000a23;
    }

    .box-title {
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #30cefa;
      margin-right: 67px;
    }

    .box-shop {
      margin-right: 6px;
      width: 128px;
      height: 30px;
      border: 1px solid #30feed;

      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #36f6ff;

      span {
        color: #fbbc1c;
      }
    }
  }
}

.Subtitle {
  margin: 11px 0 11px 0;
  width: 100%;
  height: 46px;
  background: url("../../assets/image/index/title1.png") no-repeat left;
  background-size: 428px 46px;
  padding-left: 69px;

  .Subtitle-title {
    font-size: 22px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #02bcfc;
    margin-right: 12px;
  }

  .Subtitle-numbert {
    font-size: 22px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #fabe88;
  }
}

.Subtitle2 {
  background: url("../../assets/image/index/title2.png") no-repeat left;
}

.Subtitle3 {
  background: url("../../assets/image/index/title3.png") no-repeat left;
}

::v-deep .dv-water-pond-level text {
  display: none;
}

.bg-color-black {
  //height: $box-height - 30px;
  border-radius: 10px;
}

.text {
  color: #c3cbde;
}

.body-box {
  overflow: hidden;

  .dv-scr-board {
    width: 100%;
    height: 92px;
  }

  .dv-scr-board2 {
    width: 100%;
    height: 184px;
  }

  .dv-scr-board3 {
    width: 100%;
    height: 92px;
  }
}
</style>
