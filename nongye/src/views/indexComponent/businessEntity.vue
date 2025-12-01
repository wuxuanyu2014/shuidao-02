<template>
  <div class="ztable" :key="type">
    <Xtitle :name="name" :other='select' style="width: auto;" />
    <div style="margin-top:5px" class="ztable-header d-flex">
      <div v-for="(item, index) in tableHeader" :key="item.name" class="ztable-tr d-flex ai-center">
        <div :class="['ztable-td t-tac',item.class]"><span>{{item.name}}</span></div>
      </div>
    </div>
    <ul class="ztable-body" v-infinite-scroll="loadMore" infinite-scroll-distance="30"
      :style="{'height': height+'px',overflow:'auto'}">
      <li v-for="(item, index) in tableList" :key="item.name" :class="['ztable-tr d-flex', 'ztable-tr'+index%2]" @click="handleClick(item)"> 
        <div :class="['ztable-td t-tac d-flex jc-center ai-center', 'ztable--w1']">
          <div class="ztable-td--serial">{{index + 1}}</div>
        </div>
        <div :class="['ztable-td t-tac', 'ztable--w2']"><span>{{item.shopName}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w3']"><span>{{item.countryName}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w4']"><span>{{item.shopAddress}}</span></div>
      </li>
    </ul>
  </div>
</template>
  
<script>
import Xtitle from "../../components/Xtitle";
import {
  getShopList
} from '@/api/cockpit'
export default {
  components: {
    Xtitle,
  },
  props: {
    height: {
      type: Number,
      default: 460
    },
    type: {
      type: String,
      default: 'productionList'
    },
    select: {
      type: String,
      default: '0家'
    },
    name: {
      type: String,
      default: '食品生产单位'
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
        { name: '单位', enNmae: 'shopName', class: "ztable--w2" },
        { name: '地区', enNmae: 'countryName', class: "ztable--w3" },
        { name: '详细地址', enNmae: 'shopAddress', class: "ztable--w4" },

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
    handleClick(item){
      if(this.type === 'saleList'){
        this.$router.push({path: '/info', query: {id: item.id}})
      }
    },
    imgClick(e, imgRef) {

      console.log(e, imgRef, 'imgClick',)
      this.$nextTick(() => {
        console.log(document.querySelector('.el-image-viewer__wrapper'), this.$refs['el-image-viewer__wrapper'])
      })
    },
    // 请求表格数据
    async getTableData() {
      this.tableLoading = true;

      let index = 0
      if (this.type == 'productionList') {
        index = 1
      }
      if (this.type == 'saleList') {
        index = 2
      }
      if (this.type == 'restaurantList') {
        index = 3
      }
      let { data } = await getShopList(this.tableSearch, index)
      let list = data.list
      //list = data[this.type]
      console.log('productionList:', list, this.type)
      this.tableList = this.tableList.concat(list)
      this.tableSearch.pageNum += 1
      if (list.length) this.tableLoading = false
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

.ztable-header {
  background: rgba(24, 77, 131, 0.7) !important;
}

.ztable--w1 {
  width: 120px;
}

.ztable--w2 {
  width: 400px;
}

.ztable--w3 {
  width: 300px;
}

.ztable--w4 {
  width: 500px;
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