<template>
  <div class="suggestions-management">
    <div class="page-header">
      <h3>意见咨询管理</h3>
      <div class="header-actions">
        <el-button type="primary" size="small" @click="refreshSuggestions" :loading="suggestionsLoading">
          <i class="el-icon-refresh"></i> 刷新
        </el-button>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="suggestionFilterForm" class="filter-form">
        <el-form-item label="类型">
          <el-select v-model="suggestionFilterForm.type" placeholder="全部类型" clearable>
            <el-option label="补贴咨询" value="subsidy"></el-option>
            <el-option label="功能建议" value="function"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="suggestionFilterForm.status" placeholder="全部状态" clearable>
            <el-option label="待处理" value="pending"></el-option>
            <el-option label="处理中" value="processing"></el-option>
            <el-option label="已完成" value="completed"></el-option>
            <el-option label="已拒绝" value="rejected"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="匿名状态">
          <el-select v-model="suggestionFilterForm.isAnonymous" placeholder="全部" clearable>
            <el-option label="实名" :value="false"></el-option>
            <el-option label="匿名" :value="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="filterSuggestions">筛选</el-button>
          <el-button @click="resetSuggestionFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 意见咨询列表 -->
    <div class="suggestions-table">
      <el-table
        :data="filteredSuggestions"
        v-loading="suggestionsLoading"
        stripe
        style="width: 100%"
        :default-sort="{prop: 'createTime', order: 'descending'}"
      >
        <el-table-column prop="_id" label="ID" width="180">
          <template slot-scope="scope">
            <span class="text-muted">{{ scope.row._id.substring(0, 8) }}...</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="typeText" label="类型" width="120">
          <template slot-scope="scope">
            <el-tag :type="getSuggestionTypeColor(scope.row.type)" size="small">
              {{ scope.row.typeText || '未知类型' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="content" label="内容" min-width="300">
          <template slot-scope="scope">
            <div class="suggestion-content">
              {{ scope.row.content || '-' }}
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getSuggestionStatusColor(scope.row.status)" size="small">
              {{ getSuggestionStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="isAnonymous" label="匿名状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isAnonymous ? 'info' : 'success'" size="small">
              {{ scope.row.isAnonymous ? '匿名' : '实名' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="createTimeFormatted" label="提交时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.createTimeFormatted || '-' }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewSuggestion(scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSuggestionSizeChange"
        @current-change="handleSuggestionCurrentChange"
        :current-page="suggestionPagination.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="suggestionPagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="suggestionPagination.total"
      >
      </el-pagination>
    </div>

    <!-- 意见咨询详情弹窗 -->
    <el-dialog
      title="意见咨询详情"
      :visible.sync="suggestionDetailVisible"
      width="60%"
      @close="closeSuggestionDetail"
    >
      <div v-if="currentSuggestion" class="suggestion-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="ID">
            {{ currentSuggestion._id }}
          </el-descriptions-item>
          <el-descriptions-item label="类型">
            <el-tag :type="getSuggestionTypeColor(currentSuggestion.type)" size="small">
              {{ currentSuggestion.typeText || '未知类型' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getSuggestionStatusColor(currentSuggestion.status)" size="small">
              {{ getSuggestionStatusText(currentSuggestion.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="匿名状态">
            <el-tag :type="currentSuggestion.isAnonymous ? 'info' : 'success'" size="small">
              {{ currentSuggestion.isAnonymous ? '匿名' : '实名' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="提交时间">
            {{ currentSuggestion.createTimeFormatted }}
          </el-descriptions-item>
          <el-descriptions-item v-if="!currentSuggestion.isAnonymous && currentSuggestion.contact" label="联系方式">
            {{ currentSuggestion.contact }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 意见内容 -->
        <div class="suggestion-content-detail" style="margin-top: 20px;">
          <h4>意见内容</h4>
          <el-card>
            <div class="content-text">
              {{ currentSuggestion.content || '暂无内容' }}
            </div>
          </el-card>
        </div>
      </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSuggestionDetail">关闭</el-button>
        <el-button type="primary" @click="updateSuggestionStatus">更新状态</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SuggestionsManagement',
  data() {
    return {
      // 意见咨询相关数据
      suggestionsLoading: false,
      suggestions: [],
      filteredSuggestions: [],
      suggestionPagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      },
      suggestionFilterForm: {
        type: '',
        status: '',
        isAnonymous: null
      },
      suggestionDetailVisible: false,
      currentSuggestion: null
    }
  },
  mounted() {
    this.loadSuggestions();
  },
  methods: {
    // 加载意见咨询数据
    async loadSuggestions() {
      this.suggestionsLoading = true;
      try {
        const requestData = {
          page: this.suggestionPagination.page,
          pageSize: this.suggestionPagination.pageSize,
          isAdmin: true // 管理员权限
        };
        
        console.log('意见咨询请求数据:', requestData);
        
        const response = await axios({
          method: 'post',
          url: '/api/getSuggestList',
          data: requestData,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('意见咨询API响应:', response.data);
        
        let suggestionsData = null;
        if (response.data && response.data.success === true && response.data.data && response.data.data.list) {
          suggestionsData = response.data.data.list;
          this.suggestionPagination = response.data.data.pagination || this.suggestionPagination;
        } else if (response.data && response.data.list) {
          suggestionsData = response.data.list;
        }
        
        if (suggestionsData) {
          // 处理时间格式
          this.suggestions = suggestionsData.map(item => ({
            ...item,
            createTimeFormatted: this.formatTime(item.createTime)
          }));
          
          this.filteredSuggestions = [...this.suggestions];
          console.log('成功加载意见咨询数量:', this.suggestions.length);
          this.$message.success(`成功加载 ${this.suggestions.length} 条意见咨询数据`);
        } else {
          console.error('意见咨询API返回数据格式异常:', response.data);
          this.$message.error('获取意见咨询数据失败：数据格式异常');
        }
      } catch (error) {
        console.error('网络请求异常:', error);
        this.$message.error('网络请求失败：' + error.message);
      } finally {
        this.suggestionsLoading = false;
      }
    },

    // 刷新意见咨询
    refreshSuggestions() {
      this.loadSuggestions();
    },

    // 筛选意见咨询
    filterSuggestions() {
      let filtered = [...this.suggestions];
      
      // 按类型过滤
      if (this.suggestionFilterForm.type) {
        filtered = filtered.filter(item => item.type === this.suggestionFilterForm.type);
      }
      
      // 按状态过滤
      if (this.suggestionFilterForm.status) {
        filtered = filtered.filter(item => item.status === this.suggestionFilterForm.status);
      }
      
      // 按匿名状态过滤
      if (this.suggestionFilterForm.isAnonymous !== null) {
        filtered = filtered.filter(item => item.isAnonymous === this.suggestionFilterForm.isAnonymous);
      }
      
      this.filteredSuggestions = filtered;
      this.suggestionPagination.total = filtered.length;
      this.suggestionPagination.totalPages = Math.ceil(filtered.length / this.suggestionPagination.pageSize);
      this.suggestionPagination.page = 1;
      
      this.$message.success('筛选完成');
    },

    // 重置意见咨询筛选
    resetSuggestionFilter() {
      this.suggestionFilterForm = {
        type: '',
        status: '',
        isAnonymous: null
      };
      this.filteredSuggestions = [...this.suggestions];
      this.suggestionPagination.total = this.suggestions.length;
      this.suggestionPagination.totalPages = Math.ceil(this.suggestions.length / this.suggestionPagination.pageSize);
      this.suggestionPagination.page = 1;
    },

    // 查看意见咨询详情
    viewSuggestion(suggestion) {
      this.currentSuggestion = suggestion;
      this.suggestionDetailVisible = true;
    },

    // 关闭意见咨询详情
    closeSuggestionDetail() {
      this.suggestionDetailVisible = false;
      this.currentSuggestion = null;
    },

    // 更新意见咨询状态
    updateSuggestionStatus() {
      this.$message.info('意见咨询状态更新功能开发中...');
    },

    // 获取意见咨询类型颜色
    getSuggestionTypeColor(type) {
      const colorMap = {
        'subsidy': 'primary',
        'function': 'success',
        'other': 'info'
      };
      return colorMap[type] || '';
    },

    // 获取意见咨询状态颜色
    getSuggestionStatusColor(status) {
      const colorMap = {
        'pending': 'warning',
        'processing': 'primary',
        'completed': 'success',
        'rejected': 'danger'
      };
      return colorMap[status] || '';
    },

    // 获取意见咨询状态文本
    getSuggestionStatusText(status) {
      const textMap = {
        'pending': '待处理',
        'processing': '处理中',
        'completed': '已完成',
        'rejected': '已拒绝'
      };
      return textMap[status] || '未知状态';
    },

    // 意见咨询分页处理
    handleSuggestionSizeChange(val) {
      this.suggestionPagination.pageSize = val;
      this.suggestionPagination.page = 1;
      this.loadSuggestions();
    },

    handleSuggestionCurrentChange(val) {
      this.suggestionPagination.page = val;
      this.loadSuggestions();
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
    }
  }
}
</script>

<style lang="scss" scoped>
.suggestions-management {
  .suggestions-table {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .suggestion-content {
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
  }
}

.suggestion-detail {
  .suggestion-content-detail {
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