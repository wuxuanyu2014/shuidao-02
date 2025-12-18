# 项目API接口列表

本文档列出了项目中使用的所有API接口。

## 📋 目录

1. [首页数据接口](#首页数据接口)
2. [后台管理接口](#后台管理接口)
3. [农资配送接口](#农资配送接口)
4. [其他业务接口](#其他业务接口)

---

## 首页数据接口

### 1. 获取商店统一信息
- **接口**: `GET /api/getShopInfo`
- **用途**: 获取首页所有数据（统一接口）
- **使用位置**:
  - `src/views/testIndex.vue` - 首页
  - `src/views/monitor.vue` - 监控页面
  - `src/views/activitys.vue` - 地块管理页面
  - `src/views/index-model/*.vue` - 所有子组件
- **返回数据字段**:
  - `shopInfo` - 园区介绍信息
  - `title.mainTitle` - 页面标题
  - `agricultural-machinery-services` - 农机服务数据（包含monitorItems）
  - `agricultural-management` - 地块管理数据
  - `agricultural-services` - 农资服务数据
  - `center-main.topData` - 顶部统计数据
  - `meteorological.onlineData` - 在线数据统计
  - `evaluate` - 评价数据
  - `technology` - 技术/农资配送数据
  - `center-bottom` - 中心底部数据
  - `plots` - 地块列表
  - `deviceList` - 设备列表
  - 等其他配置数据

---

## 后台管理接口

### 2. 获取系统配置（读取）
- **接口**: `POST /api/getShopInfo`
- **用途**: 后台管理系统配置页面加载数据
- **使用位置**: `src/views/admin/SettingsManagement.vue`
- **请求方式**: POST
- **请求参数**: 无（传递空对象）

### 3. 保存系统配置（保存）
- **接口**: `POST /api/setShopInfo`
- **用途**: 后台保存系统配置数据
- **使用位置**: `src/views/admin/SettingsManagement.vue`
- **请求方式**: POST
- **请求参数**: 完整的配置数据对象

### 4. 获取订单列表
- **接口**: `POST /api/getAllOrders`
- **用途**: 获取所有订单数据
- **使用位置**: 
  - `src/views/admin/OrdersManagement.vue` - 订单管理
  - `src/views/admin/CommentsManagement.vue` - 评论管理
- **请求参数**:
  ```json
  {
    "page": 1,
    "pageSize": 100
  }
  ```

### 5. 完成订单
- **接口**: `POST /api/completeOrder`
- **用途**: 管理员手动完成订单
- **使用位置**: `src/views/admin/OrdersManagement.vue`
- **请求参数**:
  ```json
  {
    "orderId": "订单ID",
    "adminUserId": "admin",
    "remark": "完成备注"
  }
  ```

### 6. 审核评价
- **接口**: `POST /api/submitEvaluate`
- **用途**: 审核或反审核用户评价
- **使用位置**: `src/views/admin/CommentsManagement.vue`
- **请求参数**:
  ```json
  {
    "orderId": "订单ID",
    "checkStatus": 1  // 1=已审核, 0=未审核
  }
  ```

### 7. 获取推广资讯列表
- **接口**: `POST /api/getInfoList`
- **用途**: 获取推广资讯列表
- **使用位置**: `src/views/admin/PromotionsManagement.vue`
- **请求参数**:
  ```json
  {
    "page": 1,
    "pageSize": 20,
    "isAdmin": true
  }
  ```

### 8. 创建推广资讯
- **接口**: `POST /api/createInfo`
- **用途**: 创建新的推广资讯
- **使用位置**: `src/views/admin/PromotionsManagement.vue`
- **请求参数**: 推广资讯表单数据

### 9. 更新推广资讯
- **接口**: `POST /api/updateInfo`
- **用途**: 更新推广资讯
- **使用位置**: `src/views/admin/PromotionsManagement.vue`
- **请求参数**: 包含_id的推广资讯数据

### 10. 删除推广资讯
- **接口**: `POST /api/deleteInfo`
- **用途**: 删除推广资讯
- **使用位置**: `src/views/admin/PromotionsManagement.vue`
- **请求参数**:
  ```json
  {
    "_id": "资讯ID",
    "isAdmin": true
  }
  ```

### 11. 获取意见咨询列表
- **接口**: `POST /api/getSuggestList`
- **用途**: 获取意见咨询列表
- **使用位置**: `src/views/admin/SuggestionsManagement.vue`
- **请求参数**:
  ```json
  {
    "page": 1,
    "pageSize": 20,
    "isAdmin": true
  }
  ```

---

## 农资配送接口

### 12. 获取商品列表
- **接口**: `POST /api/getProductList`
- **用途**: 获取农资商品列表
- **使用位置**: `src/views/admin/DeliveryManagement.vue`
- **请求参数**:
  ```json
  {
    "page": 1,
    "pageSize": 20,
    "isAdmin": true
  }
  ```

### 13. 创建商品
- **接口**: `POST /api/createProduct`
- **用途**: 创建新的农资商品
- **使用位置**: `src/views/admin/DeliveryManagement.vue`
- **请求参数**: 商品表单数据 + isAdmin: true

### 14. 更新商品
- **接口**: `POST /api/updateProduct`
- **用途**: 更新农资商品信息
- **使用位置**: `src/views/admin/DeliveryManagement.vue`
- **请求参数**: 包含_id的商品数据 + isAdmin: true

### 15. 删除商品
- **接口**: `POST /api/deleteProduct`
- **用途**: 删除农资商品
- **使用位置**: `src/views/admin/DeliveryManagement.vue`
- **请求参数**: 包含_id和isAdmin的数据

---

## 其他业务接口

以下接口在`src/api/cockpit.js`中定义，但可能在当前项目中未使用（可能是旧项目遗留）：

### 大数据相关接口

16. **经营主体单位**
    - `GET /api/bigData/getShop`
    
17. **经营主体单位分页**
    - `GET /api/bigData/getShopList/:typeId`
    
18. **检测共享实验室**
    - `GET /api/bigData/getReport`
    
19. **供应商分色管理**
    - `GET /api/bigData/getSupplyShop`
    
20. **食品溯源分类**
    - `GET /api/bigData/getCategory`
    
21. **分类商品列表**
    - `GET /api/bigData/getReportByCategory/:categoryId`
    
22. **消息推送**
    - `GET /api/bigData/getSystemMsg`
    
23. **信用评价**
    - `GET /api/bigData/getEvaluate`
    
24. **票据管理**
    - `GET /api/bigData/getBill`
    
25. **冷库列表**
    - `GET /api/bigData/getColdStorage`
    
26. **车辆列表**
    - `GET /api/bigData/getColdVehicle`
    
27. **健康证列表**
    - `GET /api/bigData/getStaff`
    
28. **测温记录**
    - `GET /api/bigData/getStaffTemperature`
    
29. **供应商列表**
    - `GET /api/bigData/getSupplyShopList/:typeId`
    
30. **事件列表**
    - `GET /api/bigData/getEventList`

### V1版本接口

31. **经营主体单位详情**
    - `GET /api/v1/bigData/shop/:id`
    
32. **获取供应商管理**
    - `GET /api/v1/bigData/shop/getShopList/:id/:typeId`
    
33. **获取从页人员**
    - `GET /api/v1/bigData/shop/getStaff/:id`
    
34. **车辆列表**
    - `GET /api/v1/bigData/shop/getColdVehicle/:id`
    
35. **检测管理**
    - `GET /api/v1/bigData/shop/getReport/:id`
    
36. **AI抓拍记录**
    - `GET /api/v1/bigData/shop/eventList/:id`
    
37. **AI摄像头**
    - `GET /api/v1/bigData/shop/getAiCamera/:id`
    
38. **冷库管理**
    - `GET /api/v1/bigData/shop/getColdStorage/:id`
    
39. **车辆定位**
    - `GET /api/v1/bigData/shop/getTrack/:id`

---

## 接口分类统计

### 当前项目实际使用的接口（15个）

#### 首页数据（1个）
1. `GET /api/getShopInfo` ⭐ **核心接口**

#### 后台管理（10个）
2. `POST /api/getShopInfo` - 加载配置
3. `POST /api/setShopInfo` - 保存配置
4. `POST /api/getAllOrders` - 获取订单列表
5. `POST /api/completeOrder` - 完成订单
6. `POST /api/submitEvaluate` - 审核评价
7. `POST /api/getInfoList` - 获取推广资讯列表
8. `POST /api/createInfo` - 创建推广资讯
9. `POST /api/updateInfo` - 更新推广资讯
10. `POST /api/deleteInfo` - 删除推广资讯
11. `POST /api/getSuggestList` - 获取意见咨询列表

#### 农资配送（4个）
12. `POST /api/getProductList` - 获取商品列表
13. `POST /api/createProduct` - 创建商品
14. `POST /api/updateProduct` - 更新商品
15. `POST /api/deleteProduct` - 删除商品

### 未使用的接口（24个）

这些接口在`src/api/cockpit.js`中定义，但在当前项目中未找到实际使用，可能是旧项目遗留的接口。

---

## 核心接口说明

### ⭐ `/api/getShopInfo` - 统一数据接口

这是项目的**核心接口**，用于获取首页所有展示数据。所有前端组件都从这个接口获取数据。

**请求方式**: GET（前端页面）或 POST（后台管理）

**返回数据结构** (参考 `database_export-shopinfo-new-oneline.json`):
- `shopInfo` - 园区介绍
- `title` - 标题配置
- `agricultural-machinery-services` - 农机服务
- `agricultural-management` - 地块管理
- `agricultural-services` - 农资服务
- `center-main` - 中心主数据
- `meteorological` - 气象数据
- `evaluate` - 评价数据
- `technology` - 技术数据
- `plots` - 地块列表
- `deviceList` - 设备列表
- 等其他配置数据

---

## 注意事项

1. **统一接口**: 首页所有数据都从 `/api/getShopInfo` 获取，这是一个统一的数据接口
2. **后台保存**: 后台配置通过 `/api/setShopInfo` 保存，保存的是完整的配置对象
3. **请求方式**: 大多数接口使用 POST 方式，参数放在请求体中
4. **管理员标识**: 后台管理相关接口需要在请求参数中包含 `isAdmin: true`

---

## 接口文件位置

- API定义文件: `src/api/cockpit.js`
- 使用位置: 
  - 前端页面: `src/views/*.vue`
  - 后台管理: `src/views/admin/*.vue`

---

*最后更新时间: 2024年*

