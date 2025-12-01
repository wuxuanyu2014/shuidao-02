<template>
  <div class="admin-dashboard">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <h2>农事服务中心 - 后台管理</h2>
      </div>
      <div class="header-right">
        <span class="welcome">欢迎，管理员</span>
        <el-button type="danger" size="small" @click="logout">退出登录</el-button>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 侧边栏 -->
      <div class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          @select="handleMenuSelect"
        >
          <el-menu-item index="orders">
            <i class="el-icon-s-order"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
          <el-menu-item index="settings">
            <i class="el-icon-setting"></i>
            <span slot="title">系统配置</span>
          </el-menu-item>
          <el-menu-item index="comments">
            <i class="el-icon-chat-dot-round"></i>
            <span slot="title">评论管理</span>
          </el-menu-item>
          <el-menu-item index="suggestions">
            <i class="el-icon-s-comment"></i>
            <span slot="title">意见咨询</span>
          </el-menu-item>
          <el-menu-item index="promotions">
            <i class="el-icon-news"></i>
            <span slot="title">推广资讯</span>
          </el-menu-item>
          <el-menu-item index="delivery">
            <i class="el-icon-truck"></i>
            <span slot="title">农资配送</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 右侧内容区域 -->
      <div class="content-area">
        <!-- 订单管理 -->
        <div v-if="activeMenu === 'orders'" class="orders-management">
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
              
              <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="viewOrder(scope.row)">
                    查看详情
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
        </div>

        <!-- 系统配置 -->
        <div v-else-if="activeMenu === 'settings'" class="settings-management">
          <div class="page-header">
            <h3>系统配置</h3>
            <div class="header-actions">
              <el-button type="primary" size="small" @click="saveSettings" :loading="settingsLoading">
                <i class="el-icon-check"></i> 保存配置
              </el-button>
              <el-button size="small" @click="loadSettings" :loading="settingsLoading">
                <i class="el-icon-refresh"></i> 刷新
              </el-button>
            </div>
          </div>

          <div v-loading="settingsLoading" class="settings-content">
            <el-tabs v-model="activeSettingsTab" class="settings-tabs">
              <!-- 基础配置 -->
              <el-tab-pane label="基础配置" name="basic">
                <el-form :model="configData" label-width="120px">
                  <el-card class="config-card">
                    <div slot="header">
                      <span>系统基本信息</span>
                    </div>
                    <el-form-item label="系统标题">
                      <el-input v-model="configData.shopInfo.title" placeholder="请输入系统标题"></el-input>
                    </el-form-item>
                    <el-form-item label="系统描述">
                      <el-input 
                        type="textarea" 
                        :rows="4" 
                        v-model="configData.shopInfo.content" 
                        placeholder="请输入系统描述"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="主标题">
                      <el-input v-model="configData.title.mainTitle" placeholder="请输入主标题"></el-input>
                    </el-form-item>
                    <el-form-item label="副标题">
                      <el-input v-model="configData.title.subTitle" placeholder="请输入副标题"></el-input>
                    </el-form-item>
                  </el-card>
                </el-form>
              </el-tab-pane>

              <!-- 统计数据配置 -->
              <el-tab-pane label="统计数据" name="statistics">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-card class="config-card">
                      <div slot="header">
                        <span>中心信息数据</span>
                      </div>
                      <el-form :model="configData" label-width="100px">
                        <el-form-item label="数据项1">
                          <el-input-number v-model="configData['center-info'].centetData.number1" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="数据项2">
                          <el-input-number v-model="configData['center-info'].centetData.number2" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="数据项3">
                          <el-input-number v-model="configData['center-info'].centetData.number3" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="数据项4">
                          <el-input-number v-model="configData['center-info'].centetData.number4" :min="0"></el-input-number>
                        </el-form-item>
                      </el-form>
                    </el-card>
                  </el-col>
                  <el-col :span="12">
                    <el-card class="config-card">
                      <div slot="header">
                        <span>农机服务统计</span>
                      </div>
                      <el-form :model="configData" label-width="100px">
                        <el-form-item label="服务次数">
                          <el-input-number v-model="configData['agricultural-machinery-services'].number" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="服务里程">
                          <el-input-number v-model="configData['agricultural-machinery-services'].kilometer" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="服务面积">
                          <el-input-number v-model="configData['agricultural-machinery-services'].mu" :min="0"></el-input-number>
                        </el-form-item>
                      </el-form>
                    </el-card>
                  </el-col>
                </el-row>

                <el-card class="config-card">
                  <div slot="header">
                    <span>统计数据展示</span>
                  </div>
                  <div v-for="(item, index) in configData['statistical-data'].defaultStatistics" :key="index" class="statistics-item">
                    <el-row :gutter="10" style="margin-bottom: 10px;">
                      <el-col :span="6">
                        <el-input v-model="item.unit" placeholder="单位描述"></el-input>
                      </el-col>
                      <el-col :span="6">
                        <el-input v-model="item.number" placeholder="数值"></el-input>
                      </el-col>
                      <el-col :span="6">
                        <el-input v-model="item.title" placeholder="单位"></el-input>
                      </el-col>
                      <el-col :span="6">
                        <el-input v-model="item.img" placeholder="图标"></el-input>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
              </el-tab-pane>

              <!-- 监控数据配置 -->
              <el-tab-pane label="监控数据" name="monitoring">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-card class="config-card">
                      <div slot="header">
                        <span>土壤监控数据</span>
                      </div>
                      <div v-for="(item, index) in configData['center-main'].monitor" :key="index" class="monitor-item">
                        <el-row :gutter="10" style="margin-bottom: 10px;">
                          <el-col :span="8">
                            <el-input-number v-model="item.deep" :min="0" placeholder="深度"></el-input-number>
                          </el-col>
                          <el-col :span="8">
                            <el-input-number v-model="item.humidity" :min="0" placeholder="湿度"></el-input-number>
                          </el-col>
                          <el-col :span="8">
                            <el-input-number v-model="item.temperature" :min="0" placeholder="温度"></el-input-number>
                          </el-col>
                        </el-row>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col :span="12">
                    <el-card class="config-card">
                      <div slot="header">
                        <span>气象数据配置</span>
                      </div>
                      <el-form :model="configData.meteorological.sensorData" label-width="100px">
                        <el-form-item label="光照强度">
                          <el-input-number v-model="configData.meteorological.sensorData.illuminance" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="空气温度">
                          <el-input-number v-model="configData.meteorological.sensorData.airTemperature" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="空气湿度">
                          <el-input-number v-model="configData.meteorological.sensorData.airHumidity" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="大气压强">
                          <el-input-number v-model="configData.meteorological.sensorData.atmosphericPressure" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="CO2浓度">
                          <el-input-number v-model="configData.meteorological.sensorData.co2" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="风速">
                          <el-input-number v-model="configData.meteorological.sensorData.windSpeed" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="降雨量">
                          <el-input-number v-model="configData.meteorological.sensorData.rainfall" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="PM2.5">
                          <el-input-number v-model="configData.meteorological.sensorData.pm25" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="PM10">
                          <el-input-number v-model="configData.meteorological.sensorData.pm10" :min="0"></el-input-number>
                        </el-form-item>
                      </el-form>
                    </el-card>
                  </el-col>
                </el-row>
              </el-tab-pane>

              <!-- 内容配置 -->
              <el-tab-pane label="内容配置" name="content">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-card class="config-card">
                      <div slot="header">
                        <span>数字乡村配置</span>
                      </div>
                      <el-form :model="configData" label-width="100px">
                        <el-form-item label="标题">
                          <el-input v-model="configData['digital-countryside'].digitalTitle" placeholder="请输入标题"></el-input>
                        </el-form-item>
                        <el-form-item label="内容">
                          <el-input 
                            type="textarea" 
                            :rows="4" 
                            v-model="configData['digital-countryside'].digitalContent" 
                            placeholder="请输入内容"
                          ></el-input>
                        </el-form-item>
                        <el-form-item label="默认内容">
                          <el-input 
                            type="textarea" 
                            :rows="4" 
                            v-model="configData['digital-countryside'].defaultContent" 
                            placeholder="请输入默认内容"
                          ></el-input>
                        </el-form-item>
                      </el-form>
                    </el-card>
                  </el-col>
                  <el-col :span="12">
                    <el-card class="config-card">
                      <div slot="header">
                        <span>产业升级配置</span>
                      </div>
                      <el-form :model="configData" label-width="100px">
                        <el-form-item label="标题">
                          <el-input v-model="configData['industrial-upgrading'].industryTitle" placeholder="请输入标题"></el-input>
                        </el-form-item>
                        <el-form-item label="内容">
                          <el-input 
                            type="textarea" 
                            :rows="4" 
                            v-model="configData['industrial-upgrading'].industryContent" 
                            placeholder="请输入内容"
                          ></el-input>
                        </el-form-item>
                        <el-form-item label="默认内容">
                          <el-input 
                            type="textarea" 
                            :rows="4" 
                            v-model="configData['industrial-upgrading'].defaultContent" 
                            placeholder="请输入默认内容"
                          ></el-input>
                        </el-form-item>
                      </el-form>
                    </el-card>
                  </el-col>
                </el-row>

                <el-card class="config-card">
                  <div slot="header">
                    <span>视频展示配置</span>
                  </div>
                  <el-form :model="configData" label-width="120px">
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="视频地址">
                          <el-input v-model="configData['video-display'].videoSrc" placeholder="请输入视频地址"></el-input>
                        </el-form-item>
                        <el-form-item label="视频封面">
                          <el-input v-model="configData['video-display'].videoPoster" placeholder="请输入视频封面地址"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="默认视频地址">
                          <el-input v-model="configData['video-display'].defaultVideoSrc" placeholder="请输入默认视频地址"></el-input>
                        </el-form-item>
                        <el-form-item label="默认视频封面">
                          <el-input v-model="configData['video-display'].defaultVideoPoster" placeholder="请输入默认视频封面地址"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-card>
              </el-tab-pane>

              <!-- 技术配置 -->
              <el-tab-pane label="技术配置" name="technology">
                <el-card class="config-card">
                  <div slot="header">
                    <span>专家配置</span>
                  </div>
                  <div class="technology-config">
                    <h4>标签页配置</h4>
                    <div v-for="(tab, index) in configData.technology.tabs" :key="index" class="tab-item">
                      <el-input v-model="tab.name" placeholder="标签页名称" style="margin-bottom: 10px;"></el-input>
                    </div>
                    
                    <h4>专家信息配置</h4>
                    <div v-for="(banner, index) in configData.technology.banners" :key="index" class="banner-item">
                      <el-row :gutter="10" style="margin-bottom: 10px;">
                        <el-col :span="12">
                          <el-input v-model="banner.banner" placeholder="专家图片"></el-input>
                        </el-col>
                        <el-col :span="12">
                          <el-input v-model="banner.name" placeholder="专家名称"></el-input>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </el-card>
              </el-tab-pane>

              <!-- 评价配置 -->
              <el-tab-pane label="评价配置" name="evaluation">
                <el-card class="config-card">
                  <div slot="header">
                    <span>评价系统配置</span>
                  </div>
                  <div class="evaluation-config">
                    <h4>表头配置</h4>
                    <div v-for="(header, index) in configData.evaluate.headerTexts" :key="index" class="header-item">
                      <el-row :gutter="10" style="margin-bottom: 10px;">
                        <el-col :span="12">
                          <el-input v-model="header.text" placeholder="表头文字"></el-input>
                        </el-col>
                        <el-col :span="12">
                          <el-input v-model="header.background" placeholder="背景图片"></el-input>
                        </el-col>
                      </el-row>
                    </div>
                    
                    <h4>评价数据</h4>
                    <div v-for="(data, index) in configData.evaluate.datas" :key="index" class="data-item">
                      <el-row :gutter="10" style="margin-bottom: 10px;">
                        <el-col :span="8">
                          <el-input v-model="data.name" placeholder="时间"></el-input>
                        </el-col>
                        <el-col :span="8">
                          <el-input v-model="data.num" placeholder="评价内容"></el-input>
                        </el-col>
                        <el-col :span="8">
                          <el-input v-model="data.address" placeholder="评分"></el-input>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </el-card>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>

        <!-- 评论管理 -->
        <div v-else-if="activeMenu === 'comments'" class="comments-management">
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
              
              <el-table-column prop="auditStatus" label="审核状态" width="100">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.isAudited ? 'success' : 'warning'" size="small">
                    {{ scope.row.auditStatus || (scope.row.isAudited ? '已审核' : '待审核') }}
                  </el-tag>
                </template>
              </el-table-column>
              
              <el-table-column label="操作" width="120" fixed="right">
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

        <!-- 意见咨询管理 -->
        <div v-else-if="activeMenu === 'suggestions'" class="suggestions-management">
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
        </div>

        <!-- 推广资讯管理 -->
        <div v-else-if="activeMenu === 'promotions'" class="promotions-management">
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
        </div>

        <!-- 农资配送管理 -->
        <div v-else-if="activeMenu === 'delivery'" class="delivery-management">
          <div class="page-header">
            <h3>农资配送管理</h3>
            <div class="header-actions">
              <el-button type="success" size="small" @click="showCreateDeliveryDialog">
                <i class="el-icon-plus"></i> 新增配送
              </el-button>
              <el-button type="primary" size="small" @click="refreshDeliveries" :loading="deliveriesLoading">
                <i class="el-icon-refresh"></i> 刷新
              </el-button>
            </div>
          </div>

          <!-- 筛选区域 -->
          <div class="filter-section">
            <el-form :inline="true" :model="deliveryFilterForm" class="filter-form">
              <el-form-item label="类型">
                <el-select v-model="deliveryFilterForm.type" placeholder="全部类型" clearable>
                  <el-option label="种子" value="seeds"></el-option>
                  <el-option label="肥料" value="fertilizer"></el-option>
                  <el-option label="农药" value="pesticide"></el-option>
                  <el-option label="农机具" value="machinery"></el-option>
                  <el-option label="其他" value="other"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="deliveryFilterForm.status" placeholder="全部状态" clearable>
                  <el-option label="激活" value="active"></el-option>
                  <el-option label="禁用" value="inactive"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="关键词">
                <el-input v-model="deliveryFilterForm.keyword" placeholder="搜索标题和内容" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="filterDeliveries">筛选</el-button>
                <el-button @click="resetDeliveryFilter">重置</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 农资配送列表 -->
          <div class="deliveries-table">
            <el-table
              :data="filteredDeliveries"
              v-loading="deliveriesLoading"
              stripe
              style="width: 100%"
              :default-sort="{prop: 'createTime', order: 'descending'}"
            >
              <el-table-column prop="image" label="图片" width="80">
                <template slot-scope="scope">
                  <el-image 
                    v-if="scope.row.image"
                    :src="scope.row.image" 
                    style="width: 50px; height: 50px; border-radius: 4px;"
                    fit="cover"
                    :preview-src-list="[scope.row.image]"
                  />
                  <span v-else class="text-muted">无图片</span>
                </template>
              </el-table-column>
              
              <el-table-column prop="name" label="商品名称" min-width="150">
                <template slot-scope="scope">
                  <div class="product-name">
                    {{ scope.row.name || '-' }}
                  </div>
                  <div v-if="scope.row.origin" class="product-origin">
                    <small class="text-muted">产地：{{ scope.row.origin }}</small>
                  </div>
                </template>
              </el-table-column>
              
              <el-table-column prop="price" label="价格" width="100">
                <template slot-scope="scope">
                  <div class="product-price">
                    <span class="price-value">￥{{ scope.row.price }}</span>
                    <span class="price-unit">/{{ scope.row.unit || '件' }}</span>
                  </div>
                </template>
              </el-table-column>
              
              <el-table-column prop="stock" label="库存" width="80">
                <template slot-scope="scope">
                  <span :class="{ 'low-stock': scope.row.stock < 50 }">
                    {{ scope.row.stock || 0 }}
                  </span>
                </template>
              </el-table-column>
              
              <el-table-column prop="remark" label="描述" min-width="200">
                <template slot-scope="scope">
                  <div class="product-remark">
                    {{ scope.row.remark || '-' }}
                  </div>
                </template>
              </el-table-column>
              
              <el-table-column prop="certification" label="认证" width="120">
                <template slot-scope="scope">
                  <div v-if="scope.row.certification && scope.row.certification.length > 0">
                    <el-tag 
                      v-for="cert in scope.row.certification" 
                      :key="cert" 
                      type="success" 
                      size="mini" 
                      style="margin: 1px;"
                    >
                      {{ cert }}
                    </el-tag>
                  </div>
                  <span v-else class="text-muted">-</span>
                </template>
              </el-table-column>
              
              <el-table-column label="操作" width="200" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="viewDelivery(scope.row)">
                    查看
                  </el-button>
                  <el-button type="text" size="small" @click="editDelivery(scope.row)">
                    编辑
                  </el-button>
                  <el-button type="text" size="small" style="color: #F56C6C;" @click="deleteDelivery(scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              @size-change="handleDeliverySizeChange"
              @current-change="handleDeliveryCurrentChange"
              :current-page="deliveryPagination.page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="deliveryPagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="deliveryPagination.total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
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

    <!-- 农资配送表单弹窗 -->
    <el-dialog
      :title="deliveryFormTitle"
      :visible.sync="deliveryFormVisible"
      width="60%"
      @close="closeDeliveryForm"
    >
      <el-form 
        :model="deliveryForm" 
        :rules="deliveryFormRules" 
        ref="deliveryForm" 
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="deliveryForm.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        
        <el-form-item label="价格" prop="price">
          <el-input-number 
            v-model="deliveryForm.price" 
            :precision="2" 
            :step="0.1" 
            :min="0"
            placeholder="请输入价格"
          ></el-input-number>
        </el-form-item>
        
        <el-form-item label="单位" prop="unit">
          <el-input v-model="deliveryForm.unit" placeholder="请输入单位（如：斤、袋、箱等）"></el-input>
        </el-form-item>
        
        <el-form-item label="库存" prop="stock">
          <el-input-number 
            v-model="deliveryForm.stock" 
            :min="0"
            placeholder="请输入库存数量"
          ></el-input-number>
        </el-form-item>
        
        <el-form-item label="产地">
          <el-input v-model="deliveryForm.origin" placeholder="请输入产地（可选）"></el-input>
        </el-form-item>
        
        <el-form-item label="商品描述" prop="remark">
          <el-input 
            type="textarea" 
            :rows="4" 
            v-model="deliveryForm.remark" 
            placeholder="请输入商品描述"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="图片URL">
          <el-input v-model="deliveryForm.image" placeholder="请输入商品图片URL（可选）"></el-input>
        </el-form-item>
        
        <el-form-item label="重量规格">
          <el-input v-model="deliveryForm.weight" placeholder="请输入重量规格（如：5kg、10斤等）"></el-input>
        </el-form-item>
        
        <el-form-item label="尺寸规格">
          <el-input v-model="deliveryForm.size" placeholder="请输入尺寸规格（如：85mm等）"></el-input>
        </el-form-item>
        
        <el-form-item label="最小订购量">
          <el-input-number 
            v-model="deliveryForm.min_order" 
            :min="1"
            placeholder="请输入最小订购量"
          ></el-input-number>
        </el-form-item>
        
        <el-form-item label="保鲜方式">
          <el-input v-model="deliveryForm.preservation" placeholder="请输入保鲜方式（如：冷藏、常温等）"></el-input>
        </el-form-item>
        
        <el-form-item label="规格说明">
          <el-input v-model="deliveryForm.specification" placeholder="请输入规格说明（如：125g/盒等）"></el-input>
        </el-form-item>
        
        <el-form-item label="配送说明">
          <el-input v-model="deliveryForm.delivery" placeholder="请输入配送说明（如：包邮等）"></el-input>
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDeliveryForm">取消</el-button>
        <el-button type="primary" @click="submitDeliveryForm" :loading="deliveryFormLoading">
          {{ isDeliveryEditMode ? '更新' : '创建' }}
        </el-button>
      </div>
    </el-dialog>

    <!-- 农资配送详情弹窗 -->
    <el-dialog
      title="农资配送详情"
      :visible.sync="deliveryDetailVisible"
      width="60%"
      @close="closeDeliveryDetail"
    >
      <div v-if="currentDelivery" class="delivery-detail">
        <!-- 商品图片 -->
        <div v-if="currentDelivery.image" style="text-align: center; margin-bottom: 20px;">
          <el-image 
            :src="currentDelivery.image" 
            style="width: 200px; height: 200px; border-radius: 8px;"
            fit="cover"
            :preview-src-list="[currentDelivery.image]"
          />
        </div>
        
        <el-descriptions :column="2" border>
          <el-descriptions-item label="商品ID">
            {{ currentDelivery._id }}
          </el-descriptions-item>
          <el-descriptions-item label="商品名称">
            {{ currentDelivery.name }}
          </el-descriptions-item>
          <el-descriptions-item label="价格">
            <span style="color: #e6a23c; font-weight: 600;">￥{{ currentDelivery.price }}</span>
            <span style="color: #999; margin-left: 5px;">/{{ currentDelivery.unit }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="库存">
            <span :class="{ 'low-stock': currentDelivery.stock < 50 }">
              {{ currentDelivery.stock }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="产地">
            {{ currentDelivery.origin || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="重量规格">
            {{ currentDelivery.weight || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="尺寸规格">
            {{ currentDelivery.size || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="最小订购量">
            {{ currentDelivery.min_order || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="保鲜方式">
            {{ currentDelivery.preservation || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="规格说明">
            {{ currentDelivery.specification || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="配送说明">
            {{ currentDelivery.delivery || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="认证信息">
            <div v-if="currentDelivery.certification && currentDelivery.certification.length > 0">
              <el-tag 
                v-for="cert in currentDelivery.certification" 
                :key="cert" 
                type="success" 
                size="small" 
                style="margin: 2px;"
              >
                {{ cert }}
              </el-tag>
            </div>
            <span v-else>-</span>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 商品描述 -->
        <div class="delivery-content-detail" style="margin-top: 20px;">
          <h4>商品描述</h4>
          <el-card>
            <div class="content-text">
              {{ currentDelivery.remark || '暂无描述' }}
            </div>
          </el-card>
        </div>
      </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDeliveryDetail">关闭</el-button>
        <el-button type="primary" @click="editDelivery(currentDelivery)">编辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { getProductList, createProduct, updateProduct, deleteProduct } from '@/api/cockpit.js'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      activeMenu: 'orders',
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
      currentOrder: null,
      // 评论管理相关数据
      commentsLoading: false,
      comments: [],
      filteredComments: [],
      allOrdersData: [], // 存储所有订单数据用于评论过滤
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
      },
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
      currentSuggestion: null,
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
      },
      // 农资配送相关数据
      deliveriesLoading: false,
      deliveries: [],
      filteredDeliveries: [],
      deliveryPagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      },
      deliveryFilterForm: {
        type: '',
        status: '',
        keyword: ''
      },
      deliveryFormVisible: false,
      deliveryDetailVisible: false,
      currentDelivery: null,
      isDeliveryEditMode: false,
      deliveryFormLoading: false,
      deliveryForm: {
        title: '',
        content: '',
        type: '',
        imageUrl: '',
        expire_date: '',
        status: 'active'
      },
      deliveryFormRules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入库存数量', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入商品描述', trigger: 'blur' }
        ]
      },
      // 系统配置相关数据
      settingsLoading: false,
      activeSettingsTab: 'basic',
      configData: {
        shopInfo: {
          title: '',
          content: ''
        },
        title: {
          mainTitle: '',
          subTitle: ''
        },
        'center-info': {
          centetData: {
            number1: 0,
            number2: 0,
            number3: 0,
            number4: 0
          }
        },
        'agricultural-machinery-services': {
          number: 0,
          kilometer: 0,
          mu: 0
        },
        'statistical-data': {
          defaultStatistics: []
        },
        'center-main': {
          monitor: []
        },
        meteorological: {
          sensorData: {
            illuminance: 0,
            airTemperature: 0,
            airHumidity: 0,
            atmosphericPressure: 0,
            co2: 0,
            windSpeed: 0,
            rainfall: 0,
            pm25: 0,
            pm10: 0
          }
        },
        'digital-countryside': {
          digitalTitle: '',
          digitalContent: '',
          defaultContent: ''
        },
        'industrial-upgrading': {
          industryTitle: '',
          industryContent: '',
          defaultContent: ''
        },
        'video-display': {
          videoSrc: '',
          videoPoster: '',
          defaultVideoSrc: '',
          defaultVideoPoster: ''
        },
        technology: {
          tabs: [],
          banners: []
        },
        evaluate: {
          headerTexts: [],
          datas: []
        }
      }
    }
  },
  mounted() {
    this.checkAuth();
    this.loadOrders();
  },
  methods: {
    // 检查登录状态
    checkAuth() {
      const token = localStorage.getItem('adminToken');
      if (token !== 'ADMIN_TOKEN_2024_NONGYE_CENTER') {
        this.$message.error('当前未登录，请先登录！');
        this.$router.push('/admin');
        return;
      }
    },
    
    // 退出登录
    logout() {
      this.$confirm('确认退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('adminToken');
        this.$message.success('已退出登录');
        this.$router.push('/admin');
      }).catch(() => {
        // 用户取消
      });
    },

    // 菜单选择
    handleMenuSelect(key) {
      this.activeMenu = key;
      if (key === 'orders') {
        this.loadOrders();
      } else if (key === 'settings') {
        this.loadSettings();
      } else if (key === 'comments') {
        this.loadComments();
      } else if (key === 'suggestions') {
        this.loadSuggestions();
      } else if (key === 'promotions') {
        this.loadPromotions();
      } else if (key === 'delivery') {
        this.loadDeliveries();
      }
    },

    // 加载订单数据
    async loadOrders() {
      this.loading = true;
      try {
        // 简化请求，不传过滤参数，在前端进行过滤
        const requestData = {
          page: 1,
          pageSize: 100  // 获取足够多的数据用于前端过滤
        };
        
        console.log('订单管理请求数据:', requestData);
        
        const response = await axios({
          method: 'post',
          url: '/api/getAllOrders',
          data: requestData,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('订单管理API响应:', response.data);
        let ordersData = null;
        if (response.data && response.data.success === true && response.data.data && response.data.data.orders) {
          ordersData = response.data.data.orders;
        } else if (response.data && response.data.orders) {
          ordersData = response.data.orders;
        }
        if (ordersData) {
          this.orders = ordersData || [];
          console.log('成功加载订单数量:', this.orders.length);
          // 应用前端过滤
          this.applyOrderFilters();
          this.$message.success(`成功加载 ${this.orders.length} 条订单数据`);
        } else {
          console.error('API返回数据格式异常:', response.data);
          this.$message.error('获取订单数据失败：数据格式异常');
        }
      } catch (error) {
        console.error('网络请求异常:', error);
        this.$message.error('网络请求失败：' + error.message);
      } finally {
        this.loading = false;
      }
    },

    // 刷新订单
    refreshOrders() {
      this.loadOrders();
    },

    // 应用订单过滤
    applyOrderFilters() {
      let filtered = [...this.orders];
      
      // 按订单类型过滤
      if (this.filterForm.orderType) {
        filtered = filtered.filter(order => order.orderType === this.filterForm.orderType);
        console.log('按订单类型过滤后数量:', filtered.length);
      }
      
      // 按状态过滤
      if (this.filterForm.status) {
        filtered = filtered.filter(order => order.status === this.filterForm.status);
        console.log('按状态过滤后数量:', filtered.length);
      }
      
      this.filteredOrders = filtered;
      
      // 更新分页信息
      this.pagination.total = filtered.length;
      this.pagination.totalPages = Math.ceil(filtered.length / this.pagination.pageSize);
      this.pagination.page = 1; // 重置到第一页
      
      console.log('过滤完成，显示数量:', filtered.length);
    },

    // 筛选订单
    filterOrders() {
      this.applyOrderFilters();
      this.$message.success('筛选完成');
    },

    // 重置筛选
    resetFilter() {
      this.filterForm = {
        orderType: '',
        status: ''
      };
      this.filteredOrders = [...this.orders];
    },

    // 分页处理 - 前端分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.page = 1; // 重置到第一页
      this.applyOrderFilters(); // 重新应用过滤
    },

    handleCurrentChange(val) {
      this.pagination.page = val;
      // 不需要重新加载数据，只需要更新显示
    },

    // 查看订单详情
    viewOrder(order) {
      this.currentOrder = order;
      this.orderDetailVisible = true;
    },

    // 关闭订单详情
    closeOrderDetail() {
      this.orderDetailVisible = false;
      this.currentOrder = null;
    },

    // 更新订单状态
    updateOrderStatus() {
      this.$message.info('订单状态更新功能开发中...');
    },

    // 获取订单类型颜色
    getOrderTypeColor(type) {
      const colorMap = {
        'machinery': 'primary',
        'technology': 'success',
        'repair': 'warning',
        'recycle': 'info',
        'study': 'danger'
      };
      return colorMap[type] || '';
    },

    // 获取状态颜色
    getStatusColor(status) {
      const colorMap = {
        'pending': 'warning',
        'processing': 'primary',
        'finish': 'success',
        'cancelled': 'danger'
      };
      return colorMap[status] || '';
    },

    // 加载系统配置数据
    async loadSettings() {
      this.settingsLoading = true;
      try {
        const requestData = {};
        console.log('系统配置请求数据:', requestData);
        const response = await axios({
          method: 'post',
          url: '/api/getShopInfo',
          data: requestData,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('系统配置API响应:', response.data);
        let data = null;
        if (response.data && response.data.success === true && response.data.data) {
          data = response.data.data;
        } else if (response.data && response.data.shopInfo) {
          data = response.data;
        }
        if (data) {
          console.log('原始数据字段:', Object.keys(data));
          this.configData = {
            shopInfo: data.shopInfo || { title: '', content: '' },
            title: data.title || { mainTitle: '', subTitle: '' },
            'center-info': data['center-info'] || { centetData: { number1: 0, number2: 0, number3: 0, number4: 0 } },
            'agricultural-machinery-services': data['agricultural-machinery-services'] || { number: 0, kilometer: 0, mu: 0 },
            'statistical-data': data['statistical-data'] || { defaultStatistics: [] },
            'center-main': data['center-main'] || { monitor: [] },
            meteorological: data.meteorological || { 
              sensorData: {
                illuminance: 0, airTemperature: 0, airHumidity: 0, atmosphericPressure: 0,
                co2: 0, windSpeed: 0, rainfall: 0, pm25: 0, pm10: 0
              }
            },
            'digital-countryside': data['digital-countryside'] || { digitalTitle: '', digitalContent: '', defaultContent: '' },
            'industrial-upgrading': data['industrial-upgrading'] || { industryTitle: '', industryContent: '', defaultContent: '' },
            'video-display': data['video-display'] || { videoSrc: '', videoPoster: '', defaultVideoSrc: '', defaultVideoPoster: '' },
            technology: data.technology || { tabs: [], banners: [] },
            evaluate: data.evaluate || { headerTexts: [], datas: [] }
          };
          this.$message.success('配置数据加载成功');
        } else {
          console.error('系统配置API返回异常:', response.data);
          this.$message.error('获取配置数据失败：缺少必要的shopInfo字段');
        }
      } catch (error) {
        console.error('加载配置失败:', error);
        this.$message.error('网络请求失败：' + error.message);
      } finally {
        this.settingsLoading = false;
      }
    },

    // 保存系统配置数据
    async saveSettings() {
      this.settingsLoading = true;
      try {
        // 构建要提交的数据结构 - 尝试扁平化格式
        const submitData = this.configData;

        console.log('提交的配置数据:', submitData);

        const response = await axios({
          method: 'post',
          url: '/api/setShopInfo',
          data: submitData,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('配置保存API响应:', response.data);
        
        // 检查响应格式 - 可能有success字段，也可能直接返回成功状态
        if (response.data && (response.data.success === true || response.status === 200)) {
          this.$message.success('配置保存成功！');
        } else {
          console.error('配置保存失败:', response.data);
          this.$message.error('保存配置失败：' + (response.data?.error || response.data?.message || '未知错误'));
        }
      } catch (error) {
        console.error('保存配置失败:', error);
        this.$message.error('网络请求失败：' + error.message);
      } finally {
        this.settingsLoading = false;
      }
    },

     // 评论管理相关方法
     // 加载评论数据
     async loadComments() {
       this.commentsLoading = true;
       try {
         // 简化请求，获取所有订单数据，在前端进行过滤
         const requestData = {
           page: 1,
           pageSize: 1000  // 获取足够多的数据用于前端过滤
         };
         console.log('评论管理请求数据:', requestData);
         const response = await axios({
           method: 'post',
           url: '/api/getAllOrders',
           data: requestData,
           headers: {
             'Content-Type': 'application/json'
           }
         });
         console.log('评论管理API响应:', response.data);
         let ordersData = null;
         if (response.data && response.data.success === true && response.data.data && response.data.data.orders) {
           ordersData = response.data.data.orders;
         } else if (response.data && response.data.orders) {
           ordersData = response.data.orders;
         }
         if (ordersData) {
           // 获取所有订单数据，在前端进行过滤
           const allOrders = ordersData || [];
           console.log('API返回的订单数量:', allOrders.length);
           // 保存所有订单数据
           this.allOrdersData = allOrders;
           // 应用前端过滤
           this.applyCommentFilters(allOrders);
           if (this.filteredComments.length === 0) {
             this.$message.info('暂无评价数据');
           } else {
             //this.$message.success(`加载了 ${this.filteredComments.length} 条评价数据`);
           }
         } else {
           console.error('评论管理API返回数据格式异常:', response.data);
           this.$message.error('获取评论数据失败：数据格式异常');
         }
       } catch (error) {
         console.error('加载评论失败:', error);
         this.$message.error('网络请求失败：' + error.message);
       } finally {
         this.commentsLoading = false;
       }
     },

     // 刷新评论
     refreshComments() {
       this.loadComments();
     },

     // 应用评论过滤
     applyCommentFilters(allOrders) {
       let filtered = allOrders;
       
       // 筛选有评价的订单
       filtered = filtered.filter(order => {
         const hasEvaluated = order.evaluate && order.evaluate.trim() !== '';
         console.log(`订单 ${order._id} 评价状态:`, hasEvaluated, '评价内容:', order.evaluate);
         return hasEvaluated;
       });
       
       console.log('有评价的订单数量:', filtered.length);
       
       // 如果勾选了"只显示已审核"，进一步筛选
       if (this.commentFilterForm.isChecked) {
         filtered = filtered.filter(order => order.checkStatus === 1);
         console.log('已审核的订单数量:', filtered.length);
       }
       
       // 处理评论数据
       this.comments = filtered.map(order => ({
         ...order,
         checkStatus: order.isAudited ? 1 : 0, // 兼容原有的checkStatus逻辑
         _submitting: false // 用于按钮loading状态
       }));
       
       this.filteredComments = [...this.comments];
       
       // 更新分页信息
       this.commentPagination.total = filtered.length;
       this.commentPagination.totalPages = Math.ceil(filtered.length / this.commentPagination.pageSize);
       this.commentPagination.page = 1; // 重置到第一页
       
       console.log('评论过滤完成，显示数量:', filtered.length);
     },

     // 筛选评论
     filterComments() {
       this.loadComments(); // 重新加载数据并应用过滤
     },

     // 重置评论筛选
     resetCommentFilter() {
       this.commentFilterForm = {
         isChecked: false
       };
       this.commentPagination.page = 1;
       this.loadComments();
     },

     // 切换审核状态
     async toggleCheckStatus(order) {
       if (order._submitting) return;
       
       // 设置按钮loading状态
       this.$set(order, '_submitting', true);
       
       try {
         const newStatus = order.isAudited ? 0 : 1;
         
         // 调试信息：检查订单ID
         console.log('审核操作调试信息:', {
           orderId: order._id,
           orderIdType: typeof order._id,
           orderIdLength: order._id ? order._id.length : 0,
           newStatus: newStatus,
           orderData: order
         });
         
         // 确保orderId存在且有效
         if (!order._id) {
           this.$message.error('订单ID不存在，无法进行审核操作');
           return;
         }
         
         const requestData = {
           orderId: order._id,
           checkStatus: newStatus
         };
         
         console.log('提交的审核数据:', requestData);
         console.log('请求数据JSON格式:', JSON.stringify(requestData, null, 2));
         console.log('orderId验证:', {
           value: order._id,
           type: typeof order._id,
           length: order._id ? order._id.length : 0,
           isString: typeof order._id === 'string',
           isEmpty: !order._id || order._id.trim() === ''
         });
         
         // 确保orderId是有效的字符串
         if (!order._id || typeof order._id !== 'string' || order._id.trim() === '') {
           this.$message.error('订单ID格式无效，无法进行审核操作');
           return;
         }
         
         // 确保发送JSON格式的数据
         const response = await axios({
           method: 'post',
           url: '/api/submitEvaluate',
           data: requestData,
           headers: {
             'Content-Type': 'application/json'
           }
         });
         
         console.log('审核API响应:', response.data);
         
         // 检查响应是否成功
         console.log('完整API响应:', response);
         console.log('响应状态码:', response.status);
         console.log('响应数据:', response.data);
         
         if (response.data && response.data.success === true) {
           // 更新本地状态
           order.isAudited = newStatus === 1;
           order.checkStatus = newStatus; // 兼容性
           order.auditStatus = newStatus === 1 ? '已审核' : '未审核';
           this.$message.success(newStatus === 1 ? '审核成功！' : '反审核成功！');
         } else {
           console.error('审核API返回失败:', response.data);
           const errorMessage = response.data?.error || response.data?.message || '未知错误';
           this.$message.error('操作失败：' + errorMessage);
         }
       } catch (error) {
         console.error('审核操作失败:', error);
         console.error('错误详情:', {
           message: error.message,
           response: error.response?.data,
           status: error.response?.status
         });
         this.$message.error('网络请求失败：' + error.message);
       } finally {
         this.$set(order, '_submitting', false);
       }
     },



     // 评论分页处理 - 前端分页
     handleCommentSizeChange(val) {
       this.commentPagination.pageSize = val;
       this.commentPagination.page = 1;
       // 重新应用过滤，不需要重新加载数据
       this.applyCommentFilters(this.allOrdersData);
     },

     handleCommentCurrentChange(val) {
       this.commentPagination.page = val;
       // 不需要重新加载数据，只需要更新显示
     },

     // 意见咨询相关方法
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
     },

     // 推广资讯相关方法
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

     // 格式化日期
     formatDate(dateStr) {
       if (!dateStr) return '-';
       try {
         const date = new Date(dateStr);
         return date.toLocaleDateString('zh-CN');
       } catch (error) {
         return dateStr;
       }
     },

     // 计算属性：推广资讯表单标题
     get promotionFormTitle() {
       return this.isEditMode ? '编辑推广资讯' : '新增推广资讯';
     },

     // 农资配送相关方法
         // 加载农资配送数据
    async loadDeliveries() {
      this.deliveriesLoading = true;
      try {
        const requestParams = {
          page: this.deliveryPagination.page,
          pageSize: this.deliveryPagination.pageSize
        };
        
        // 添加筛选条件
        if (this.deliveryFilterForm.keyword) {
          requestParams.keyword = this.deliveryFilterForm.keyword;
        }
        
        console.log('农资配送请求数据:', requestParams);
        
        const response = await getProductList(requestParams);
        
        console.log('农资配送API响应:', response.data);
        
        let deliveriesData = null;
        let paginationData = null;
        
        // 处理新的接口返回格式
        if (response.data && response.data.success === true && response.data.data) {
          const resultData = response.data.data;
          deliveriesData = resultData.list;
          paginationData = resultData.pagination;
        }
        
        if (deliveriesData) {
          // 处理数据格式，适配商品数据结构
          this.deliveries = deliveriesData.map(item => ({
            ...item,
            title: item.name, // 将name映射为title以兼容现有展示逻辑
            content: item.remark, // 将remark映射为content
            type: this.getProductType(item), // 根据商品信息判断类型
            status: item.stock > 0 ? 'active' : 'inactive', // 根据库存判断状态
            createTimeFormatted: new Date().toLocaleString(), // 默认当前时间
            updateTimeFormatted: new Date().toLocaleString()
          }));
          
          // 更新分页信息
          if (paginationData) {
            this.deliveryPagination = {
              ...this.deliveryPagination,
              ...paginationData
            };
          }
          
          this.filteredDeliveries = [...this.deliveries];
          console.log('成功加载农资配送数量:', this.deliveries.length);
          this.$message.success(`成功加载 ${this.deliveries.length} 条农资配送数据`);
        } else {
          console.error('农资配送API返回数据格式异常:', response.data);
          this.$message.error('获取农资配送数据失败：数据格式异常');
        }
      } catch (error) {
        console.error('网络请求异常:', error);
        this.$message.error('网络请求失败：' + error.message);
      } finally {
        this.deliveriesLoading = false;
      }
    },

     // 刷新农资配送
     refreshDeliveries() {
       this.loadDeliveries();
     },

     // 筛选农资配送
     filterDeliveries() {
       this.deliveryPagination.page = 1;
       this.loadDeliveries();
     },

         // 重置农资配送筛选
    resetDeliveryFilter() {
      this.deliveryFilterForm = {
        keyword: ''
      };
      this.deliveryPagination.page = 1;
      this.loadDeliveries();
    },

         // 显示创建农资配送弹窗
    showCreateDeliveryDialog() {
      this.isDeliveryEditMode = false;
      this.deliveryForm = {
        name: '',
        price: '',
        unit: '',
        stock: '',
        origin: '',
        remark: '',
        image: '',
        weight: '',
        size: '',
        min_order: '',
        preservation: '',
        specification: '',
        delivery: '',
        certification: []
      };
      this.deliveryFormVisible = true;
    },

         // 编辑农资配送
    editDelivery(delivery) {
      this.isDeliveryEditMode = true;
      this.currentDelivery = delivery;
      this.deliveryForm = {
        name: delivery.name || '',
        price: delivery.price || '',
        unit: delivery.unit || '',
        stock: delivery.stock || '',
        origin: delivery.origin || '',
        remark: delivery.remark || '',
        image: delivery.image || '',
        weight: delivery.weight || '',
        size: delivery.size || '',
        min_order: delivery.min_order || '',
        preservation: delivery.preservation || '',
        specification: delivery.specification || '',
        delivery: delivery.delivery || '',
        certification: delivery.certification || []
      };
      this.deliveryFormVisible = true;
    },

     // 查看农资配送详情
     viewDelivery(delivery) {
       this.currentDelivery = delivery;
       this.deliveryDetailVisible = true;
     },

     // 关闭农资配送表单
     closeDeliveryForm() {
       this.deliveryFormVisible = false;
       this.$refs.deliveryForm && this.$refs.deliveryForm.resetFields();
     },

     // 关闭农资配送详情
     closeDeliveryDetail() {
       this.deliveryDetailVisible = false;
       this.currentDelivery = null;
     },

         // 提交农资配送表单
    async submitDeliveryForm() {
      this.$refs.deliveryForm.validate(async (valid) => {
        if (valid) {
          this.deliveryFormLoading = true;
          try {
            const requestData = {
              ...this.deliveryForm
            };
            
            if (this.isDeliveryEditMode) {
              requestData._id = this.currentDelivery._id;
            }
            
            console.log('提交农资配送数据:', requestData);
            
            let response;
            if (this.isDeliveryEditMode) {
              response = await updateProduct(requestData);
            } else {
              response = await createProduct(requestData);
            }
            
            console.log('农资配送操作响应:', response.data);
            
            if (response.data && response.data.success === true) {
              this.$message.success(this.isDeliveryEditMode ? '农资配送更新成功！' : '农资配送创建成功！');
              this.closeDeliveryForm();
              this.loadDeliveries();
            } else {
              console.error('农资配送操作失败:', response.data);
              this.$message.error('操作失败：' + (response.data?.error || response.data?.message || '未知错误'));
            }
          } catch (error) {
            console.error('农资配送操作异常:', error);
            this.$message.error('网络请求失败：' + error.message);
          } finally {
            this.deliveryFormLoading = false;
          }
        }
      });
    },

     // 删除农资配送
     deleteDelivery(delivery) {
             this.$confirm(`确认删除农资配送"${delivery.name}"吗？此操作不可恢复！`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const requestData = {
            _id: delivery._id
          };
          
          console.log('删除农资配送请求:', requestData);
          
          const response = await deleteProduct(requestData);
          
          console.log('删除农资配送响应:', response.data);
          
          if (response.data && response.data.success === true) {
            this.$message.success('农资配送删除成功！');
            this.loadDeliveries();
          } else {
            console.error('删除农资配送失败:', response.data);
            this.$message.error('删除失败：' + (response.data?.error || response.data?.message || '未知错误'));
          }
        } catch (error) {
          console.error('删除农资配送异常:', error);
          this.$message.error('网络请求失败：' + error.message);
        }
      }).catch(() => {
        // 用户取消删除
      });
     },

     // 获取农资配送类型颜色
     getDeliveryTypeColor(type) {
       const colorMap = {
         'seeds': 'success',
         'fertilizer': 'warning',
         'pesticide': 'danger',
         'machinery': 'primary',
         'other': 'info'
       };
       return colorMap[type] || '';
     },

     // 获取农资配送类型文本
     getDeliveryTypeText(type) {
       const textMap = {
         'seeds': '种子',
         'fertilizer': '肥料',
         'pesticide': '农药',
         'machinery': '农机具',
         'other': '其他'
       };
       return textMap[type] || '未知类型';
     },

     // 获取农资配送状态颜色
     getDeliveryStatusColor(status) {
       const colorMap = {
         'active': 'success',
         'inactive': 'info'
       };
       return colorMap[status] || '';
     },

     // 获取农资配送状态文本
     getDeliveryStatusText(status) {
       const textMap = {
         'active': '激活',
         'inactive': '禁用'
       };
       return textMap[status] || '未知状态';
     },

     // 农资配送分页处理
     handleDeliverySizeChange(val) {
       this.deliveryPagination.pageSize = val;
       this.deliveryPagination.page = 1;
       this.loadDeliveries();
     },

     handleDeliveryCurrentChange(val) {
       this.deliveryPagination.page = val;
       this.loadDeliveries();
     },

         // 计算属性：农资配送表单标题
    get deliveryFormTitle() {
      return this.isDeliveryEditMode ? '编辑农资配送' : '新增农资配送';
    },

    // 根据商品信息判断产品类型
    getProductType(item) {
      const name = (item.name || '').toLowerCase();
      if (name.includes('种子') || name.includes('苗') || name.includes('种')) {
        return 'seeds';
      } else if (name.includes('肥') || name.includes('料')) {
        return 'fertilizer';
      } else if (name.includes('药') || name.includes('剂')) {
        return 'pesticide';
      } else if (name.includes('机') || name.includes('器具') || name.includes('工具')) {
        return 'machinery';
      } else {
        return 'other';
      }
    }
   }
 }
</script>

<style lang="scss" scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f0f2f5;
}

.header {
  background: #fff;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;

  .header-left h2 {
    margin: 0;
    color: #333;
    font-size: 20px;
    font-weight: 600;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .welcome {
      color: #666;
      font-size: 14px;
    }
  }
}

.main-content {
  display: flex;
  height: calc(100vh - 64px);
}

.sidebar {
  width: 240px;
  background: #304156;

  .sidebar-menu {
    border-right: none;
    height: 100%;

    .el-menu-item {
      height: 50px;
      line-height: 50px;

      i {
        margin-right: 8px;
      }
    }
  }
}

.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
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

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  p {
    margin-top: 16px;
    color: #999;
    font-size: 16px;
  }
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

// 系统配置样式
.settings-content {
  .settings-tabs {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  
  .config-card {
    margin-bottom: 20px;
    
    .el-card__header {
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      
      span {
        font-weight: 600;
        color: #333;
      }
    }
  }
  
  .statistics-item,
  .monitor-item,
  .header-item,
  .data-item,
  .tab-item,
  .banner-item {
    padding: 10px;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    margin-bottom: 10px;
    background: #f8f9fa;
  }
  
  .technology-config,
  .evaluation-config {
    h4 {
      margin: 20px 0 10px 0;
      color: #333;
      font-size: 14px;
      font-weight: 600;
    }
  }
  
  .el-form-item {
    margin-bottom: 16px;
  }
  
  .el-input-number {
    width: 100%;
  }
}

// 评论管理样式
.comments-management {
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
  }
}

// 意见咨询管理样式
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

// 推广资讯管理样式
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

// 农资配送管理样式
.delivery-management {
  .deliveries-table {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .product-name {
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }

    .product-origin {
      margin-top: 2px;
    }

    .product-price {
      .price-value {
        font-weight: 600;
        color: #e6a23c;
        font-size: 14px;
      }
      
      .price-unit {
        color: #999;
        font-size: 12px;
        margin-left: 2px;
      }
    }

    .product-remark {
      max-height: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      line-height: 1.4;
      word-break: break-all;
    }

    .low-stock {
      color: #F56C6C;
      font-weight: 500;
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

.delivery-detail {
  .delivery-content-detail {
    .content-text {
      line-height: 1.6;
      word-break: break-all;
      white-space: pre-wrap;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
  }

  .filter-section {
    .filter-form {
      .el-form-item {
        display: block;
        margin-right: 0;
        margin-bottom: 16px;
      }
    }
  }
}
</style> 