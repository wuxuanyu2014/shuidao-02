<template>
  <el-table
    class="table--popover"
    height="400px"
    v-el-table-infinite-scroll="loadMore"
    :data="tableList"
    :row-class-name="tableRowClassName"
    
  >
    <el-table-column prop="date" label="从业人员" width="180"> </el-table-column>
    <el-table-column prop="date" label="日期" width="180"> </el-table-column>
    <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
    <el-table-column prop="address" label="地址"> </el-table-column>
  </el-table>
</template>

<script>
const healthcard = new Array(10).fill({
  date: "2016-05-02",
  name: "王小虎",
  address: "上海市普陀区金沙江路 1518 弄",
});
const personcapture = new Array(10).fill({
  date: "2022-05-02",
  name: "AA",
  address: "那边市普陀区金沙江路 1518 弄",
});
import {
  getStaff
}from '@/api/cockpit'
export default {
  name: "personnelHealth",
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 表格数据列表
      tableList: [],
      // 是否加载中
      tableLoading: false,
      // 表格搜索条件
      tableSearch: {
        pageSize: 16,
        pageNum: 1,
      },
      personcapture,
      healthcard
    };
  },
  mounted() {
    this.getTableData();
  },

  methods: {
    tableRowClassName({row, rowIndex}) {
        if (rowIndex%2 === 0) {
          return 'table--row1';
        } else{
          return 'table--row2';
        }
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
      if (!this.tableLoading) {
        this.tableLoading = true;
        this.getTableData();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.table--popover.el-table ::v-deep{
   background-color: #011623;
  color:#fff;
  height: 500px;
   .el-table__body tr:hover>td.el-table__cell{
    background-color: transparent;
  }
   td.el-table__cell, 
   th.el-table__cell.is-leaf{
    border: none;
  }
  th, tr{
    border: 0;
    background-color: transparent;
  }
  tbody tr:hover>td {
    background-color:transparent;
  }
  .el-table__body tr.hover-row>td {
    background-color: transparent;
  }
  .table--row1{
    background: rgba(24, 77, 131, 0.7);
    border: 1px solid #30FEED;
  }
  .table--row2{
    background: rgba(24, 131, 115, 0.7);
    border: 1px solid #30C6FE;
  }
}
</style>
