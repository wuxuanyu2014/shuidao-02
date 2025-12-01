<template>
  <div class="delivery-management">
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
            @input="handleRemarkChange"
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
import { getProductList, createProduct, updateProduct, deleteProduct } from '@/api/cockpit.js'

export default {
  name: 'DeliveryManagement',
  data() {
    return {
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
      }
    }
  },
  mounted() {
    this.loadDeliveries();
  },
  computed: {
    // 计算属性：农资配送表单标题
    deliveryFormTitle() {
      return this.isDeliveryEditMode ? '编辑农资配送' : '新增农资配送';
    }
  },
  methods: {
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
      
      // 打印原始数据，用于调试
      console.log('编辑农资配送 - 原始数据:', JSON.stringify(delivery, null, 2));
      console.log('编辑农资配送 - 原始remark值:', delivery.remark);
      
      // 使用$set确保响应式更新
      this.$set(this.deliveryForm, 'name', delivery.name || '');
      this.$set(this.deliveryForm, 'price', delivery.price || '');
      this.$set(this.deliveryForm, 'unit', delivery.unit || '');
      this.$set(this.deliveryForm, 'stock', delivery.stock || '');
      this.$set(this.deliveryForm, 'origin', delivery.origin || '');
      this.$set(this.deliveryForm, 'remark', delivery.remark || '');
      this.$set(this.deliveryForm, 'image', delivery.image || '');
      this.$set(this.deliveryForm, 'weight', delivery.weight || '');
      this.$set(this.deliveryForm, 'size', delivery.size || '');
      this.$set(this.deliveryForm, 'min_order', delivery.min_order || '');
      this.$set(this.deliveryForm, 'preservation', delivery.preservation || '');
      this.$set(this.deliveryForm, 'specification', delivery.specification || '');
      this.$set(this.deliveryForm, 'delivery', delivery.delivery || '');
      this.$set(this.deliveryForm, 'certification', delivery.certification || []);
      
      // 打印填充后的表单数据，用于调试
      console.log('编辑农资配送 - 填充后表单数据:', JSON.stringify(this.deliveryForm, null, 2));
      console.log('编辑农资配送 - 填充后remark值:', this.deliveryForm.remark);
      
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
      // 只在非编辑模式下重置表单，编辑模式下不要重置
      if (!this.isDeliveryEditMode) {
        this.$nextTick(() => {
          if (this.$refs.deliveryForm) {
            console.log('重置表单前的数据:', JSON.stringify(this.deliveryForm, null, 2));
            this.$refs.deliveryForm.resetFields();
            console.log('重置表单后的数据:', JSON.stringify(this.deliveryForm, null, 2));
          }
        });
      }
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
            // 打印当前表单数据，用于调试
            console.log('当前表单数据 deliveryForm:', JSON.stringify(this.deliveryForm, null, 2));
            console.log('当前表单remark值:', this.deliveryForm.remark);
            
            const requestData = {
              ...this.deliveryForm
            };
            
            if (this.isDeliveryEditMode) {
              requestData._id = this.currentDelivery._id;
            }
            
            console.log('提交农资配送数据:', JSON.stringify(requestData, null, 2));
            console.log('提交数据中的remark值:', requestData.remark);
            
            let response;
            if (this.isDeliveryEditMode) {
              response = await updateProduct(requestData);
            } else {
              response = await createProduct(requestData);
            }
            
            console.log('农资配送操作响应:', response.data);
            
            if (response.data && response.data.success === true) {
              this.$message.success(this.isDeliveryEditMode ? '农资配送更新成功！' : '农资配送创建成功！');
              // 延迟关闭表单，确保数据已经提交
              setTimeout(() => {
                this.closeDeliveryForm();
                this.loadDeliveries();
              }, 100);
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
    },

    // 处理商品描述输入变化
    handleRemarkChange(value) {
      console.log('商品描述输入变化:', value);
      console.log('当前deliveryForm.remark值:', this.deliveryForm.remark);
      // 使用$set确保响应式更新
      this.$set(this.deliveryForm, 'remark', value);
      console.log('$set后的deliveryForm.remark值:', this.deliveryForm.remark);
    }
  }
}
</script>

<style lang="scss" scoped>
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
      line-clamp: 3;
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