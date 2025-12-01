<template>
    <div>
        <div class="environment">
            <base-title>
                <span slot="title">农机维修服务</span>
            </base-title>
            <div class="info">
                <div class="items">
                    <div class="item">
                        <div class="value">
                            <span class="num">{{ deviceCount }}</span>
                            <span class="unit">台</span>
                        </div>
                        <div class="label">农机设备</div>
                    </div>
                    <div class="item">
                        <div class="value">
                            <span class="num">{{ serviceKilometer }}</span>
                            <span class="unit">万KM</span>
                        </div>
                        <div class="label">累计服务</div>
                    </div>
                    <div class="item">
                        <div class="value">
                            <span class="num">{{ serviceMu }}</span>
                            <span class="unit">万亩</span>
                        </div>
                        <div class="label">累计田地</div>
                    </div>
                </div>
                <div class="line-bar" ref="lineBar"></div>
            </div>
        </div>
    </div>
</template>
<script>
import BaseTitle from "@/components/base-title.vue";
import { getShopInfo } from "@/api/cockpit.js";

export default {
    name: "corporateCulture",
    components: {
        BaseTitle
    },
    data() {
        return {
            deviceCount: 38,
            serviceKilometer: 56,
            serviceMu: 5,
            deviceList: []
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            await this.fetchData();
            this.initChart();
        },
        async fetchData() {
            try {
                const response = await getShopInfo();
                const resData = response.data;
                let data = null;
                
                if (resData && resData.success === true && resData.data) {
                    data = resData.data;
                } else if (resData && resData.shopInfo) {
                    data = resData;
                }
                
                if (data && data['agricultural-machinery-services']) {
                    const machineryData = data['agricultural-machinery-services'];
                    this.deviceCount = machineryData.number || 38;
                    this.serviceKilometer = machineryData.kilometer || 56;
                    this.serviceMu = machineryData.mu || 5;
                }
                
                if (data && data.deviceList) {
                    this.deviceList = data.deviceList;
                }
            } catch (error) {
                console.error('获取农机维修服务数据失败:', error);
            }
        },
        initChart() {
            const myChart = this.$echarts.init(this.$refs.lineBar);
            const deviceNames = this.deviceList.length > 0 
                ? this.deviceList.map(item => item.name)
                : ["设备1", "设备2", "设备3", "设备4", "设备5", "设备6"];
            
            let option = {
                tooltip: {
                    trigger: "axis",
                },
                toolbox: {
                    feature: {
                        saveAsImage: {},
                    },
                },
                grid: {
                    left: "8%",
                    right: "10%",
                    bottom: "6%",
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: "category",
                        boundaryGap: false,
                        data: deviceNames,
                        axisLabel: {
                            color: "rgba(255, 255, 255, 1)",
                            fontSize: 22,
                            margin: 16
                        }
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                        axisLabel: {
                            color: "rgba(255, 255, 255, 1)",
                            fontSize: 22
                        }
                    },
                ],
                series: [
                    {
                        name: "邮件营销",
                        type: "line",
                        stack: "总量",
                        data: [120, 132, 101, 134, 90, 230, 210],
                        lineStyle: {
                            color: 'rgba(255, 209, 25, 1)',
                            width: 6
                        },
                        symbolSize: 12,
                        itemStyle: {
                            color: 'rgba(255, 209, 25, 1)',
                            borderColor: 'rgba(255, 209, 25, 1)',
                            borderWidth: 6
                        },
                        areaStyle: {
                            normal: {
                                color: new this.$echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: "rgba(255, 238, 50, 0.54)",
                                        },
                                        {
                                            offset: 1,
                                            color: "rgba(168, 198, 0, 0)",
                                        },
                                    ],
                                    false
                                ),
                                shadowColor: "rgba(53,142,215, 0.9)",
                                shadowBlur: 20,
                            },
                        },
                    }
                ],
            }
            myChart.setOption(option);
        }
    }
};
</script>
<style lang="scss" scoped>
.environment {
    .info {
        height: 440px;
        background: rgba(0, 38, 76, 0.51);
        margin-top: 6px;
        padding-top: 14px;

        .items {
            display: flex;
            justify-content: space-between;
            padding: 0 64px;

            .item {
                width: 216px;
                height: 126px;
                background: url('../../assets/image/index/dizuo-1.png') no-repeat center bottom;
                background-size: 216px 126px;
                text-align: center;

                .value {
                    font-size: 24px;
                    font-weight: bold;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;

                    .num {
                        display: block;
                        color: transparent; // 关键：让文字透明
                        background: rgba(205, 169, 114, 1);
                        background-clip: text;
                        font-size: 40px;
                        height: 40px;
                        line-height: 40px;
                        font-weight: bold;
                    }

                    .unit {
                        display: block;
                        height: 40px;
                        line-height: 42px;
                        margin-left: 10px;
                    }
                }

                .label {
                    font-size: 24px;
                    color: #78BDEE;
                    height: 44px;
                    line-height: 44px;
                    font-weight: bold;
                }
            }
        }

        .line-bar {
            height: 280px;
            width: 100%;

        }
    }
}
</style>