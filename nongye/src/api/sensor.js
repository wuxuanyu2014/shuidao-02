/*
 * @Description: 传感器数据API - 对接第三方接口
 * @Author: AI Assistant
 * @Date: 2024-01-01
 */
import axios from 'axios';
import qs from 'qs';

// 第三方API配置
const SENSOR_API_CONFIG = {
  baseURL: 'https://console.sciento.cn',
  clientId: 'N73QAGfzduy2R123',
  clientSecret: 'bQpC1WaSKe490JXP',
  deviceEui: '00b9e08628724000071c940c', // 环境传感器设备
  weatherStationEui: '00b9dd5528724000076d940c' // 气象站设备
};

// 创建专门用于传感器API的axios实例
const sensorAxios = axios.create({
  baseURL: SENSOR_API_CONFIG.baseURL,
  timeout: 20000
});

// Token存储和管理
let tokenInfo = {
  access_token: null,
  expires_in: 0,
  token_type: 'bearer',
  expires_at: 0 // 过期时间戳
};

/**
 * 获取访问token
 * @returns {Promise} 返回token信息
 */
export const getSensorToken = async () => {
  try {
    // 检查当前token是否还有效（提前5分钟过期）
    const now = Date.now();
    if (tokenInfo.access_token && tokenInfo.expires_at > now + 5 * 60 * 1000) {
      return tokenInfo;
    }

    const data = qs.stringify({});
    
    const config = {
      method: 'post',
      url: `/oauth/oauth/token?client_id=${SENSOR_API_CONFIG.clientId}&client_secret=${SENSOR_API_CONFIG.clientSecret}&grant_type=client_credentials&source_type=web`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    const response = await sensorAxios(config);
    
    if (response.data && response.data.access_token) {
      tokenInfo = {
        ...response.data,
        expires_at: now + (response.data.expires_in * 1000) // 设置过期时间戳
      };
      
      console.log('传感器API Token获取成功:', tokenInfo);
      return tokenInfo;
    } else {
      throw new Error('获取token失败: 响应数据格式不正确');
    }
  } catch (error) {
    console.error('获取传感器API Token失败:', error);
    throw error;
  }
};

/**
 * 获取传感器数据
 * @param {Object} params 查询参数
 * @param {number} params.page 页码，默认1
 * @param {number} params.size 每页数量，默认10
 * @param {string} params.eui 设备EUI，可选，默认使用配置中的设备
 * @returns {Promise} 返回传感器数据
 */
export const getSensorData = async (params = {}) => {
  try {
    // 确保有有效的token
    const token = await getSensorToken();
    
    const {
      page = 1,
      size = 10,
      eui = SENSOR_API_CONFIG.deviceEui
    } = params;

    const config = {
      method: 'get',
      url: `/wopen/v1/759/device/gateway/eui/collection?page=${page}&size=${size}&eui=${eui}`,
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    console.log(`正在调用传感器API: ${config.url}`);
    const response = await sensorAxios(config);
    
    if (response.data && response.data.type && response.data.code === 200) {
      console.log('传感器数据获取成功:', response.data);
      return response.data;
    } else {
      throw new Error('获取传感器数据失败: 响应数据格式不正确');
    }
  } catch (error) {
    console.error('获取传感器数据失败:', error);
    
    // 如果是token过期，清除token信息并重试一次
    if (error.response && error.response.status === 401) {
      tokenInfo = {
        access_token: null,
        expires_in: 0,
        token_type: 'bearer',
        expires_at: 0
      };
      
      // 重试一次
      if (!params._retry) {
        console.log('Token可能过期，正在重新获取并重试...');
        return await getSensorData({ ...params, _retry: true });
      }
    }
    
    throw error;
  }
};

/**
 * 获取所有传感器数据（获取完整列表）
 * @returns {Promise} 返回所有传感器数据
 */
export const getAllSensorData = async () => {
  try {
    // 首先获取第一页数据以了解总数量
    const firstPage = await getSensorData({ page: 1, size: 1 });
    console.log('第一页数据:', firstPage);
    
    if (firstPage.data && firstPage.data.totalElements) {
      const totalElements = firstPage.data.totalElements;
      console.log(`检测到 ${totalElements} 个传感器，正在获取所有数据...`);
      
      // 获取所有传感器数据
      const allData = await getSensorData({ page: 1, size: totalElements });
      console.log(`成功获取所有 ${totalElements} 个传感器数据`);
      return allData;
    } else {
      console.log('无法获取totalElements，直接使用大数量获取所有数据...');
      // 如果无法获取总数，直接用一个较大的数量获取
      const allData = await getSensorData({ page: 1, size: 100 });
      return allData;
    }
  } catch (error) {
    console.error('获取所有传感器数据失败，尝试用默认大小获取:', error);
    // 如果获取失败，尝试用默认大小获取
    try {
      const fallbackData = await getSensorData({ page: 1, size: 50 });
      return fallbackData;
    } catch (fallbackError) {
      console.error('备用方案也失败:', fallbackError);
      throw fallbackError;
    }
  }
};

/**
 * 获取气象站传感器数据
 * @returns {Promise} 返回处理后的气象站传感器数据对象
 */
export const getWeatherStationData = async () => {
  try {
    // 获取气象站传感器数据
    console.log('正在获取气象站传感器数据...');
    const response = await getSensorData({ 
      page: 1, 
      size: 50, 
      eui: SENSOR_API_CONFIG.weatherStationEui 
    });
    
    if (response.data && response.data.content && Array.isArray(response.data.content)) {
      const sensors = response.data.content;
      console.log('获取到的气象站传感器数据:', sensors);
      
      // 创建一个对象来存储不同类型的传感器数据
      const sensorMap = {};
      let lastUpdateTime = '';
      
      // 遍历所有传感器，根据circuit字段分类
      sensors.forEach(sensor => {
        if (sensor.circuit && sensor.newestData !== null && sensor.newestData !== undefined) {
          sensorMap[sensor.circuit] = {
            value: sensor.newestData,
            time: sensor.newestTime,
            unit: sensor.unit,
            name: sensor.name,
            online: sensor.online
          };
          
          // 记录最新的更新时间
          if (sensor.newestTime && sensor.newestTime > lastUpdateTime) {
            lastUpdateTime = sensor.newestTime;
          }
        }
      });
      
      console.log('气象站传感器数据映射:', sensorMap);
      
      // 将传感器数据映射到气象站组件需要的格式
      return {
        // 气象相关传感器
        illuminance: sensorMap.ill?.value || 0,         // 光照强度 (circuit: "ill")
        airTemperature: sensorMap.airT?.value || 0,     // 空气温度 (circuit: "airT")
        airHumidity: sensorMap.airH?.value || 0,        // 空气湿度 (circuit: "airH")
        co2: sensorMap.co2?.value || 0,                 // 二氧化碳浓度 (circuit: "co2")
        atmosphericPressure: sensorMap.atm?.value || 0, // 大气压力 (circuit: "atm")
        
        // 气象站特有传感器
        windSpeed: sensorMap.windS?.value || 0,         // 风速 (circuit: "windS")
        rainfall: sensorMap.rainF?.value || 0,          // 降雨量 (circuit: "rainF")
        pm25: sensorMap.pm25?.value || 0,               // PM2.5 (circuit: "pm25")
        pm10: sensorMap.pm10?.value || 0,               // PM10 (circuit: "pm10")
        
        // 设备相关
        batteryVoltage: sensorMap.vbat?.value || 0,     // 电池电压 (circuit: "vbat")
        
        // 原始数据（包含详细信息）
        rawData: sensorMap,
        allSensors: sensors,
        
        // 设备信息
        deviceEui: SENSOR_API_CONFIG.weatherStationEui,
        totalSensors: sensors.length,
        lastUpdateTime: lastUpdateTime || new Date().toLocaleString('zh-CN')
      };
    } else {
      throw new Error('气象站传感器数据格式不正确');
    }
  } catch (error) {
    console.error('获取气象站传感器数据失败:', error);
    // 返回默认数值，避免页面崩溃
    return {
      illuminance: 0,
      airTemperature: 0,
      airHumidity: 0,
      co2: 0,
      atmosphericPressure: 0,
      windSpeed: 0,
      rainfall: 0,
      pm25: 0,
      pm10: 0,
      batteryVoltage: 0,
      rawData: null,
      allSensors: [],
      deviceEui: '',
      totalSensors: 0,
      lastUpdateTime: new Date().toLocaleString('zh-CN'),
      error: error.message
    };
  }
};

/**
 * 获取实时传感器数据（简化版，只返回传感器数值）
 * @returns {Promise} 返回处理后的传感器数据对象
 */
export const getRealTimeSensorData = async () => {
  try {
    // 直接获取所有传感器数据（根据您的接口，您有14个传感器）
    console.log('正在获取所有传感器数据...');
    const response = await getSensorData({ page: 1, size: 100 }); // 使用足够大的数量
    
    if (response.data && response.data.content && Array.isArray(response.data.content)) {
      const sensors = response.data.content;
      console.log('获取到的所有传感器数据:', sensors);
      
      // 创建一个对象来存储不同类型的传感器数据
      const sensorMap = {};
      let lastUpdateTime = '';
      
      // 遍历所有传感器，根据circuit字段分类
      sensors.forEach(sensor => {
        if (sensor.circuit && sensor.newestData !== null && sensor.newestData !== undefined) {
          sensorMap[sensor.circuit] = {
            value: sensor.newestData,
            time: sensor.newestTime,
            unit: sensor.unit,
            name: sensor.name,
            online: sensor.online
          };
          
          // 记录最新的更新时间
          if (sensor.newestTime && sensor.newestTime > lastUpdateTime) {
            lastUpdateTime = sensor.newestTime;
          }
        }
      });
      
      console.log('传感器数据映射:', sensorMap);
      
             // 将传感器数据映射到组件需要的格式
       // 根据实际API返回的circuit字段进行映射
       return {
         // 空气相关传感器
         airTemperature: sensorMap.airT?.value || 0,     // 空气温度 (circuit: "airT")
         airHumidity: sensorMap.airH?.value || 0,        // 空气湿度 (circuit: "airH")
         illuminance: sensorMap.ill?.value || 0,         // 光照强度 (circuit: "ill")
         co2: sensorMap.co2?.value || 0,                 // 二氧化碳浓度 (circuit: "co2")
         atmosphericPressure: sensorMap.atm?.value || 0, // 大气压力 (circuit: "atm")
         
         // 土壤相关传感器
         soilTemperature: sensorMap.soilT?.value || 0,   // 土壤温度 (circuit: "soilT")
         soilHumidity: sensorMap.soilH?.value || 0,      // 土壤湿度 (circuit: "soilH")
         soilConductivity: sensorMap.soilC?.value || 0,  // 土壤电导率 (circuit: "soilC")
         soilPH: sensorMap.dPH?.value || 0,              // 土壤PH值 (circuit: "dPH")
         soilNitrogen: sensorMap.sN?.value || 0,         // 土壤氮 (circuit: "sN")
         soilPhosphorus: sensorMap.sP?.value || 0,       // 土壤磷 (circuit: "sP")
         soilPotassium: sensorMap.sK?.value || 0,        // 土壤钾 (circuit: "sK")
         
         // 额外传感器数据
         soilSalinity: sensorMap.soilS?.value || 0,      // 土壤盐分 (circuit: "soilS")
         
         // 设备相关
         batteryVoltage: sensorMap.vbat?.value || 0,     // 电池电压 (circuit: "vbat")
        
        // 原始数据（包含详细信息）
        rawData: sensorMap,
        allSensors: sensors,
        
        // 设备信息
        deviceEui: SENSOR_API_CONFIG.deviceEui,
        totalSensors: sensors.length,
        lastUpdateTime: lastUpdateTime || new Date().toLocaleString('zh-CN')
      };
    } else {
      throw new Error('传感器数据格式不正确');
    }
  } catch (error) {
    console.error('获取实时传感器数据失败:', error);
    // 返回默认数值，避免页面崩溃
    return {
      airTemperature: 0,
      airHumidity: 0,
      illuminance: 0,
      co2: 0,
      atmosphericPressure: 0,
      soilTemperature: 0,
      soilHumidity: 0,
      soilConductivity: 0,
      soilPH: 0,
      soilNitrogen: 0,
      soilPhosphorus: 0,
      soilPotassium: 0,
      batteryVoltage: 0,
      rawData: null,
      allSensors: [],
      deviceEui: '',
      totalSensors: 0,
      lastUpdateTime: new Date().toLocaleString('zh-CN'),
      error: error.message
    };
  }
};

/**
 * 获取传感器历史数据（可扩展）
 * @param {Object} params 查询参数
 * @returns {Promise} 返回历史数据
 */
export const getSensorHistoryData = async (params = {}) => {
  try {
    const { page = 1, size = 50 } = params;
    return await getSensorData({ page, size });
  } catch (error) {
    console.error('获取传感器历史数据失败:', error);
    throw error;
  }
};

// 导出配置，供外部使用
export const sensorConfig = SENSOR_API_CONFIG; 