# 农业传感器数据API集成说明

## 概述

本项目已成功集成第三方农业传感器数据API，实现了实时获取和显示各种环境和土壤传感器数据。

## 功能特性

### ✅ 已实现功能

1. **传感器数据API封装** (`src/api/sensor.js`)
   - 自动获取和管理访问Token
   - 实时传感器数据获取
   - 数据格式化和错误处理
   - Token自动刷新机制

2. **数据显示组件更新**
   - **气象组件** (`src/views/index-model/meteorological.vue`)
     - 光照强度、空气温度、空气湿度
     - 大气压力、二氧化碳浓度
   - **环境组件** (`src/views/index-model/environment.vue`)
     - 土壤温度、土壤湿度、土壤电导率
     - 土壤PH值、土壤氮磷钾含量

3. **实时监控面板** (`src/views/index-model/center-main.vue`)
   - 传感器状态显示组件
   - 设备在线状态、电池电压
   - 关键传感器数据实时显示

4. **测试工具** (`src/utils/sensor-test.js`)
   - API功能测试
   - 数据监控工具
   - 数据完整性验证

## API配置信息

### 第三方API详情
- **基础URL**: `https://console.sciento.cn`
- **Client ID**: `hGLzTZ85ffXaN3SM`
- **Client Secret**: `Jfe7Lwhmkk97lHZr`
- **设备EUI**: `00bce9971932000007991517`

### 数据更新频率
- 所有组件默认每30秒自动刷新数据
- 支持手动触发数据更新
- Token自动管理，提前5分钟刷新

## 传感器数据类型

### 环境数据
- **空气温度** (℃) - airT
- **空气湿度** (%) - airH  
- **光照强度** (Lux) - ill
- **二氧化碳浓度** (ppm) - co2
- **大气压力** (hPa) - atm

### 土壤数据
- **土壤温度** (℃) - soilT
- **土壤湿度** (%) - soilH
- **土壤电导率** (uS/cm) - soilC
- **土壤盐分** (ppm) - soilS
- **土壤PH值** - dPH
- **土壤氮** (mg/kg) - sN
- **土壤磷** (mg/kg) - sP
- **土壤钾** (mg/kg) - sK

### 设备数据
- **电池电压** (V) - vbat
- **设备EUI** - deviceEui
- **传感器总数** - totalSensors

## 使用方法

### 1. 获取实时传感器数据
```javascript
import { getRealTimeSensorData } from "@/api/sensor.js";

// 获取格式化的传感器数据
const sensorData = await getRealTimeSensorData();
console.log(sensorData);
```

### 2. 获取原始传感器数据
```javascript
import { getSensorData } from "@/api/sensor.js";

// 获取原始API数据
const rawData = await getSensorData({
    page: 1,
    size: 10,
    eui: '00bce9971932000007991517'
});
```

### 3. 测试API功能
```javascript
import { testSensorAPI } from "@/utils/sensor-test.js";

// 测试所有API功能
const testResult = await testSensorAPI();
```

### 4. 在浏览器控制台中测试
```javascript
// 打开浏览器开发者工具，在控制台运行
testSensorAPI();           // 测试API功能
monitorSensorData();       // 监控数据变化
```

## 组件集成示例

### 在Vue组件中使用
```vue
<template>
  <div>
    <div>温度: {{ sensorData.airTemperature }}℃</div>
    <div>湿度: {{ sensorData.airHumidity }}%</div>
  </div>
</template>

<script>
import { getRealTimeSensorData } from "@/api/sensor.js";

export default {
  data() {
    return {
      sensorData: {},
      timer: null
    };
  },
  async mounted() {
    await this.loadSensorData();
    this.timer = setInterval(() => {
      this.loadSensorData();
    }, 30000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    async loadSensorData() {
      try {
        this.sensorData = await getRealTimeSensorData();
      } catch (error) {
        console.error('获取传感器数据失败:', error);
      }
    }
  }
};
</script>
```

## 错误处理

### 常见错误类型
1. **Token过期**: 自动重新获取Token并重试
2. **网络错误**: 返回默认值，避免页面崩溃
3. **数据格式错误**: 提供数据验证和容错处理

### 错误处理机制
- 所有API调用都有完整的try-catch包装
- 提供降级方案，确保页面正常显示
- 详细的错误日志记录

## 性能优化

### 已实现的优化
1. **Token缓存**: 避免频繁获取Token
2. **数据缓存**: 减少不必要的API调用
3. **定时器管理**: 组件销毁时自动清理定时器
4. **错误恢复**: 网络错误时自动重试机制

## 部署注意事项

### 生产环境配置
1. 确保服务器可以访问`https://console.sciento.cn`
2. 检查防火墙和代理设置
3. 监控API调用频率，避免超出限制

### 安全考虑
1. API密钥已在代码中硬编码（生产环境建议使用环境变量）
2. 所有API调用使用HTTPS协议
3. 实现了Token的安全管理机制

## 扩展功能建议

### 可以添加的功能
1. **历史数据图表**: 显示传感器数据趋势
2. **阈值报警**: 设置数据异常提醒
3. **数据导出**: 支持Excel/CSV数据导出
4. **多设备支持**: 支持多个传感器设备切换
5. **数据统计**: 添加日/周/月统计功能

## 技术栈

- **Vue 2.6**: 前端框架
- **Axios**: HTTP请求库
- **SCSS**: 样式预处理器
- **ES6+**: JavaScript语法

## 联系方式

如有问题或需要技术支持，请查看：
- API文档: 第三方提供的接口文档
- 项目代码: 查看相关组件和API封装代码
- 测试工具: 使用`src/utils/sensor-test.js`进行调试

---

**集成完成时间**: 2024年1月1日  
**版本**: v1.0.0  
**状态**: ✅ 完成并可用 