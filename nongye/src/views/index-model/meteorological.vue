<template>
    <div>
        <div class="meteorological">
            <base-title>
                <img slot="title" src="@/assets/image/index/meteorological.png" alt="">
            </base-title>
            <div class="info">
                <div class="items">
                    <div class="item">
                        <img src="@/assets/image/meteorological/icon-1.png" alt="">
                        <div class="item-info">
                            <div class="item-title">光照</div>
                            <div class="item-content">
                                {{ sensorData.illuminance || '0' }} <div class="unit">lux</div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img src="@/assets/image/meteorological/icon-2.png" alt="">
                        <div class="item-info">
                            <div class="item-title">风速</div>
                            <div class="item-content">
                                {{ sensorData.windSpeed || '0' }}<div class="unit">m/s</div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img src="@/assets/image/meteorological/icon-3.png" alt="">
                        <div class="item-info">
                            <div class="item-title">风向</div>
                            <div class="item-content">
                                东北风
                            </div>
                        </div>
                    </div>
                </div>
                <div class="items">
                    <div class="item">
                        <img src="@/assets/image/meteorological/icon-4.png" alt="">
                        <div class="item-info">
                            <div class="item-title">PM</div>
                            <div class="item-content">
                                {{ sensorData.pm25 || '0' }}/{{ sensorData.pm10 || '0' }}<div class="unit">μg/m³</div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img src="@/assets/image/meteorological/icon-5.png" alt="">
                        <div class="item-info">
                            <div class="item-title">雨量</div>
                            <div class="item-content">
                                {{ sensorData.rainfall || '0' }}<div class="unit">mm</div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img src="@/assets/image/meteorological/icon-6.png" alt="">
                        <div class="item-info">
                            <div class="item-title">温度</div>
                            <div class="item-content">
                                {{ sensorData.airTemperature || '0' }}<div class="unit">℃</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="items">
                    <div class="item">
                        <img src="@/assets/image/meteorological/icon-7.png" alt="">
                        <div class="item-info">
                            <div class="item-title">湿度</div>
                            <div class="item-content">
                                {{ sensorData.airHumidity || '0' }}<div class="unit">%RH</div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img src="@/assets/image/meteorological/icon-8.png" alt="">
                        <div class="item-info">
                            <div class="item-title">大气压</div>
                            <div class="item-content">
                                {{ sensorData.atmosphericPressure ? (sensorData.atmosphericPressure / 100).toFixed(1) : '0' }}<div class="unit">kpa</div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img src="@/assets/image/meteorological/icon-9.png" alt="">
                        <div class="item-info">
                            <div class="item-title">二氧化碳</div>
                            <div class="item-content">
                                {{ sensorData.co2 || '0' }}<div class="unit">ppm</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <!-- 数据更新时间显示 -->
            <div class="update-time">
                数据更新时间: {{ sensorData.lastUpdateTime || '暂无数据' }}
            </div>
        </div>
    </div>
</template>
<script>
import BaseTitle from "@/components/base-title.vue";
import { getWeatherStationData } from "@/api/sensor.js";
import { testWeatherStationData } from "@/utils/sensor-debug.js";
import { getShopInfo } from "@/api/cockpit.js";

export default {
    name: "meteorological",
    components: {
        BaseTitle
    },
    data() {
        return {
            sensorData: {
                illuminance: 0,
                airTemperature: 0,
                airHumidity: 0,
                atmosphericPressure: 0,
                co2: 0,
                windSpeed: 0,
                rainfall: 0,
                pm25: 0,
                pm10: 0,
                lastUpdateTime: ''
            },
            timer: null
        };
    },
    mounted() {
        this.init();
        
        // 开发环境下，将调试函数暴露到全局
        if (process.env.NODE_ENV === 'development') {
            window.debugWeatherStation = this.debugWeatherStationData;
            console.log('🌤️ 气象站调试函数已暴露: window.debugWeatherStation()');
        }
    },
    beforeDestroy() {
        // 组件销毁前清除定时器
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    methods: {
        async init() {
            // 首先从统一接口获取配置数据
            await this.fetchMeteorologicalConfig();
            
            // 初始加载数据
            await this.loadSensorData();
            
            // 设置定时刷新，每30秒更新一次数据
            this.timer = setInterval(() => {
                this.loadSensorData();
            }, 30000);
        },
        
        // 从统一接口获取配置数据
        async fetchMeteorologicalConfig() {
            try {
                const response = await getShopInfo();
                const resData = response.data.data;
                if (resData && resData['meteorological']) {
                    const meteoData = resData['meteorological'];
                    if (meteoData.humidity !== undefined) {
                        this.sensorData.airHumidity = meteoData.humidity;
                    }
                    if (meteoData.temperature !== undefined) {
                        this.sensorData.airTemperature = meteoData.temperature;
                    }
                    if (meteoData.lightIntensity !== undefined) {
                        this.sensorData.illuminance = meteoData.lightIntensity;
                    }
                    if (meteoData.soilTemperature !== undefined) {
                        this.sensorData.soilTemperature = meteoData.soilTemperature;
                    }
                    if (meteoData.ph !== undefined) {
                        this.sensorData.co2 = meteoData.ph;
                    }
                    localStorage.setItem('meteorological', JSON.stringify(meteoData));
                    console.log('气象数据更新成功:', meteoData);
                }
            } catch (error) {
                // 接口失败时兜底读取localStorage
                const cachedData = localStorage.getItem('meteorological');
                if (cachedData) {
                    try {
                        const data = JSON.parse(cachedData);
                        this.sensorData.airHumidity = data.humidity || 72;
                        this.sensorData.airTemperature = data.temperature || 26;
                        this.sensorData.illuminance = data.lightIntensity || 900;
                        this.sensorData.soilTemperature = data.soilTemperature || 24;
                        this.sensorData.co2 = data.ph || 7.2;
                    } catch (e) {
                        console.error('解析气象数据失败:', e);
                    }
                }
                console.error('获取气象数据失败:', error);
            }
        },
        
        // 调试方法：手动测试气象站传感器数据
        async debugWeatherStationData() {
            console.log('🔧 手动测试气象站传感器数据...');
            try {
                await testWeatherStationData();
            } catch (error) {
                console.error('气象站调试失败:', error);
            }
        },
        
        async loadSensorData() {
            try {
                console.log('开始获取气象站传感器数据...');
                const data = await getWeatherStationData();
                console.log('气象站API返回的原始数据:', data);
                
                this.sensorData = {
                    illuminance: data.illuminance,
                    airTemperature: data.airTemperature,
                    airHumidity: data.airHumidity,
                    atmosphericPressure: data.atmosphericPressure,
                    co2: data.co2,
                    windSpeed: data.windSpeed,
                    rainfall: data.rainfall,
                    pm25: data.pm25,
                    pm10: data.pm10,
                    lastUpdateTime: data.lastUpdateTime
                };
                
                console.log('气象数据更新成功:', this.sensorData);
                console.log('所有气象站传感器详细信息:', data.allSensors);
                console.log('气象站传感器映射数据:', data.rawData);
            } catch (error) {
                console.error('获取气象传感器数据失败:', error);
                // 显示错误信息给用户
                this.sensorData.lastUpdateTime = `获取失败: ${error.message}`;
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.meteorological {
    .info {
        width: 100%;
        padding: 18px 32px 0;

        .items {
            display: flex;
            margin-bottom: 24px;
        }

        .item {
            flex: 1;

            &:first-child {
                flex: none;
                width: 310px;
            }

            position: relative;
            padding: 30px 0 0 122px;

            .item-info {
                height: 80px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .item-title {
                    font-size: 24px;
                    color: #C9EBFF;
                }

                .item-content {
                    display: flex;
                    height: 46px;
                    font-weight: bold;
                    font-size: 32px;
                    line-height: 46px;
                    color: transparent; // 关键：让文字透明
                    background: linear-gradient(#FFFFFF 0%, #46AEFA 100%);
                    background-clip: text;

                    .unit {
                        font-size: 24px;
                        color: #C9EBFF;
                        line-height: 52px;
                        margin-left: 6px;
                    }
                }
            }

            img {
                position: absolute;
                left: 0;
                top: 0;
            }
        }
    }

    .update-time {
        text-align: center;
        margin-top: 20px;
        padding: 10px;
        font-size: 18px;
        color: #8BC7FF;
        opacity: 0.8;
        background: rgba(43, 78, 126, 0.3);
        border-radius: 8px;
        margin: 20px 32px 0;
    }
}
</style>