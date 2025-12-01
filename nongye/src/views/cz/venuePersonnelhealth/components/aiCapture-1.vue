<template>
  <div class="ztable">
    <ul class="ztable-body" infinite-scroll-distance="30" :style="{ height: height + 'px', overflow: 'auto' }">
      <li v-for="(item, index) in tableList" :key="item.dateTime" :class="['ztable-tr d-flex', 'ztable-tr' + index % 2]">
        <div :class="['ztable-td t-tac d-flex jc-center ai-center', 'ztable--w1']">
          <div class="ztable-td--serial"><span>{{ index + 1 }}</span></div>
        </div>
        <div :class="['ztable-td t-tac', 'ztable--w2']"><span>{{ item.shopName }}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w3']"><span>{{ item.resName }}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w4']"><span>{{ item.eventTypeName }}</span></div>
        <div :class="['ztable-td t-tac', 'ztable--w5']"><span>{{ item.dateTime }}</span></div>
        <div :class="['aa ztable-td t-tac d-flex jc-center ai-center', 'ztable--w6']">
          <el-image :ref="'elImg' + index" :src="item.url" style="width: 40px;height: 40px;background: #000000;"
            :preview-src-list="[item.url]" :close-on-click-modal="false"
            @click="imgClick($event, 'elImg' + index)"></el-image>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {
  getEventList
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
        { name: '编号', enNmae: 'index', class: "ztable--w1" },
        { name: '从业人员', enNmae: 'name', class: "ztable--w2" },
        { name: '单位', enNmae: 'shopName', class: "ztable--w3" },
        { name: '手机号码', enNmae: 'phone', class: "ztable--w4" },
        { name: '温度', enNmae: 'temperature', class: "ztable--w5" },
        { name: '测温时间', enNmae: 'createTime', class: "ztable--w6" },
        { name: '抓拍图', enNmae: 'faceUrl', class: "ztable--w7" },
        { name: '测温设备', enNmae: 'healthExpired', class: "ztable--w8" },
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

      console.log(e, imgRef, 'imgClick',)
      this.$nextTick(() => {
        console.log(document.querySelector('.el-image-viewer__wrapper'), this.$refs['el-image-viewer__wrapper'])
      })
    },
    // 请求表格数据
    async getTableData() {
      this.tableLoading = true;
      let { data } = await getEventList(this.tableSearch)
      //console.log(data)
      data.list.forEach(item => {
        item.createTime = item.createTime ? dayjs(item.createTime).format('YYYY-MM-DD hh:mm:ss') : item.createTime
      });
      this.tableList = this.tableList.concat(data.list)
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

.ztable-tr1 {
  border: 0px solid #30FEED;
}

.ztable-tr0 {
  border: 0px solid #30C6FE;
}

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
  width: 180px;
}

.ztable--w5 {
  width: 180px;
}

.ztable--w6 {
  width: 180px;
}

.ztable--w7 {
  width: 127px;
}

.ztable--w8 {
  width: 127px;
}
</style>