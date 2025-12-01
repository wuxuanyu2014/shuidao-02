<template>
    <div>
        <div class="environment">
            <base-title>
                <img slot="title" src="@/assets/image/index/environment.png" alt="">
            </base-title>
            <div class="info">
                <div class="items">
                    <div class="item">
                        <img src="@/assets/image/environment/icon-1.png" alt="">
                        <div class="item-info">
                            <div class="item-title">光照</div>
                            <div class="item-content">
                                {{ sensorData.illuminance || '0' }} <div class="unit">lux</div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img src="@/assets/image/environment/icon-2.png" alt="">
                        <div class="item-info">
                            <div class="item-title">温度</div>
                            <div class="item-content">
                                {{ sensorData.airTemperature || '0' }}<div class="unit">℃</div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img src="@/assets/image/environment/icon-3.png" alt="">
                        <div class="item-info">
                            <div class="item-title">湿度</div>
                            <div class="item-content">
                                {{ sensorData.airHumidity || '0' }}<div class="unit">%RH</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="items">
                    <div class="item">
                        <img src="@/assets/image/environment/icon-4.png" alt="">
                        <div class="item-info">
                            <div class="item-title">二氧化碳</div>
                            <div class="item-content">
                                {{ sensorData.co2 || '0' }}<div class="unit">ppm</div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img src="@/assets/image/environment/icon-5.png" alt="">
                        <div class="item-info">
                            <div class="item-title">大气压</div>
                            <div class="item-content">
                                {{ sensorData.atmosphericPressure ? (sensorData.atmosphericPressure / 100).toFixed(1) : '0' }}<div class="unit">kpa</div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img src="@/assets/image/environment/icon-6.png" alt="">
                        <div class="item-info">
                            <div class="item-title">土壤温度</div>
                            <div class="item-content">
                                {{ sensorData.soilTemperature || '0' }}<div class="unit">℃</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="items">
                    <div class="item">
                        <img src="@/assets/image/environment/icon-7.png" alt="">
                        <div class="item-info">
                            <div class="item-title">土壤湿度</div>
                            <div class="item-content">
                                {{ sensorData.soilHumidity || '0' }}<div class="unit">%</div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img src="@/assets/image/environment/icon-8.png" alt="">
                        <div class="item-info">
                            <div class="item-title">电导率</div>
                            <div class="item-content">
                                {{ sensorData.soilConductivity || '0' }}<div class="unit">uS/cm</div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img src="@/assets/image/environment/icon-9.png" alt="">
                        <div class="item-info">
                            <div class="item-title">酸碱度</div>
                            <div class="item-content">
                                {{ sensorData.soilPH || '0' }}<div class="unit">pH</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="items">
                    <div class="item">
                        <img src="@/assets/image/environment/icon-10.png" alt="">
                        <div class="item-info">
                            <div class="item-title">氮</div>
                            <div class="item-content">
                                {{ sensorData.soilNitrogen || '0' }}<div class="unit">mg/kg</div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img src="@/assets/image/environment/icon-11.png" alt="">
                        <div class="item-info">
                            <div class="item-title">磷</div>
                            <div class="item-content">
                                {{ sensorData.soilPhosphorus || '0' }}<div class="unit">mg/kg</div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img src="@/assets/image/environment/icon-12.png" alt="">
                        <div class="item-info">
                            <div class="item-title">钾</div>
                            <div class="item-content">
                                {{ sensorData.soilPotassium || '0' }}<div class="unit">mg/kg</div>
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
import { getRealTimeSensorData } from "@/api/sensor.js";
import { testSensorData } from "@/utils/sensor-debug.js";

export default {
    name: "environment",
    components: {
        BaseTitle
    },
    data() {
        return {
            sensorData: {
                illuminance: 0,
                airTemperature: 0,
                airHumidity: 0,
                co2: 0,
                atmosphericPressure: 0,
                soilTemperature: 0,
                soilHumidity: 0,
                soilConductivity: 0,
                soilPH: 0,
                soilNitrogen: 0,
                soilPhosphorus: 0,
                soilPotassium: 0,
                lastUpdateTime: ''
            },
            timer: null
        };
    },
    mounted() {
        this.init();
        
        // 开发环境下，将调试函数暴露到全局
        if (process.env.NODE_ENV === 'development') {
            window.debugEnvironmentSensor = this.debugSensorData;
            console.log('🔧 调试函数已暴露: window.debugEnvironmentSensor()');
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
            // 初始加载数据
            await this.loadSensorData();
            
            // 设置定时刷新，每30秒更新一次数据
            this.timer = setInterval(() => {
                this.loadSensorData();
            }, 30000);
        },
        
        // 调试方法：手动测试传感器数据
        async debugSensorData() {
            console.log('🔧 手动测试传感器数据...');
            try {
                await testSensorData();
            } catch (error) {
                console.error('调试失败:', error);
            }
        },
        
        async loadSensorData() {
            try {
                console.log('开始获取传感器数据...');
                const data = await getRealTimeSensorData();
                console.log('传感器API返回的原始数据:', data);
                
                this.sensorData = {
                    illuminance: data.illuminance,
                    airTemperature: data.airTemperature,
                    airHumidity: data.airHumidity,
                    co2: data.co2,
                    atmosphericPressure: data.atmosphericPressure,
                    soilTemperature: data.soilTemperature,
                    soilHumidity: data.soilHumidity,
                    soilConductivity: data.soilConductivity,
                    soilPH: data.soilPH,
                    soilNitrogen: data.soilNitrogen,
                    soilPhosphorus: data.soilPhosphorus,
                    soilPotassium: data.soilPotassium,
                    lastUpdateTime: data.lastUpdateTime
                };
                
                console.log('环境数据更新成功:', this.sensorData);
                console.log('所有传感器详细信息:', data.allSensors);
                console.log('传感器映射数据:', data.rawData);
            } catch (error) {
                console.error('获取环境传感器数据失败:', error);
                // 显示错误信息给用户
                this.sensorData.lastUpdateTime = `获取失败: ${error.message}`;
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.environment {
    .info {
        width: 100%;
        padding: 18px 0 0 32px;

        .items {
            display: flex;
            margin-bottom: 34px;
        }

        .item {
            flex: 1;

            &:first-child {
                flex: none;
                width: 310px;
            }

            position: relative;
            padding: 20px 0 0 127px;

            .item-info {
                height: 76px;
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