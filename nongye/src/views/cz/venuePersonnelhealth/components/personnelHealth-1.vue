<template>
  <div class="ztable" >    
    <ul 
      class="ztable-body"     
      infinite-scroll-distance="30"
      :style="{height: height + 'px',overflow:'auto'}"
    >
      <li 
        v-for="(item, index) in tableList" 
        :key="item.name" 
        :class="['ztable-tr d-flex', 'ztable-tr'+index%2]"
      >
        <div :class="['ztable-td t-tac d-flex jc-center ai-center', 'ztable--w1']">
          <div class="ztable-td--serial"><span>{{index + 1}}</span></div>
        </div>
        <div :class="['ztable-td t-tac', 'ztable--w2']"><span>{{item.name}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w3']"><span>{{item.shopName}}</span></div>
        <!-- <div :class="['ztable-td t-tac', 'ztable--w4']"><span>{{item.phone}}</span></div> -->
        <div :class="['ztable-td t-tac d-flex jc-center ai-center', 'ztable--w5']">
          <el-image
            :ref="'elImg' + index"
            :src="item.healthImg" style="width: 40px;height: 40px;background: #000000;"
            :preview-src-list="[item.healthImg]"
            :close-on-click-modal="false"
            @click="imgClick($event, 'elImg' + index)"
          ></el-image>
        </div>
        <div :class="['ztable-td t-tac', 'ztable--w6']">
          <el-switch
            :value="true"
            :width="88"
            active-color="#000"
            inactive-color="#000">
          </el-switch>
        </div>
        <div :class="['ztable-td t-tac', 'ztable--w7']"><span>{{item.healthExpired}}</span></div>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  getStaff
}from '@/api/cockpit'
export default {
  props: {
    height: {
      type: Number,
      default: 516
    }
  },
  data () {
    return {
      tableHeader: [
        {name: '编号', enNmae: 'index', class: "ztable--w1"},
        {name: '从业人员', enNmae: 'name', class: "ztable--w2"},
        {name: '单位', enNmae: 'shopName', class: "ztable--w3"},
        {name: '手机号码', enNmae: 'phone', class: "ztable--w4"},
        {name: '健康证', enNmae: 'healthImg', class: "ztable--w5"},
        {name: '健康证状态', enNmae: 'healthExpired', class: "ztable--w6"},
        {name: '证件到期时间', enNmae: 'healthExpired', class: "ztable--w7"},
      ],
      // 表格数据列表
      tableList: [],
      // 是否加载中
      tableLoading: false,
      // 表格搜索条件
      tableSearch: {
        pageSize: 4,
        pageNum: 1,
      },
    }
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    imgClick(e, imgRef) {

      console.log(e, imgRef,'imgClick',)
      this.$nextTick(() => {
          console.log(document.querySelector('.el-image-viewer__wrapper'),this.$refs['el-image-viewer__wrapper'])
      })
    },
    // 请求表格数据
    async getTableData() {
      this.tableLoading = true;
      let {data} = await getStaff(this.tableSearch)
      this.tableList  = this.tableList.concat(data)
      this.tableSearch.pageNum += 1
      if(data.length) this.tableLoading = false
    },
    // 加载更多
    loadMore() {
      console.log('loadmore',this.tableLoading)
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

.ztable{
  height:350px;
}

.ztable-tr{
  margin:1px 0;
}

.ztable-tr1{    
    border: 0px solid #30FEED;    
  }
  .ztable-tr0{    
    border: 0px solid #30C6FE;    
  }

.ztable--w1{width: 120px;}
.ztable--w2{width: 100px;}
.ztable--w3{width: 340px;}
.ztable--w4{width: 140px;}
.ztable--w5{width: 167px;}
.ztable--w6{width: 137px;}
.ztable--w7{width: 127px;}

::v-deep .el-switch{
  height: 40px;
  border-radius: 20px;
  .el-switch__core{
  height: 40px;
  }
  .el-switch__core:after{
    top: 3px;
    margin-left: 3px;
    width: 32px;
    height: 32px;
    background: linear-gradient(-13deg, #01A7FC, #07FFFD);
  }
  &.is-checked .el-switch__core::after{
    margin-left: -38px;
  }
}

</style>