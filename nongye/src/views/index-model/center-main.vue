<template>
    <div class="center-main">
        <div class="sensor" @click="handleClick('monitorVisible')"></div>
        <div class="monitor" @click="handleClick('sensorVisible')"></div>
        <div class="weather-station" @click="handleClick('watherStationVisible')"></div>
        <div class="monitor-box" v-if="monitorVisible">
            <div class="monitor-content">
                <div class="items" v-for="(item, index) in monitor" :key="index">
                    <div class="monitor-item" v-if="index % 2 == 0">
                        <div class="left">
                            <div class="deep">
                                <span>深度{{ item.deep }}m</span>
                            </div>
                        </div>
                        <div class="right">
                            <div class="info">
                                <div class="temperature">温度 {{ item.temperature }}℃</div>
                                <div class="humidity">湿度 {{ item.humidity }}%</div>
                            </div>
                        </div>
                    </div>
                    <div class="monitor-item" v-else>
                        <div class="left">
                            <div class="info">
                                <div class="temperature">温度 {{ item.temperature }}℃</div>
                                <div class="humidity">湿度 {{ item.humidity }}%</div>
                            </div>
                        </div>
                        <div class="right">
                            <div class="deep">
                                <span>深度{{ item.deep }}m</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="wather-station-box" v-if="watherStationVisible">
            <div class="items">
                <div class="item" v-for="(item, index) in watherStations" :key="index">
                    <div class="title">雨量</div>
                    <div class="number">{{ item }}<span class="unit">mm</span></div>
                </div>
            </div>
        </div>
        <div class="sensor-box" v-if="sensorVisible">
            <div class="sensor-data-container">
                <div class="monitor-examples" style="margin-top:60px;">
                    <div class="example-item" v-for="(camera, index) in exampleCameras" :key="index">
                        <div class="camera-preview">
                            <video-player
                                class="vjs-default-skin"
                                :options="camera.playerOptions"
                                :key="camera.url"
                                @click="showCameraDetail(camera)"
                            />
                        </div>

                    </div>
                    
                    <div class="more" @click="moreClick">
                        <img src="@/assets/image/center-info/more.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import SensorStatus from "@/components/sensor-status.vue";
import { getRealTimeSensorData } from "@/api/sensor.js";
import { getShopInfo } from "@/api/cockpit.js";
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import 'videojs-contrib-hls'

export default {
    name: "center-main",
    components: {
        SensorStatus,
        videoPlayer
    },
    data() {
        return {
            monitor: [{
                deep: 10,
                humidity: 10,
                temperature: 10
            }, {
                deep: 30,
                humidity: 30,
                temperature: 30
            }, {
                deep: 50,
                humidity: 50,
                temperature: 50
            }, {
                deep: 70,
                humidity: 70,
                temperature: 70
            }],
            watherStations: [1.7, 1.8, 1.6, 1.7, 1.8, 1.6],
            monitorVisible: false,
            watherStationVisible: false,
            sensorVisible: false,
            sensorData: {
                airTemperature: 0,
                soilTemperature: 0,
                soilHumidity: 0,
                illuminance: 0,
                totalSensors: 0,
                batteryVoltage: 0,
                lastUpdateTime: ''
            },
            timer: null,
            exampleCameras: [
                {
                    name: '监控1号',
                    location: '温室A区',
                    status: '在线',
                    url: 'https://open.ys7.com/v3/openlive/FS1433536_1_2.m3u8?expire=1786340075&id=876458859781017600&t=45ace00eeee7210430223eee03d2a52ee6dfdc432392ff2f88f472cd439bbe9e&ev=100',
                    playerOptions: {}
                },
                {
                    name: '监控2号', 
                    location: '温室B区',
                    status: '在线',
                    url: 'https://open.ys7.com/v3/openlive/FS1433536_2_2.m3u8?expire=1786340149&id=876459166117507072&t=c8f347257052511192ebdd15c64b04e0abddc49d63a4bc4094b4fbefe772f4b6&ev=100',
                    playerOptions: {}
                },
                {
                    name: '监控3号',
                    location: '温室C区', 
                    status: '在线',
                    url: 'https://open.ys7.com/v3/openlive/FS1433536_3_2.m3u8?expire=1786340179&id=876459293593833472&t=b0476241eb0b744f697df5b833f725c1fe798193320d2175a22a75ecc5e41a09&ev=100',
                    playerOptions: {}
                }
            ]
        }
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    methods: {
        async init() {
            // 首先从统一接口获取配置数据
            await this.fetchCenterMainData();
            
            // 更新监控数据，使用传感器数据
            await this.loadSensorData();
            
            // 构建视频播放器配置
            this.buildPlayerOptions();
            
            // 定时更新传感器数据
            this.timer = setInterval(() => {
                this.loadSensorData();
            }, 30000);
            
            // 模拟摄像头状态更新（每10秒随机更新一个摄像头状态）
            this.cameraStatusTimer = setInterval(() => {
                this.updateRandomCameraStatus();
            }, 10000);
        },
        

        
        async loadSensorData() {
            try {
                const data = await getRealTimeSensorData();
                this.sensorData = {
                    airTemperature: data.airTemperature,
                    soilTemperature: data.soilTemperature,
                    soilHumidity: data.soilHumidity,
                    illuminance: data.illuminance,
                    totalSensors: data.totalSensors,
                    batteryVoltage: data.batteryVoltage,
                    lastUpdateTime: data.lastUpdateTime
                };
                
                // 更新监控数据，使用真实传感器数据
                this.updateMonitorData(data);
            } catch (error) {
                console.error('获取传感器数据失败:', error);
            }
        },
        
        updateMonitorData(data) {
            // 使用传感器数据更新监控数据
            this.monitor = [{
                deep: 10,
                humidity: Math.round(data.soilHumidity || 0),
                temperature: Math.round(data.soilTemperature || 0)
            }, {
                deep: 30,
                humidity: Math.round((data.soilHumidity || 0) * 0.9),
                temperature: Math.round((data.soilTemperature || 0) * 0.95)
            }, {
                deep: 50,
                humidity: Math.round((data.soilHumidity || 0) * 0.8),
                temperature: Math.round((data.soilTemperature || 0) * 0.9)
            }, {
                deep: 70,
                humidity: Math.round((data.soilHumidity || 0) * 0.7),
                temperature: Math.round((data.soilTemperature || 0) * 0.85)
            }];
        },
        
        handleClick(key) {
             this[key] = !this[key];
             
             // 当显示传感器数据时，确保数据是最新的
             if (key === 'sensorVisible' && this[key]) {
                 this.loadSensorData();
                 // 延迟一下确保DOM渲染完成后再构建播放器
                 this.$nextTick(() => {
                     this.buildPlayerOptions();
                 });
             }
        },
        moreClick(item) {
           this.$router.push('/monitor')
        },
        buildPlayerOptions() {
            this.exampleCameras.forEach(camera => {
                camera.playerOptions = {
                    autoplay: true,
                    muted: true,
                    controls: true,
                    preload: 'auto',
                    language: 'zh-CN',
                    fluid: false,
                    aspectRatio: '16:9',
                    width: '100%',
                    height: 160,
                    sources: [
                        {
                            type: 'application/x-mpegURL',
                            src: camera.url
                        }
                    ],
                    notSupportedMessage: '此视频暂无法播放，请稍后再试',
                    controlBar: {
                        timeDivider: true,
                        durationDisplay: true,
                        remainingTimeDisplay: false,
                        fullscreenToggle: true
                    },
                    errorDisplay: {
                        closeButton: false
                    }
                };
            });
        },
        showCameraDetail(camera) {
            console.log('点击了摄像头:', camera);
            // 显示摄像头信息提示
            this.$message({
                message: `${camera.name} - ${camera.location} (${camera.status})`,
                type: camera.status === '在线' ? 'success' : 'warning',
                duration: 2000
            });
            
            // 如果摄像头在线，可以跳转到监控页面
            if (camera.status === '在线') {
                // 这里可以跳转到具体的监控页面，或者显示监控预览
                setTimeout(() => {
                    this.$router.push('/monitor');
                }, 1000);
            }
        },
        async fetchCenterMainData() {
            try {
                const response = await getShopInfo();
                const resData = response.data.data;
                if (resData && resData['center-main']) {
                    const centerMainData = resData['center-main'];
                    
                    // 更新监控数据
                    if (centerMainData.monitor) {
                        this.monitor = centerMainData.monitor;
                    }
                    
                    // 更新气象站数据
                    if (centerMainData.watherStations) {
                        this.watherStations = centerMainData.watherStations;
                    }
                    
                    // 更新显示状态
                    if (centerMainData.monitorVisible !== undefined) {
                        this.monitorVisible = centerMainData.monitorVisible;
                    }
                    if (centerMainData.watherStationVisible !== undefined) {
                        this.watherStationVisible = centerMainData.watherStationVisible;
                    }
                    if (centerMainData.sensorVisible !== undefined) {
                        this.sensorVisible = centerMainData.sensorVisible;
                    }
                    
                    if (centerMainData.pieData && centerMainData.pieData.length > 0) {
                        this.pieData = centerMainData.pieData;
                    }
                    
                    localStorage.setItem('center-main', JSON.stringify(centerMainData));
                    console.log('中心主体数据更新成功:', centerMainData);
                }
            } catch (error) {
                // 接口失败时兜底读取localStorage
                const cachedData = localStorage.getItem('center-main');
                if (cachedData) {
                    try {
                        const data = JSON.parse(cachedData);
                        if (data.monitor) {
                            this.monitor = data.monitor;
                        }
                        if (data.watherStations) {
                            this.watherStations = data.watherStations;
                        }
                        if (data.monitorVisible !== undefined) {
                            this.monitorVisible = data.monitorVisible;
                        }
                        if (data.watherStationVisible !== undefined) {
                            this.watherStationVisible = data.watherStationVisible;
                        }
                        if (data.sensorVisible !== undefined) {
                            this.sensorVisible = data.sensorVisible;
                        }
                        if (data.pieData && data.pieData.length > 0) {
                            this.pieData = data.pieData;
                        }
                    } catch (e) {
                        console.error('解析中心主体数据失败:', e);
                    }
                }
                console.error('获取中心主体数据失败:', error);
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.center-main {
    position: relative;
    margin-top: -47px;
    background: url('../../assets/image/center-info/center-main.jpg') no-repeat;
    background-size: cover;
    height: 1222px;

    .sensor {
        cursor: pointer;
        width: 216px;
        height: 282px;
        position: absolute;
        top: -50px;
        left: 916px;
        background: url('../../assets/image/center-info/sensor.png');
    }

    .monitor {
        cursor: pointer;
        width: 216px;
        height: 267px;
        position: absolute;
        top: 172px;
        left: 490px;
        background: url('../../assets/image/center-info/monitor.png');
    }

    .weather-station {
        cursor: pointer;
        width: 216px;
        height: 282px;
        position: absolute;
        bottom: 292px;
        right: 170px;
        background: url('../../assets/image/center-info/weather-station.png');
    }

    .monitor-box {
        position: absolute;
        padding-top: 84px;
        right: 436px;
        top: 210px;
        width: 694px;
        height: 483px;
        background: url('../../assets/image/center-info/monitor-box.png');

        .monitor-content {
            background: url('../../assets/image/center-info/icon-9.png') no-repeat center center;
            height: 100%;
            padding-top: 64px;

            .items {
                padding: 0 40px 0 90px;
                width: 100%;
                margin-bottom: 20px;

                .monitor-item {
                    display: flex;
                }

                .left,
                .right {
                    width: 150px;
                }

                .left {
                    margin-right: 216px;
                }

                .right {
                    display: flex;
                    justify-content: right;

                    .info {
                        width: 100%;
                        text-align: right;
                    }
                }

                .deep {
                    width: 126px;
                    height: 40px;
                    background: linear-gradient(180deg, rgba(36, 186, 255, 0) 0%, rgba(36, 186, 255, 0.77) 100%);
                    border-radius: 0px 0px 0px 0px;
                    border: 2px solid;
                    border-image: linear-gradient(180deg, rgba(36, 186, 255, 0), rgba(172, 229, 255, 1)) 2 2;
                    text-align: center;
                    line-height: 36px;

                    span {
                        font-weight: bold;
                        font-size: 22px;
                        background: linear-gradient(#FFFFFF 0%, #46AEFA 100%);
                        color: transparent; // 关键
                        background-clip: text;
                    }
                }

                .humidity,
                .temperature {
                    width: 100%;
                    font-size: 18px;
                    height: 24px;
                    line-height: 24px;
                    background: linear-gradient(#FFFFFF 0%, #46AEFA 100%);
                    color: transparent; // 关键
                    background-clip: text;
                }

                .temperature {
                    border-bottom: 1px solid #46AEFA;
                }
            }
        }
    }

    .wather-station-box {
        position: absolute;
        padding-top: 150px;
        right: 436px;
        bottom: 106px;
        width: 694px;
        height: 425px;
        background: url('../../assets/image/center-info/weather-station-box.png');

        .items {
            padding: 0 12px 0 60px;
            display: flex;
            flex-wrap: wrap;

            .item {
                width: 190px;
                padding-left: 90px;
                padding-top: 16px;
                height: 102px;
                background: url('../../assets/image/center-info/weather-station-box-icon.png') no-repeat center center;
                margin-right: 12px;
                margin-bottom: 18px;

                .title {
                    font-size: 20px;
                    color: #C9EBFF;
                    height: 27px;
                    line-height: 27px;
                    margin-bottom: 4px;
                }
            }

            .number {
                display: flex;
                font-weight: bold;
                font-size: 28px;
                height: 35px;
                line-height: 35px;
                color: transparent; // 关键：让文字透明
                background: linear-gradient(#F5FEFF 0%, #5EACFF 82%);
                background-clip: text;

                .unit {
                    display: block;
                    font-size: 20px;
                    margin-left: 6px;
                    color: #C9EBFF;
                }
            }
        }

    }

    .sensor-box {
        position: absolute;
        padding-top: 40px;
        left: 150px;
        top: 426px;
        width: 694px;
        height: 280px;
        background: url('../../assets/image/center-info/sensor-box.png');

        .sensor-data-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
            padding: 0 40px 20px;
            height: calc(100% - 60px);

            .monitor-examples {
                display: flex;
                flex-direction: row;
                gap: 15px;
                flex: 1;
                align-items: stretch;

                .example-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 8px;
                    background: rgba(30, 60, 100, 0.6);
                    border-radius: 8px;
                    border: 1px solid rgba(70, 174, 234, 0.3);
                    transition: all 0.3s ease;
                    cursor: pointer;
                    flex: 1;
                    max-width: none;

                    &:hover {
                        background: rgba(30, 60, 100, 0.8);
                        border-color: rgba(70, 174, 234, 0.6);
                        transform: translateY(-2px);
                    }

                    .camera-preview {
                        width: 100%;
                        
                        flex-shrink: 0;
                        border-radius: 6px;
                        overflow: hidden;

                        .video-js {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }

            .sensor-values {
                display: flex;
                flex-direction: column;
                gap: 12px;
                flex: 1;

                .value-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 16px;
                    background: rgba(30, 60, 100, 0.6);
                    border-radius: 8px;
                    border: 1px solid rgba(70, 174, 234, 0.3);

                    .label {
                        font-size: 18px;
                        color: #C9EBFF;
                    }

                    .value {
                        font-size: 20px;
                        font-weight: bold;
                        color: transparent;
                        background: linear-gradient(#FFFFFF 0%, #46AEFA 100%);
                        background-clip: text;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                }
            }
        }

        .more {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            cursor: pointer;
            background: rgba(30, 60, 100, 0.6);
            border-radius: 8px;
            border: 1px solid rgba(70, 174, 234, 0.3);
            transition: all 0.3s ease;
            flex-shrink: 0;
            padding: 8px;

            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 4px;
            }

            &:hover {
                background: rgba(30, 60, 100, 0.8);
                border-color: rgba(70, 174, 234, 0.6);
                transform: translateY(-2px);
            }
        }
    }
}

// 全局video.js样式覆盖
:global(.video-js) {
    font-size: 10px;
    color: #fff;
}

:global(.vjs-default-skin) {
    background-color: transparent;
}

:global(.vjs-control-bar) {
    background-color: rgba(0, 0, 0, 0.7);
}
</style>