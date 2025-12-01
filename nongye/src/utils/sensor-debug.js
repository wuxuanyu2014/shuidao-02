/*
 * @Description: 传感器数据调试工具
 * @Author: AI Assistant  
 * @Date: 2024-01-01
 */

import { getRealTimeSensorData, getWeatherStationData } from '@/api/sensor.js';

/**
 * 测试传感器数据获取和映射
 */
export const testSensorData = async () => {
  try {
    console.group('🔍 传感器数据调试');
    console.log('开始测试传感器数据获取...');
    
    const data = await getRealTimeSensorData();
    
    console.log('✅ API调用成功');
    console.log('📊 传感器数据概览:');
    console.table({
      '光照强度': data.illuminance + ' lux',
      '空气温度': data.airTemperature + ' ℃', 
      '空气湿度': data.airHumidity + ' %RH',
      '二氧化碳': data.co2 + ' ppm',
      '大气压力': data.atmosphericPressure + ' hPa',
      '土壤温度': data.soilTemperature + ' ℃',
      '土壤湿度': data.soilHumidity + ' %',
      '土壤电导率': data.soilConductivity + ' uS/cm',
      '土壤PH值': data.soilPH + ' pH',
      '土壤氮': data.soilNitrogen + ' mg/kg',
      '土壤磷': data.soilPhosphorus + ' mg/kg', 
      '土壤钾': data.soilPotassium + ' mg/kg'
    });
    
    console.log('⚡ 设备信息:');
    console.table({
      '设备EUI': data.deviceEui,
      '传感器总数': data.totalSensors,
      '最后更新': data.lastUpdateTime,
      '电池电压': data.batteryVoltage + ' V'
    });
    
    console.log('🗂️ 原始传感器映射:', data.rawData);
    console.log('📝 所有传感器详情:', data.allSensors);
    
    console.groupEnd();
    return data;
  } catch (error) {
    console.group('❌ 传感器数据调试 - 错误');
    console.error('获取传感器数据失败:', error);
    console.groupEnd();
    throw error;
  }
};

/**
 * 测试气象站传感器数据获取和映射
 */
export const testWeatherStationData = async () => {
  try {
    console.group('🌤️ 气象站数据调试');
    console.log('开始测试气象站传感器数据获取...');
    
    const data = await getWeatherStationData();
    
    console.log('✅ 气象站API调用成功');
    console.log('📊 气象站传感器数据概览:');
    console.table({
      '光照强度': data.illuminance + ' lux',
      '空气温度': data.airTemperature + ' ℃', 
      '空气湿度': data.airHumidity + ' %RH',
      '二氧化碳': data.co2 + ' ppm',
      '大气压力': data.atmosphericPressure + ' hPa',
      '风速': data.windSpeed + ' m/s',
      '降雨量': data.rainfall + ' mm',
      'PM2.5': data.pm25 + ' μg/m³',
      'PM10': data.pm10 + ' μg/m³'
    });
    
    console.log('⚡ 气象站设备信息:');
    console.table({
      '设备EUI': data.deviceEui,
      '传感器总数': data.totalSensors,
      '最后更新': data.lastUpdateTime,
      '电池电压': data.batteryVoltage + ' V'
    });
    
    console.log('🗂️ 原始气象站传感器映射:', data.rawData);
    console.log('📝 所有气象站传感器详情:', data.allSensors);
    
    console.groupEnd();
    return data;
  } catch (error) {
    console.group('❌ 气象站数据调试 - 错误');
    console.error('获取气象站传感器数据失败:', error);
    console.groupEnd();
    throw error;
  }
};

/**
 * 在控制台中测试传感器数据
 * 在浏览器控制台中调用: window.testSensorData()
 */
if (typeof window !== 'undefined') {
  window.testSensorData = testSensorData;
  window.testWeatherStationData = testWeatherStationData;
} 