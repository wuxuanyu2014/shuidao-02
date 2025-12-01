<template>
  <div class="orders-management">
    <div class="page-header">
      <h3>订单管理</h3>
      <div class="header-actions">
        <el-button type="primary" size="small" @click="refreshOrders" :loading="loading">
          <i class="el-icon-refresh"></i> 刷新
        </el-button>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="订单类型">
          <el-select v-model="filterForm.orderType" placeholder="全部类型" clearable>
            <el-option label="农机服务" value="machinery"></el-option>
            <el-option label="农技服务" value="technology"></el-option>
            <el-option label="农机维修" value="repair"></el-option>
            <el-option label="农废回收" value="recycle"></el-option>
            <el-option label="学习咨询" value="study"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable>
            <el-option label="待处理" value="pending"></el-option>
            <el-option label="已完成" value="finish"></el-option>
            <el-option label="进行中" value="processing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="filterOrders">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 订单列表 -->
    <div class="orders-table">
      <el-table
        :data="filteredOrders"
        v-loading="loading"
        stripe
        style="width: 100%"
        :default-sort="{prop: 'createTime', order: 'descending'}"
      >
        <el-table-column prop="orderNo" label="订单号" width="280">
          <template slot-scope="scope">
            <span v-if="scope.row.orderNo">{{ scope.row.orderNo }}</span>
            <span v-else class="text-muted">{{ scope.row._id.substring(0, 8) }}...</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="orderTypeName" label="订单类型" width="220">
          <template slot-scope="scope">
            <el-tag :type="getOrderTypeColor(scope.row.orderType)" size="small">
              {{ scope.row.orderTypeName || '未知类型' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="contactName" label="联系人" width="200">
          <template slot-scope="scope">
            {{ scope.row.contactName || scope.row.name || '-' }}
          </template>
        </el-table-column>
        
        <el-table-column prop="contactPhone" label="联系电话" width="230">
          <template slot-scope="scope">
            {{ scope.row.contactPhone || scope.row.phone || '-' }}
          </template>
        </el-table-column>
        
        <el-table-column prop="statusName" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getStatusColor(scope.row.status)" size="small">
              {{ scope.row.statusName }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="createTimeFormatted" label="创建时间">
        </el-table-column>
        
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewOrder(scope.row)">
              查看详情
            </el-button>
            <el-button 
              v-if="scope.row.status !== 'completed' && scope.row.status !== 'finish'"
              type="success" 
              size="small" 
              @click="completeOrder(scope.row)"
              :loading="scope.row._completing"
            >
              完成
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      >
      </el-pagination>
    </div>

    <!-- 订单详情弹窗 -->
    <el-dialog
      title="订单详情"
      :visible.sync="orderDetailVisible"
      width="60%"
      @close="closeOrderDetail"
    >
      <div v-if="currentOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">
            {{ currentOrder.orderNo || currentOrder._id }}
          </el-descriptions-item>
          <el-descriptions-item label="订单类型">
            <el-tag :type="getOrderTypeColor(currentOrder.orderType)" size="small">
              {{ currentOrder.orderTypeName }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusColor(currentOrder.status)" size="small">
              {{ currentOrder.statusName }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ currentOrder.createTimeFormatted }}
          </el-descriptions-item>
          <el-descriptions-item label="联系人">
            {{ currentOrder.contactName || currentOrder.name || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ currentOrder.contactPhone || currentOrder.phone || '-' }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 根据订单类型显示不同的详细信息 -->
        <div class="order-type-details" style="margin-top: 20px;">
          <!-- 农机服务 -->
          <div v-if="currentOrder.orderType === 'machinery'">
            <h4>农机服务详情</h4>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="作物类型">{{ currentOrder.cropType || '-' }}</el-descriptions-item>
              <el-descriptions-item label="服务类型">{{ currentOrder.serviceType || '-' }}</el-descriptions-item>
              <el-descriptions-item label="服务日期">{{ currentOrder.serviceDate || '-' }}</el-descriptions-item>
              <el-descriptions-item label="作业面积">{{ currentOrder.area || '-' }} 亩</el-descriptions-item>
              <el-descriptions-item label="备注" :span="2">{{ currentOrder.remark || '-' }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 农技服务 -->
          <div v-if="currentOrder.orderType === 'technology'">
            <h4>农技服务详情</h4>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="作物类型">{{ currentOrder.cropType || '-' }}</el-descriptions-item>
              <el-descriptions-item label="服务类型">{{ currentOrder.serviceType || '-' }}</el-descriptions-item>
              <el-descriptions-item label="服务日期">{{ currentOrder.serviceDate || '-' }}</el-descriptions-item>
              <el-descriptions-item label="服务面积">{{ currentOrder.area || '-' }} 亩</el-descriptions-item>
              <el-descriptions-item label="备注" :span="2">{{ currentOrder.remark || '-' }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 农机维修 -->
          <div v-if="currentOrder.orderType === 'repair'">
            <h4>农机维修详情</h4>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="机械类型">{{ currentOrder.machineType || '-' }}</el-descriptions-item>
              <el-descriptions-item label="维修类型">{{ currentOrder.repairType || '-' }}</el-descriptions-item>
              <el-descriptions-item label="紧急程度">{{ currentOrder.urgencyLevel || '-' }}</el-descriptions-item>
              <el-descriptions-item label="机械型号">{{ currentOrder.machineModel || '-' }}</el-descriptions-item>
              <el-descriptions-item label="故障描述" :span="2">{{ currentOrder.faultDescription || '-' }}</el-descriptions-item>
              <el-descriptions-item label="服务地址" :span="2">{{ currentOrder.address || '-' }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 农废回收 -->
          <div v-if="currentOrder.orderType === 'recycle'">
            <h4>农废回收详情</h4>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="废料类型">{{ currentOrder.wasteType || '-' }}</el-descriptions-item>
              <el-descriptions-item label="功能类型">{{ currentOrder.functionType || '-' }}</el-descriptions-item>
              <el-descriptions-item label="问题描述" :span="2">{{ currentOrder.problem || '-' }}</el-descriptions-item>
              <el-descriptions-item label="地址" :span="2">{{ currentOrder.address || '-' }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 学习咨询 -->
          <div v-if="currentOrder.orderType === 'study' || currentOrder.type === 'study'">
            <h4>学习咨询详情</h4>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="学习类型">{{ currentOrder.studyType || '-' }}</el-descriptions-item>
              <el-descriptions-item label="角色">{{ currentOrder.role || '-' }}</el-descriptions-item>
              <el-descriptions-item label="预约时间">{{ currentOrder.appointmentTime || '-' }}</el-descriptions-item>
              <el-descriptions-item label="问题描述" :span="2">{{ currentOrder.question || '-' }}</el-descriptions-item>
              <el-descriptions-item label="备注" :span="2">{{ currentOrder.remark || '-' }}</el-descriptions-item>
              <el-descriptions-item v-if="currentOrder.evaluate" label="评价" :span="2">{{ currentOrder.evaluate }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeOrderDetail">关闭</el-button>
        <el-button type="primary" @click="updateOrderStatus">更新状态</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OrdersManagement',
  data() {
    return {
      loading: false,
      orders: [],
      filteredOrders: [],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      },
      filterForm: {
        orderType: '',
        status: ''
      },
      orderDetailVisible: false,
      currentOrder: null
    }
  },
  mounted() {
    this.loadOrders()
  },
  methods: {
    // 加载订单数据
    async loadOrders() {
      this.loading = true
      try {
        const requestData = {
          page: 1,
          pageSize: 100
        }
        
        console.log('订单管理请求数据:', requestData)
        
        const response = await axios({
          method: 'post',
          url: '/api/getAllOrders',
          data: requestData,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        console.log('订单管理API响应:', response.data)
        let ordersData = null
        if (response.data && response.data.success === true && response.data.data && response.data.data.orders) {
          ordersData = response.data.data.orders
        } else if (response.data && response.data.orders) {
          ordersData = response.data.orders
        }
        if (ordersData) {
          this.orders = JSON.parse(JSON.stringify(ordersData || []))
          console.log('成功加载订单数量:', this.orders.length)
          this.applyOrderFilters()
          this.$message.success(`成功加载 ${this.orders.length} 条订单数据`)
        } else {
          console.error('API返回数据格式异常:', response.data)
          this.$message.error('获取订单数据失败：数据格式异常')
        }
      } catch (error) {
        console.error('网络请求异常:', error)
        this.$message.error('网络请求失败：' + error.message)
      } finally {
        this.loading = false
      }
    },

    // 刷新订单
    refreshOrders() {
      this.loadOrders()
    },

    // 应用订单过滤
    applyOrderFilters() {
      let filtered = [...this.orders]
      
      // 按订单类型过滤
      if (this.filterForm.orderType) {
        filtered = filtered.filter(order => order.orderType === this.filterForm.orderType)
        console.log('按订单类型过滤后数量:', filtered.length)
      }
      
      // 按状态过滤
      if (this.filterForm.status) {
        filtered = filtered.filter(order => order.status === this.filterForm.status)
        console.log('按状态过滤后数量:', filtered.length)
      }
      
      this.filteredOrders = JSON.parse(JSON.stringify(filtered))
      
      // 更新分页信息
      this.pagination.total = filtered.length
      this.pagination.totalPages = Math.ceil(filtered.length / this.pagination.pageSize)
      this.pagination.page = 1 // 重置到第一页
      
      console.log('过滤完成，显示数量:', filtered.length)
    },

    // 筛选订单
    filterOrders() {
      this.applyOrderFilters()
      this.$message.success('筛选完成')
    },

    // 重置筛选
    resetFilter() {
      this.filterForm = {
        orderType: '',
        status: ''
      }
      this.filteredOrders = [...this.orders]
    },

    // 分页处理
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.pagination.page = 1
      this.applyOrderFilters()
    },

    handleCurrentChange(val) {
      this.pagination.page = val
    },

    // 查看订单详情
    viewOrder(order) {
      // 确保获取最新的订单数据
      const latestOrder = this.filteredOrders.find(o => o._id === order._id) || order
      this.currentOrder = latestOrder
      this.orderDetailVisible = true
    },

    // 关闭订单详情
    closeOrderDetail() {
      this.orderDetailVisible = false
      this.currentOrder = null
    },

    // 完成订单
    async completeOrder(order) {
      this.$confirm(`确认将订单 ${order.orderNo || order._id} 标记为已完成吗？`, '确认操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 设置加载状态
        this.$set(order, '_completing', true)
        
        try {
          const requestData = {
            orderId: order._id,
            adminUserId: 'admin', // 管理员用户ID
            remark: '管理员手动完成' // 完成备注
          }
          
          console.log('完成订单请求数据:', requestData)
          
          const response = await axios({
            method: 'post',
            url: '/api/completeOrder',
            data: requestData,
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
          console.log('完成订单API响应:', response.data)
          
          if (response.data && response.data.success === true) {
            this.$message.success('订单已完成！')
            
            // 更新本地订单状态
            order.status = 'completed'
            order.statusName = '已完成'
            order.completeTime = response.data.data?.completeTime || new Date().toISOString()
            
            // 更新原始订单数据中的状态
            const originalOrder = this.orders.find(o => o._id === order._id)
            if (originalOrder) {
              originalOrder.status = 'completed'
              originalOrder.statusName = '已完成'
              originalOrder.completeTime = order.completeTime
            }
            
            // 如果当前查看的是这个订单的详情，也要更新详情中的状态
            if (this.currentOrder && this.currentOrder._id === order._id) {
              this.currentOrder.status = 'completed'
              this.currentOrder.statusName = '已完成'
              this.currentOrder.completeTime = order.completeTime
            }
            
            // 重新应用过滤器以更新显示
            this.applyOrderFilters()
          } else {
            console.error('完成订单失败:', response.data)
            this.$message.error('完成订单失败：' + (response.data?.message || '未知错误'))
          }
        } catch (error) {
          console.error('完成订单网络请求失败:', error)
          this.$message.error('网络请求失败：' + error.message)
        } finally {
          // 清除加载状态
          this.$set(order, '_completing', false)
        }
      }).catch(() => {
        // 用户取消操作
        console.log('用户取消完成订单操作')
      })
    },

    // 更新订单状态
    updateOrderStatus() {
      this.$message.info('订单状态更新功能开发中...')
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
    },

    // 获取状态颜色
    getStatusColor(status) {
      const colorMap = {
        'pending': 'warning',
        'processing': 'primary',
        'finish': 'success',
        'cancelled': 'danger'
      }
      return colorMap[status] || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.orders-management {
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

  .orders-table {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .text-muted {
      color: #999;
    }
  }

  .pagination-container {
    margin-top: 16px;
    text-align: right;
  }

  .order-detail {
    .order-type-details {
      h4 {
        margin: 16px 0;
        color: #333;
        font-size: 16px;
      }
    }
  }
}
</style> 