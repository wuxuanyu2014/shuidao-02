<template>
  <div class="ztable" :key="type">
    <div class="ztable-header d-flex">
      <div v-for="(item, index) in tableHeader" :key="item.name" class="ztable-tr d-flex ai-center">
        <div :class="['ztable-td t-tac',item.class]"><span>{{item.name}}</span></div>
      </div>
    </div>
    <ul class="ztable-body" v-infinite-scroll="loadMore" infinite-scroll-distance="30"
      :style="{'height': height+'px',overflow:'auto'}">
      <li v-for="(item, index) in tableList" :key="item.name" :class="['ztable-tr d-flex', 'ztable-tr'+index%2]">
        <div :class="['ztable-td t-tac', 'ztable--w1']"><span>{{item.score}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w2']"><span>{{item.xxx}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w3']"><span>{{item.remark}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w4']"><span>{{item.fromShopInfo.shopName}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w5']"><span>{{item.shopInfo.shopName}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w6']"><span>{{item.createTime}}</span></div>

      </li>
    </ul>
  </div>
</template>
  
<script>
import dayjs from 'dayjs'

import {
  getEvaluate
} from '@/api/cockpit'
export default {
  props: {
    height: {
      type: Number,
      default: 516
    },
    type: {
      type: String,
      default: 'productionList'
    }
  },
  watch: {
    type(val) {
      this.tableList = []
      this.tableSearch = {
        pageSize: 20,
        pageNum: 1,
      }
      this.getTableData();
    }
  },
  data() {
    return {
      tableHeader: [
        { name: '评分', enNmae: 'score', class: "ztable--w1" },
        { name: '类型', enNmae: 'shopName', class: "ztable--w2" },
        { name: '评价内容', enNmae: 'countryName', class: "ztable--w3" },
        { name: '上游单位', enNmae: 'fromshopinfo', class: "ztable--w4" },
        { name: '下游单位', enNmae: 'shopinfo', class: "ztable--w5" },
        { name: '评价时间', enNmae: 'createTime', class: "ztable--w6" },
      ],
      // 表格数据列表
      tableList: [],
      // 是否加载中
      tableLoading: false,
      // 表格搜索条件
      tableSearch: {
        pageSize: 20,
        pageNum: 1,
      },
    }
  },
  mounted() {
    this.getTableData();
  },
  activated() {
    //this.getTableData();
  },
  methods: {
    imgClick(e, imgRef) {

      console.log(e, imgRef, 'imgClick',)
      this.$nextTick(() => {
        console.log(document.querySelector('.el-image-viewer__wrapper'), this.$refs['el-image-viewer__wrapper'])
      })
    },
    // 请求表格数据
    async getTableData() {
      this.tableLoading = true;
      let { data } = await getEvaluate(this.tableSearch)


      let list = []
      list = data.list
      list.forEach(item => {
        item.createTime = item.createTime ? dayjs(item.createTime).format('YYYY-MM-DD hh:mm:ss') : item.createTime
      });
      console.log('productionList:', list, this.type)
      this.tableList = this.tableList.concat(list)
      this.tableSearch.pageNum += 1
      if (list.length) this.tableLoading = false
    },
    // 加载更多
    loadMore() {
      // console.log('loadmore')
      if (!this.tableLoading) {
        this.tableLoading = true;
        this.getTableData();
      }
    },
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/ztable.scss";

.ztable--w1 {
  width: 80px;
}

.ztable--w2 {
  width: 140px;
}

.ztable--w3 {
  width: 220px;
}

.ztable--w4 {
  width: 240px;
}

.ztable--w5 {
  width: 240px;
}

.ztable--w6 {
  width: 180px;
}

.ztable--w7 {
  width: 120px;
}
</style>