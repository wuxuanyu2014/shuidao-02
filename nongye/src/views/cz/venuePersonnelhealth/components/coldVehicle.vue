<template>
  <div class="ztable">
    <div class="ztable-header d-flex">
      <div v-for="(item, index) in tableHeader" :key="item.name" class="ztable-tr d-flex ai-center">
        <div :class="['ztable-td t-tac', 'ztable--w'+index+1,item.class]"><span>{{item.name}}</span></div>
      </div>
    </div>
    <ul class="ztable-body" v-infinite-scroll="loadMore" infinite-scroll-distance="30"
      :style="{'height': height+'px',overflow:'auto'}">
      <li v-for="(item, index) in tableList" :key="item.name" :class="['ztable-tr d-flex', 'ztable-tr'+index%2]">
        <div :class="['ztable-td t-tac d-flex jc-center ai-center', 'ztable--w1']">
          <div class="ztable-td--serial">{{ index + 1 }}</div>
        </div>
        <div :class="['ztable-td t-tac', 'ztable--w2']"><span>{{ item.shopName }}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w3']"><span>{{ item.carType }}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w4']"><span>{{ item.licensePlate }}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w5']"><span>{{ item.driver }}</span></div>
      </li>
    </ul>
  </div>
</template>
  
<script>
import {
  getColdVehicle
} from '@/api/cockpit'
export default {
  props: {
    height: {
      type: Number,
      default: 516
    }
  },
  data() {
    return {
      tableHeader: [
        {name: '编号', enNmae: 'index', class: "ztable--w1"},
        { name: '所属单位', enNmae: 'shopName', class: "ztable--w2" },
        { name: '车辆类型', enNmae: 'carType', class: "ztable--w3" }, 
        { name: '车牌', enNmae: 'licensePlate', class: "ztable--w4" },
        { name: '司机', enNmae: 'driver', class: "ztable--w5" }
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
      let { data } = await getColdVehicle(this.tableSearch)
      this.tableList = this.tableList.concat(data)
      this.tableSearch.pageNum += 1
      if (data.length) this.tableLoading = false
    },
    // 加载更多
    loadMore() {
      console.log('loadmore')
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
  width: 150px;
}

.ztable--w2 {
  width: 280px;
}

.ztable--w3 {
  width: 200px;
}

.ztable--w4 {
  width: 200px;
}

.ztable--w5 {
  width: 160px;
}

.ztable--w6 {
  width: 110px;
}

.ztable--w7 {
  width: 120px;
}
</style>