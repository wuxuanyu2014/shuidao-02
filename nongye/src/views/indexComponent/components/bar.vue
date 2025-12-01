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
        <div :class="['ztable-td t-tac d-flex jc-center ai-center', 'ztable--w1']">
          <div class="ztable-td--serial">{{index + 1}}</div>
        </div>
        <div :class="['ztable-td t-tac', 'ztable--w2']"><span>{{item.billNo}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w3']"><span>{{item.shopName}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w4']"><span>{{item.checkTime}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w5']"><span>{{item.projectName}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w6']"><span>{{item.productName}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w7']"><span>{{item.result == 1 ?'合格':'不合格'}}</span></div>
      </li>
    </ul>
  </div>
</template>
  
<script>
import dayjs from 'dayjs'

import {
  getReport
} from '@/api/cockpit'
export default {
  props: {
    height: {
      type: Number,
      default: 516
    },
    type: {
      type: String,
      default: 'unQualified'
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
        { name: '编号', enNmae: 'index', class: "ztable--w1" },
        { name: '批次号', enNmae: 'billNo', class: "ztable--w2" },
        { name: '送检单位', enNmae: 'shopName', class: "ztable--w3" },
        { name: '检测时间', enNmae: 'checkTime', class: "ztable--w4" },
        { name: '检测项目', enNmae: 'projectName', class: "ztable--w5" },
        { name: '检测商品', enNmae: 'productName', class: "ztable--w6" },
        { name: '检测结果', enNmae: 'result', class: "ztable--w7" },
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
      let { data } = await getReport(this.tableSearch)


      let list = []
      list = data[this.type].itemDataList
      list.forEach(item => {
        item.checkTime = item.checkTime ? dayjs(item.checkTime).format('YYYY-MM-DD hh:mm:ss') : item.createTime
      });
      console.log('productionList:', list, this.type)
      this.tableList = list
      // this.tableList = this.tableList.concat(list)
      this.tableSearch.pageNum += 1
      if (list.length) this.tableLoading = false
    },
    // 加载更多
    loadMore() {
      // console.log('loadmore')
      // if (!this.tableLoading) {
      //   this.tableLoading = true;
      //   this.getTableData();
      // }
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
  width: 120px;
}

.ztable--w3 {
  width: 180px;
}

.ztable--w4 {
  width: 180px;
}

.ztable--w5 {
  width: 120px;
}

.ztable--w6 {
  width: 120px;
}

.ztable--w7 {
  width: 120px;
}
</style>