<template>
  <div class="comments-management">
    <div class="page-header">
      <h3>评论管理</h3>
      <div class="header-actions">
        <el-button type="primary" size="small" @click="refreshComments" :loading="commentsLoading">
          <i class="el-icon-refresh"></i> 刷新
        </el-button>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="commentFilterForm" class="filter-form">
        <el-form-item label="审核状态">
          <el-checkbox v-model="commentFilterForm.isChecked">只显示已审核</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="filterComments">筛选</el-button>
          <el-button @click="resetCommentFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 评价列表 -->
    <div class="comments-table">
      <el-table
        :data="filteredComments"
        v-loading="commentsLoading"
        stripe
        style="width: 100%"
        :default-sort="{prop: 'createTime', order: 'descending'}"
      >
        <el-table-column prop="orderNo" label="订单号" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.orderNo">{{ scope.row.orderNo }}</span>
            <span v-else class="text-muted">{{ scope.row._id.substring(0, 8) }}...</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="orderTypeName" label="订单类型" width="120">
          <template slot-scope="scope">
            <el-tag :type="getOrderTypeColor(scope.row.orderType)" size="small">
              {{ scope.row.orderTypeName || '未知类型' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="evaluate" label="评价内容" min-width="200">
          <template slot-scope="scope">
            <div class="evaluate-content">
              {{ scope.row.evaluate || '-' }}
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="evaluateTimeFormatted" label="评价时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.evaluateTimeFormatted || '-' }}
          </template>
        </el-table-column>
        
        <el-table-column prop="score" label="评价分数" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.score !== undefined && scope.row.score !== null" class="score-display">
              {{ scope.row.score }} 分
            </span>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="auditStatus" label="审核状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isAudited ? 'success' : 'warning'" size="small">
              {{ scope.row.auditStatus || (scope.row.isAudited ? '已审核' : '待审核') }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="130" fixed="right">
          <template slot-scope="scope">
            <el-button 
              :type="scope.row.isAudited ? 'warning' : 'primary'" 
              size="small" 
              @click="toggleCheckStatus(scope.row)"
              :loading="scope.row._submitting"
            >
              {{ scope.row.isAudited ? '反审核' : '审核' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        @size-change="handleCommentSizeChange"
        @current-change="handleCommentCurrentChange"
        :current-page="commentPagination.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="commentPagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="commentPagination.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CommentsManagement',
  data() {
    return {
      commentsLoading: false,
      comments: [],
      filteredComments: [],
      commentPagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      },
      commentFilterForm: {
        isChecked: false
      }
    }
  },
  mounted() {
    this.loadComments()
  },
  methods: {
    // 加载评论数据
    async loadComments() {
      this.commentsLoading = true
      try {
        const requestData = {
          page: 1,
          pageSize: 1000
        }
        console.log('评论管理请求数据:', requestData)
        const response = await axios({
          method: 'post',
          url: '/api/getAllOrders',
          data: requestData,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        console.log('评论管理API响应:', response.data)
        let ordersData = null
        if (response.data && response.data.success === true && response.data.data && response.data.data.orders) {
          ordersData = response.data.data.orders
        } else if (response.data && response.data.orders) {
          ordersData = response.data.orders
        }
        if (ordersData) {
          const allOrders = JSON.parse(JSON.stringify(ordersData || []))
          console.log('API返回的订单数量:', allOrders.length)
          this.applyCommentFilters(allOrders)
          if (this.filteredComments.length === 0) {
            this.$message.info('暂无评价数据')
          } else {
            this.$message.success(`加载了 ${this.filteredComments.length} 条评价数据`)
          }
        } else {
          console.error('评论管理API返回数据格式异常:', response.data)
          this.$message.error('获取评论数据失败：数据格式异常')
        }
      } catch (error) {
        console.error('加载评论失败:', error)
        this.$message.error('网络请求失败：' + error.message)
      } finally {
        this.commentsLoading = false
      }
    },

    // 刷新评论
    refreshComments() {
      this.loadComments()
    },

    // 应用评论过滤
    applyCommentFilters(allOrders) {
      let filtered = allOrders
      
      // 筛选有评价的订单
      filtered = filtered.filter(order => {
        const hasEvaluated = order.evaluate && order.evaluate.trim() !== ''
        console.log(`订单 ${order._id} 评价状态:`, hasEvaluated, '评价内容:', order.evaluate)
        return hasEvaluated
      })
      
      console.log('有评价的订单数量:', filtered.length)
      
      // 如果勾选了"只显示已审核"，进一步筛选
      if (this.commentFilterForm.isChecked) {
        filtered = filtered.filter(order => order.isAudited === true)
        console.log('已审核的订单数量:', filtered.length)
      }
      
      // 处理评论数据
      this.comments = filtered.map(order => ({
        ...order,
        checkStatus: order.isAudited ? 1 : 0, // 兼容原有的checkStatus逻辑
        _submitting: false // 用于按钮loading状态
      }))
      
      // 使用深拷贝避免引用问题
      this.filteredComments = JSON.parse(JSON.stringify(this.comments))
      
      // 更新分页信息
      this.commentPagination.total = filtered.length
      this.commentPagination.totalPages = Math.ceil(filtered.length / this.commentPagination.pageSize)
      this.commentPagination.page = 1 // 重置到第一页
      
      console.log('评论过滤完成，显示数量:', filtered.length)
    },

    // 筛选评论
    filterComments() {
      this.loadComments() // 重新加载数据并应用过滤
    },

    // 重置评论筛选
    resetCommentFilter() {
      this.commentFilterForm = {
        isChecked: false
      }
      this.commentPagination.page = 1
      this.loadComments()
    },

    // 切换审核状态
    async toggleCheckStatus(order) {
      if (order._submitting) return
      
      // 设置按钮loading状态
      this.$set(order, '_submitting', true)
      
      try {
        const newStatus = order.isAudited ? 0 : 1
        
        console.log('审核操作调试信息:', {
          orderId: order._id,
          orderIdType: typeof order._id,
          orderIdLength: order._id ? order._id.length : 0,
          newStatus: newStatus,
          orderData: order
        })
        
        if (!order._id) {
          this.$message.error('订单ID不存在，无法进行审核操作')
          return
        }
        
        const requestData = {
          orderId: order._id,
          checkStatus: newStatus
        }
        
        console.log('提交的审核数据:', requestData)
        
        if (!order._id || typeof order._id !== 'string' || order._id.trim() === '') {
          this.$message.error('订单ID格式无效，无法进行审核操作')
          return
        }
        
        const response = await axios({
          method: 'post',
          url: '/api/submitEvaluate',
          data: requestData,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        console.log('审核API响应:', response.data)
        
        if (response.data && response.data.success === true) {
          // 更新本地状态
          order.isAudited = newStatus === 1
          order.checkStatus = newStatus
          order.auditStatus = newStatus === 1 ? '已审核' : '未审核'
          this.$message.success(newStatus === 1 ? '审核成功！' : '反审核成功！')
        } else {
          console.error('审核API返回失败:', response.data)
          const errorMessage = response.data?.error || response.data?.message || '未知错误'
          this.$message.error('操作失败：' + errorMessage)
        }
      } catch (error) {
        console.error('审核操作失败:', error)
        this.$message.error('网络请求失败：' + error.message)
      } finally {
        this.$set(order, '_submitting', false)
      }
    },

    // 评论分页处理
    handleCommentSizeChange(val) {
      this.commentPagination.pageSize = val
      this.commentPagination.page = 1
      this.loadComments()
    },

    handleCommentCurrentChange(val) {
      this.commentPagination.page = val
      this.loadComments()
    },

    // 获取订单类型颜色
    getOrderTypeColor(type) {
      const colorMap = {
        'machinery': 'primary',
        'technology': 'success',
        'repair': 'warning',
        'recycle': 'info',
        'study': 'danger'
      }
      return colorMap[type] || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.comments-management {
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e8e8e8;

    h3 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }
  }

  .filter-section {
    background: #fff;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;

    .filter-form {
      margin: 0;
    }
  }

  .comments-table {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .evaluate-content {
      max-height: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      line-height: 1.4;
      word-break: break-all;
    }

    .text-muted {
      color: #999;
    }

    .score-display {
      font-weight: 600;
      color: #e6a23c;
      background: #fdf6ec;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
  }

  .pagination-container {
    margin-top: 16px;
    text-align: right;
  }
}
</style> 