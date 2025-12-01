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
            <div class="ztable-td--serial">{{index + 1}}</div>
          </div>
        <div :class="['ztable-td t-tac', 'ztable--w2']"><span>{{item.name}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w3']"><span>{{item.shopName}}</span></div>
        <!-- <div :class="['ztable-td t-tac', 'ztable--w4']"><span>{{item.phone}}</span></div> -->
        <div :class="['ztable-td t-tac', 'ztable--w5']"><span v-if="item.temperature">{{item.temperature}}℃</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w6']"><span v-if="item.humidity">{{item.humidity}}%RH</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w7']"><span>{{item.healthExpired}}</span></div>
      </li>
    </ul>
  </div>
</template>
  
<script>
import {
  getColdStorage
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
        { name: '名称', enNmae: 'name', class: "ztable--w2" },
        { name: '所属单位', enNmae: 'shopName', class: "ztable--w3" },
        // { name: '所在地址', enNmae: 'address', class: "ztable--w4" },
        { name: '温度', enNmae: 'temperature', class: "ztable--w5" },
        { name: '湿度', enNmae: 'humidity', class: "ztable--w6" },
        { name: '状态', enNmae: 'healthExpired', class: "ztable--w7" },
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
      let { data } = await getColdStorage(this.tableSearch)
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
  width: 200px;
}

.ztable--w3 {
  width: 280px;
}

.ztable--w4 {
  width: 280px;
}

.ztable--w5 {
  width: 110px;
}

.ztable--w6 {
  width: 110px;
}

.ztable--w7 {
  width: 120px;
}
</style>