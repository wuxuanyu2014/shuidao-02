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
        <div :class="['ztable-td t-tac', 'ztable--w1']"><span>{{item.title}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w2']"><span>{{item.content}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w3']"><span>{{item.shopName}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w4']"><span>提醒</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w5']"><span>{{item.status == 0 ? '未读' : '已读'}}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w6']"><span>{{item.createTime}}</span></div>

      </li>
    </ul>
  </div>
</template>
  
<script>
import dayjs from 'dayjs'
import {
  getSystemMsg
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
        { name: '推送标题', enNmae: 'title', class: "ztable--w1" },
        { name: '推送内容', enNmae: 'content', class: "ztable--w2" },
        { name: '店铺名称', enNmae: 'shopName', class: "ztable--w3" },
        { name: '异常状态', enNmae: 'warnStatus', class: "ztable--w4" },
        { name: '消息状态', enNmae: 'status', class: "ztable--w5" },
        { name: '创建时间', enNmae: 'createTime', class: "ztable--w6" },


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
      let { data } = await getSystemMsg(this.tableSearch)

      data.list.forEach(item => {
        item.createTime = item.createTime ? dayjs(item.createTime).format('YYYY-MM-DD hh:mm:ss') : item.createTime
      });
      let list = []
      list = data.list

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
  width: 200px;
}

.ztable--w2 {
  width: 300px;
}

.ztable--w3 {
  width: 300px;
}

.ztable--w4 {
  width: 100px;
}

.ztable--w5 {
  width: 100px;
}

.ztable--w6 {
  width: 200px;
}

.ztable--w7 {
  width: 120px;
}
</style>