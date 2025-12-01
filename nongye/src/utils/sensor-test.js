/*
 * @Description: 传感器API测试工具
 * @Author: AI Assistant
 * @Date: 2024-01-01
 */
import { getRealTimeSensorData, getSensorToken, getSensorData } from "@/api/sensor.js";

/**
 * 测试传感器API功能
 */
export const testSensorAPI = async () => {
    console.log('=== 开始测试传感器API ===');
    
    try {
        // 1. 测试获取token
        console.log('1. 测试获取Token...');
        const token = await getSensorToken();
        console.log('Token获取成功:', token);
        
        // 2. 测试获取原始传感器数据
        console.log('2. 测试获取原始传感器数据...');
        const rawData = await getSensorData();
        console.log('原始传感器数据:', rawData);
        
        // 3. 测试获取格式化的实时数据
        console.log('3. 测试获取格式化的实时传感器数据...');
        const formattedData = await getRealTimeSensorData();
        console.log('格式化传感器数据:', formattedData);
        
        // 4. 数据验证
        console.log('4. 数据验证...');
        const validation = validateSensorData(formattedData);
        console.log('数据验证结果:', validation);
        
        console.log('=== 传感器API测试完成 ===');
        return {
            success: true,
            token,
            rawData,
            formattedData,
            validation
        };
        
    } catch (error) {
        console.error('传感器API测试失败:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * 验证传感器数据的完整性和有效性
 */
const validateSensorData = (data) => {
    const checks = {
        hasAirTemperature: data.airTemperature !== undefined && data.airTemperature !== null,
        hasAirHumidity: data.airHumidity !== undefined && data.airHumidity !== null,
        hasSoilTemperature: data.soilTemperature !== undefined && data.soilTemperature !== null,
        hasSoilHumidity: data.soilHumidity !== undefined && data.soilHumidity !== null,
        hasIlluminance: data.illuminance !== undefined && data.illuminance !== null,
        hasCO2: data.co2 !== undefined && data.co2 !== null,
        hasPressure: data.atmosphericPressure !== undefined && data.atmosphericPressure !== null,
        hasBatteryVoltage: data.batteryVoltage !== undefined && data.batteryVoltage !== null,
        hasLastUpdateTime: data.lastUpdateTime !== undefined && data.lastUpdateTime !== '',
        hasTotalSensors: data.totalSensors !== undefined && data.totalSensors > 0
    };
    
    const passedChecks = Object.values(checks).filter(check => check).length;
    const totalChecks = Object.keys(checks).length;
    
    return {
        checks,
        score: `${passedChecks}/${totalChecks}`,
        percentage: Math.round((passedChecks / totalChecks) * 100),
        isValid: passedChecks >= totalChecks * 0.8 // 至少80%的数据有效
    };
};

/**
 * 监控传感器数据变化
 */
export const monitorSensorData = (interval = 30000, maxRuns = 10) => {
    let runCount = 0;
    
    const monitor = setInterval(async () => {
        runCount++;
        console.log(`=== 传感器数据监控 #${runCount} ===`);
        
        try {
            const data = await getRealTimeSensorData();
            console.log('监控数据:', {
                时间: data.lastUpdateTime,
                空气温度: `${data.airTemperature}℃`,
                土壤温度: `${data.soilTemperature}℃`,
                土壤湿度: `${data.soilHumidity}%`,
                光照强度: `${data.illuminance}lux`,
                电池电压: `${data.batteryVoltage}V`
            });
        } catch (error) {
            console.error('监控过程中出错:', error);
        }
        
        if (runCount >= maxRuns) {
            clearInterval(monitor);
            console.log('=== 传感器数据监控结束 ===');
        }
    }, interval);
    
    return monitor;
};

// 在浏览器开发者工具中可以使用的全局函数
if (typeof window !== 'undefined') {
    window.testSensorAPI = testSensorAPI;
    window.monitorSensorData = monitorSensorData;
    
    console.log('传感器测试工具已加载，可以在控制台中使用:');
    console.log('- testSensorAPI() : 测试传感器API');
    console.log('- monitorSensorData() : 监控传感器数据变化');
} 