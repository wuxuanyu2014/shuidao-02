# 首页组件 API 对接总结

## 修改概述

已成功将首页所有子组件从静态数据改为动态API对接，每个组件都实现了以下功能：
1. 首次加载时从localStorage获取已缓存的数据
2. 同时调用API获取最新数据
3. 如果API调用成功，更新数据并存储到localStorage
4. 如果API调用失败，继续使用localStorage中的缓存数据或默认数据

## 修改的组件列表

### 1. 标题组件 (`src/views/index-model/title.vue`)
- **API接口**: `GET /getTitleInfo`
- **数据字段**: 
  - `mainTitle`: 主标题
  - `subTitle`: 副标题
- **缓存键名**: `mainTitle`, `subTitle`

### 2. 农事服务中心 (`src/views/index-model/corporate-culture.vue`)
- **API接口**: `GET /getShopInfo`
- **数据字段**:
  - `title`: 服务中心标题
  - `content`: 服务中心介绍内容（支持HTML）
- **缓存键名**: `shopTitle`, `shopContent`

### 3. 产业升级 (`src/views/index-model/industrial-upgrading.vue`)
- **API接口**: `GET /getIndustryInfo`
- **数据字段**:
  - `title`: 产业升级标题
  - `content`: 产业升级介绍内容（支持HTML）
- **缓存键名**: `industryTitle`, `industryContent`

### 4. 数字化乡村 (`src/views/index-model/digital-countryside.vue`)
- **API接口**: `GET /getDigitalInfo`
- **数据字段**:
  - `title`: 数字化乡村标题
  - `content`: 数字化乡村介绍内容（支持HTML）
- **缓存键名**: `digitalTitle`, `digitalContent`

### 5. 统计数据 (`src/views/index-model/statistical-data.vue`)
- **API接口**: `GET /getStatisticsInfo`
- **数据字段**: 数组格式，每个元素包含：
  - `title`: 统计项标题
  - `number`: 统计数值
  - `unit`: 统计单位
- **缓存键名**: `statisticsData`

### 6. 视频展示 (`src/views/index-model/video-display.vue`)
- **API接口**: `GET /getVideoInfo`
- **数据字段**:
  - `videoUrl`: 视频文件地址
  - `posterUrl`: 视频封面图片地址
- **缓存键名**: `videoSrc`, `videoPoster`

## API 接口规范

所有API接口的响应格式应为：
```json
{
  "success": true,
  "data": {
    // 具体数据内容
  }
}
```

## 技术实现要点

1. **渐进式加载**: 页面首次加载时先显示缓存数据，然后在后台更新最新数据
2. **容错处理**: API调用失败时不影响页面正常显示
3. **数据持久化**: 使用localStorage进行数据缓存
4. **HTML内容支持**: 部分组件支持HTML格式的内容渲染
5. **日志记录**: 在控制台输出数据更新状态，便于调试

## 使用说明

1. 确保API服务器正常运行
2. 所有接口都配置了正确的CORS头以支持跨域请求
3. 组件会自动处理数据加载和缓存，无需额外配置
4. 可以通过浏览器开发工具的Application -> Local Storage查看缓存的数据

## 注意事项

- 所有API接口都使用了统一的域名：`http://cloud1-3gb8kc9hee10782c-1365771753.ap-shanghai.app.tcloudbase.com`
- 如需修改API域名，需要在每个组件中更新相应的URL
- localStorage中的数据会永久保存，直到用户清除浏览器数据或网站主动清除 