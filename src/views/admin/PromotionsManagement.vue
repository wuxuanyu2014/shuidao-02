<template>
  <div class="promotions-management">
    <div class="page-header">
      <h3>推广资讯管理</h3>
      <div class="header-actions">
        <el-button type="success" size="small" @click="showCreatePromotionDialog">
          <i class="el-icon-plus"></i> 新增资讯
        </el-button>
        <el-button type="primary" size="small" @click="refreshPromotions" :loading="promotionsLoading">
          <i class="el-icon-refresh"></i> 刷新
        </el-button>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="promotionFilterForm" class="filter-form">
        <el-form-item label="类型">
          <el-select v-model="promotionFilterForm.type" placeholder="全部类型" clearable>
            <el-option label="促销" value="promotion"></el-option>
            <el-option label="政策咨询" value="consulting"></el-option>
            <el-option label="政策农险" value="insurance"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="promotionFilterForm.status" placeholder="全部状态" clearable>
            <el-option label="激活" value="active"></el-option>
            <el-option label="禁用" value="inactive"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="promotionFilterForm.keyword" placeholder="搜索标题和内容" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="filterPromotions">筛选</el-button>
          <el-button @click="resetPromotionFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 推广资讯列表 -->
    <div class="promotions-table">
      <el-table
        :data="filteredPromotions"
        v-loading="promotionsLoading"
        stripe
        style="width: 100%"
        :default-sort="{prop: 'createTime', order: 'descending'}"
      >
        <el-table-column prop="_id" label="ID" width="180">
          <template slot-scope="scope">
            <span class="text-muted">{{ scope.row._id.substring(0, 8) }}...</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="title" label="标题" min-width="200">
          <template slot-scope="scope">
            <div class="promotion-title">
              {{ scope.row.title || '-' }}
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="type" label="类型" width="120">
          <template slot-scope="scope">
            <el-tag :type="getPromotionTypeColor(scope.row.type)" size="small">
              {{ getPromotionTypeText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="content" label="内容" min-width="300">
          <template slot-scope="scope">
            <div class="promotion-content">
              {{ scope.row.content || '-' }}
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getPromotionStatusColor(scope.row.status)" size="small">
              {{ getPromotionStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="expire_date" label="过期时间" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.expire_date" :class="{ 'expired': scope.row.isExpired }">
              {{ formatDate(scope.row.expire_date) }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="createTimeFormatted" label="创建时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.createTimeFormatted || '-' }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewPromotion(scope.row)">
              查看
            </el-button>
            <el-button type="text" size="small" @click="editPromotion(scope.row)">
              编辑
            </el-button>
            <el-button type="text" size="small" style="color: #F56C6C;" @click="deletePromotion(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        @size-change="handlePromotionSizeChange"
        @current-change="handlePromotionCurrentChange"
        :current-page="promotionPagination.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="promotionPagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="promotionPagination.total"
      >
      </el-pagination>
    </div>

    <!-- 推广资讯表单弹窗 -->
    <el-dialog
      :title="promotionFormTitle"
      :visible.sync="promotionFormVisible"
      width="60%"
      @close="closePromotionForm"
    >
      <el-form 
        :model="promotionForm" 
        :rules="promotionFormRules" 
        ref="promotionForm" 
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="promotionForm.title" placeholder="请输入资讯标题"></el-input>
        </el-form-item>
        
        <el-form-item label="类型" prop="type">
          <el-select v-model="promotionForm.type" placeholder="请选择资讯类型">
            <el-option label="促销" value="promotion"></el-option>
            <el-option label="政策咨询" value="consulting"></el-option>
            <el-option label="政策农险" value="insurance"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="内容" prop="content">
          <el-input 
            type="textarea" 
            :rows="6" 
            v-model="promotionForm.content" 
            placeholder="请输入资讯内容"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="图片URL">
          <el-input v-model="promotionForm.imageUrl" placeholder="请输入图片URL（可选）"></el-input>
        </el-form-item>
        
        <el-form-item label="过期时间">
          <el-date-picker
            v-model="promotionForm.expire_date"
            type="date"
            placeholder="选择过期时间（可选）"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="promotionForm.status">
            <el-radio label="active">激活</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="closePromotionForm">取消</el-button>
        <el-button type="primary" @click="submitPromotionForm" :loading="promotionFormLoading">
          {{ isEditMode ? '更新' : '创建' }}
        </el-button>
      </div>
    </el-dialog>

    <!-- 推广资讯详情弹窗 -->
    <el-dialog
      title="推广资讯详情"
      :visible.sync="promotionDetailVisible"
      width="60%"
      @close="closePromotionDetail"
    >
      <div v-if="currentPromotion" class="promotion-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="ID">
            {{ currentPromotion._id }}
          </el-descriptions-item>
          <el-descriptions-item label="标题">
            {{ currentPromotion.title }}
          </el-descriptions-item>
          <el-descriptions-item label="类型">
            <el-tag :type="getPromotionTypeColor(currentPromotion.type)" size="small">
              {{ getPromotionTypeText(currentPromotion.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getPromotionStatusColor(currentPromotion.status)" size="small">
              {{ getPromotionStatusText(currentPromotion.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ currentPromotion.createTimeFormatted }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ currentPromotion.updateTimeFormatted || '-' }}
          </el-descriptions-item>
          <el-descriptions-item v-if="currentPromotion.expire_date" label="过期时间">
            <span :class="{ 'expired': currentPromotion.isExpired }">
              {{ formatDate(currentPromotion.expire_date) }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item v-if="currentPromotion.imageUrl" label="图片URL">
            <a :href="currentPromotion.imageUrl" target="_blank">{{ currentPromotion.imageUrl }}</a>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 资讯内容 -->
        <div class="promotion-content-detail" style="margin-top: 20px;">
          <h4>资讯内容</h4>
          <el-card>
            <div class="content-text">
              {{ currentPromotion.content || '暂无内容' }}
            </div>
          </el-card>
        </div>
      </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="closePromotionDetail">关闭</el-button>
        <el-button type="primary" @click="editPromotion(currentPromotion)">编辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PromotionsManagement',
  data() {
    return {
      // 推广资讯相关数据
      promotionsLoading: false,
      promotions: [],
      filteredPromotions: [],
      promotionPagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      },
      promotionFilterForm: {
        type: '',
        status: '',
        keyword: ''
      },
      promotionFormVisible: false,
      promotionDetailVisible: false,
      currentPromotion: null,
      isEditMode: false,
      promotionFormLoading: false,
      promotionForm: {
        title: '',
        content: '',
        type: '',
        imageUrl: '',
        expire_date: '',
        status: 'active'
      },
      promotionFormRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.loadPromotions();
  },
  computed: {
    // 计算属性：推广资讯表单标题
    promotionFormTitle() {
      return this.isEditMode ? '编辑推广资讯' : '新增推广资讯';
    }
  },
  methods: {
    // 加载推广资讯数据
    async loadPromotions() {
      this.promotionsLoading = true;
      try {
        const requestData = {
          isAdmin: true,
          page: this.promotionPagination.page,
          pageSize: this.promotionPagination.pageSize
        };
        
        // 添加筛选条件
        if (this.promotionFilterForm.type) {
          requestData.type = this.promotionFilterForm.type;
        }
        if (this.promotionFilterForm.status) {
          requestData.status = this.promotionFilterForm.status;
        }
        if (this.promotionFilterForm.keyword) {
          requestData.keyword = this.promotionFilterForm.keyword;
        }
        
        console.log('推广资讯请求数据:', requestData);
        
        const response = await axios({
          method: 'post',
          url: '/api/getInfoList',
          data: requestData,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('推广资讯API响应:', response.data);
        
        let promotionsData = null;
        if (response.data && response.data.success === true && response.data.data && response.data.data.list) {
          promotionsData = response.data.data.list;
          this.promotionPagination = response.data.data.pagination || this.promotionPagination;
        } else if (response.data && response.data.list) {
          promotionsData = response.data.list;
        }
        
        if (promotionsData) {
          // 处理时间格式
          this.promotions = promotionsData.map(item => ({
            ...item,
            createTimeFormatted: this.formatTime(item.createTime),
            updateTimeFormatted: this.formatTime(item.updateTime)
          }));
          
          this.filteredPromotions = [...this.promotions];
          console.log('成功加载推广资讯数量:', this.promotions.length);
          this.$message.success(`成功加载 ${this.promotions.length} 条推广资讯数据`);
        } else {
          console.error('推广资讯API返回数据格式异常:', response.data);
          this.$message.error('获取推广资讯数据失败：数据格式异常');
        }
      } catch (error) {
        console.error('网络请求异常:', error);
        this.$message.error('网络请求失败：' + error.message);
      } finally {
        this.promotionsLoading = false;
      }
    },

    // 刷新推广资讯
    refreshPromotions() {
      this.loadPromotions();
    },

    // 筛选推广资讯
    filterPromotions() {
      this.promotionPagination.page = 1;
      this.loadPromotions();
    },

    // 重置推广资讯筛选
    resetPromotionFilter() {
      this.promotionFilterForm = {
        type: '',
        status: '',
        keyword: ''
      };
      this.promotionPagination.page = 1;
      this.loadPromotions();
    },

    // 显示创建推广资讯弹窗
    showCreatePromotionDialog() {
      this.isEditMode = false;
      this.promotionForm = {
        title: '',
        content: '',
        type: '',
        imageUrl: '',
        expire_date: '',
        status: 'active'
      };
      this.promotionFormVisible = true;
    },

    // 编辑推广资讯
    editPromotion(promotion) {
      this.isEditMode = true;
      this.currentPromotion = promotion;
      this.promotionForm = {
        title: promotion.title || '',
        content: promotion.content || '',
        type: promotion.type || '',
        imageUrl: promotion.imageUrl || '',
        expire_date: promotion.expire_date ? this.formatDate(promotion.expire_date) : '',
        status: promotion.status || 'active'
      };
      this.promotionFormVisible = true;
    },

    // 查看推广资讯详情
    viewPromotion(promotion) {
      this.currentPromotion = promotion;
      this.promotionDetailVisible = true;
    },

    // 关闭推广资讯表单
    closePromotionForm() {
      this.promotionFormVisible = false;
      this.$refs.promotionForm && this.$refs.promotionForm.resetFields();
    },

    // 关闭推广资讯详情
    closePromotionDetail() {
      this.promotionDetailVisible = false;
      this.currentPromotion = null;
    },

    // 提交推广资讯表单
    async submitPromotionForm() {
      this.$refs.promotionForm.validate(async (valid) => {
        if (valid) {
          this.promotionFormLoading = true;
          try {
            const requestData = {
              isAdmin: true,
              ...this.promotionForm
            };
            
            if (this.isEditMode) {
              requestData._id = this.currentPromotion._id;
            }
            
            console.log('提交推广资讯数据:', requestData);
            
            const url = this.isEditMode 
              ? '/api/updateInfo'
              : '/api/createInfo';
            
            const response = await axios({
              method: 'post',
              url: url,
              data: requestData,
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            console.log('推广资讯操作响应:', response.data);
            
            if (response.data && response.data.success === true) {
              this.$message.success(this.isEditMode ? '推广资讯更新成功！' : '推广资讯创建成功！');
              this.closePromotionForm();
              this.loadPromotions();
            } else {
              console.error('推广资讯操作失败:', response.data);
              this.$message.error('操作失败：' + (response.data?.error || response.data?.message || '未知错误'));
            }
          } catch (error) {
            console.error('推广资讯操作异常:', error);
            this.$message.error('网络请求失败：' + error.message);
          } finally {
            this.promotionFormLoading = false;
          }
        }
      });
    },

    // 删除推广资讯
    deletePromotion(promotion) {
      this.$confirm(`确认删除推广资讯"${promotion.title}"吗？此操作不可恢复！`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const requestData = {
            isAdmin: true,
            _id: promotion._id
          };
          
          console.log('删除推广资讯请求:', requestData);
          
          const response = await axios({
            method: 'post',
            url: '/api/deleteInfo',
            data: requestData,
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          console.log('删除推广资讯响应:', response.data);
          
          if (response.data && response.data.success === true) {
            this.$message.success('推广资讯删除成功！');
            this.loadPromotions();
          } else {
            console.error('删除推广资讯失败:', response.data);
            this.$message.error('删除失败：' + (response.data?.error || response.data?.message || '未知错误'));
          }
        } catch (error) {
          console.error('删除推广资讯异常:', error);
          this.$message.error('网络请求失败：' + error.message);
        }
      }).catch(() => {
        // 用户取消删除
      });
    },

    // 获取推广资讯类型颜色
    getPromotionTypeColor(type) {
      const colorMap = {
        'promotion': 'primary',
        'consulting': 'success',
        'insurance': 'warning'
      };
      return colorMap[type] || '';
    },

    // 获取推广资讯类型文本
    getPromotionTypeText(type) {
      const textMap = {
        'promotion': '促销',
        'consulting': '政策咨询',
        'insurance': '政策农险'
      };
      return textMap[type] || '未知类型';
    },

    // 获取推广资讯状态颜色
    getPromotionStatusColor(status) {
      const colorMap = {
        'active': 'success',
        'inactive': 'info'
      };
      return colorMap[status] || '';
    },

    // 获取推广资讯状态文本
    getPromotionStatusText(status) {
      const textMap = {
        'active': '激活',
        'inactive': '禁用'
      };
      return textMap[status] || '未知状态';
    },

    // 推广资讯分页处理
    handlePromotionSizeChange(val) {
      this.promotionPagination.pageSize = val;
      this.promotionPagination.page = 1;
      this.loadPromotions();
    },

    handlePromotionCurrentChange(val) {
      this.promotionPagination.page = val;
      this.loadPromotions();
    },

    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return '-';
      try {
        const date = new Date(timeStr);
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      } catch (error) {
        return timeStr;
      }
    },

    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr) return '-';
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN');
      } catch (error) {
        return dateStr;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.promotions-management {
  .promotions-table {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .promotion-title {
      font-weight: 500;
      color: #333;
    }

    .promotion-content {
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

    .expired {
      color: #F56C6C;
      font-weight: 500;
    }
  }
}

.promotion-detail {
  .promotion-content-detail {
    .content-text {
      line-height: 1.6;
      word-break: break-all;
      white-space: pre-wrap;
    }
  }
}

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

.pagination-container {
  margin-top: 16px;
  text-align: right;
}
</style> 