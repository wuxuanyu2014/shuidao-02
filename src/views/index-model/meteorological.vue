<template>
    <div>
        <div class="meteorological">
            <base-title>
                <span slot="title">数据监测</span>
            </base-title>
            <div class="info">
                <div class="online">
                    <div class="all">
                        <div class="label">在线</div>
                        <div class="value">
                            <span class="num">{{ onlineData.all }}</span>
                            台
                        </div>
                    </div>
                    <div class="main" ref="main"></div>
                </div>
                <div class="items">
                    <div class="item">
                        <img src="../../assets/image/index/dizuo-icon-1.png" />
                        气象数据
                    </div>
                    <div class="item">
                        <img src="../../assets/image/index/dizuo-icon-2.png" />
                        土壤数据
                    </div>
                    <div class="item">
                        <img src="../../assets/image/index/dizuo-icon-3.png" />
                        环境数据
                    </div>
                    <div class="item">
                        <img src="../../assets/image/index/dizuo-icon-4.png" />
                        虫情数据
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import BaseTitle from "@/components/base-title.vue";
require('echarts-gl');
const banner1 = require("@/assets/image/index/banner-1.png");
export default {
    name: "corporateCulture",
    components: {
        BaseTitle
    },
    props: {
        onlineData: {
            type: Object,
            default: () => ({
                all: 0,
                online: 0,
                offline: 0,
                fault: 0
            })
        },
    },
    data() {
        return {
            banners: [banner1]
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            const { online, offline, fault, } = this.onlineData
            var myChart = this.$echarts.init(this.$refs.main);

            var { data, optionConfig } = {
                data: [
                    { name: '在线数量', value: online, itemStyle: { color: '#0783FA' }, startRatio: 0, endRatio: 0.15 },
                    { name: '离线数量', value: offline, itemStyle: { color: '#07D1FA' }, startRatio: 0.15, endRatio: 0.4 },
                    { name: '故障数量', value: fault, itemStyle: { color: '#FFD15C' }, startRatio: 0.4, endRatio: 0.5 },
                ],
                optionConfig: {},
            };
            const getPie3D = (pieData, internalDiameterRatio) => {
                let series = [];
                let sumValue = 0;
                let startValue = 0;
                let endValue = 0;
                let legendData = [];
                let k =
                    typeof internalDiameterRatio !== 'undefined'
                        ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
                        : 1 / 3;

                // 为每一个饼图数据，生成一个 series-surface 配置
                for (let i = 0; i < pieData.length; i++) {
                    sumValue += pieData[i].value;

                    let seriesItem = {
                        name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
                        type: 'surface',

                        parametric: true,
                        wireframe: {
                            show: false,
                        },
                        pieData: pieData[i],
                        pieStatus: {
                            selected: false,
                            hovered: false,
                            k: k,
                        },
                        labelLine: {
                            show: false,
                        },
                        label: {
                            show: false,
                            // normal: {
                            //   position: "inner",
                            //   formatter: (params) => {
                            //     return params;
                            //   },
                            // },
                        },
                        itemStyle: {
                            opacity: 1,
                        },
                    };

                    if (typeof pieData[i].itemStyle != 'undefined') {
                        let itemStyle = {};

                        typeof pieData[i].itemStyle.color != 'undefined' ? (itemStyle.color = pieData[i].itemStyle.color) : null;
                        typeof pieData[i].itemStyle.opacity != 'undefined'
                            ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
                            : null;

                        seriesItem.itemStyle = itemStyle;
                    }
                    series.push(seriesItem);
                }

                // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
                // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
                for (let i = 0; i < series.length; i++) {
                    endValue = startValue + series[i].pieData.value;
                    // console.log(series[i]);
                    series[i].pieData.startRatio = startValue / sumValue;
                    series[i].pieData.endRatio = endValue / sumValue;
                    series[i].parametricEquation = getParametricEquation(
                        series[i].pieData.startRatio,
                        series[i].pieData.endRatio,
                        false,
                        false,
                        k,
                        series[i].pieData.value
                    );

                    startValue = endValue;

                    legendData.push(series[i].name);
                }

                // 准备待返回的配置项，把准备好的 legendData、series 传入。
                let option = {
                    tooltip: {
                        backgroundColor: '#053A8D',
                        formatter: (params) => {
                            if (params.seriesName !== 'mouseoutSeries') {
                                return `${params.seriesName
                                    }<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color
                                    };"></span>${option.series[params.seriesIndex].pieData.value}`;
                            }
                        },
                        textStyle: {
                            fontSize: 22,
                        },
                    },

                    labelLine: {
                        show: true,
                    },
                    label: {
                        show: true,
                    },
                    legend: {
                        orient: 'vertical',
                        data: legendData,
                        textStyle: {
                            color: 'rgba(198, 209, 219, 1)',
                            fontSize: 22,
                        },
                        itemWidth: 24,
                        itemHeight: 12,
                        icon: 'roundRect',
                        formatter: function (name) {
                            let item = data.filter((item) => item.name == name)[0];
                            return `${item.name}  ${item.value}`;
                        },
                        left: '65%',
                        top: '16%', //居右显示
                    },
                    xAxis3D: {
                        min: -1.3,
                        max: 1.3,
                    },
                    yAxis3D: {
                        min: -1.3,
                        max: 1.3,
                    },
                    zAxis3D: {
                        min: -1.3,
                        max: 1.3,
                    },
                    grid3D: {
                        show: false,
                        boxHeight: 4,
                        top: '-24%',
                        left: '-2%',
                        // environment: "#021041",
                        viewControl: {
                            distance: 6000,
                            alpha: 30,
                            beta: -40,
                        },
                        boxWidth: 150,   // 控制X轴方向大小
                        boxDepth: 150,   // 控制Y轴方向大小
                    },
                    series: series,
                };
                return option;
            };
            // 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
            const getParametricEquation = (startRatio, endRatio, isSelected, isHovered, k, height) => {
                // 计算
                let midRatio = (startRatio + endRatio) / 2;

                let startRadian = startRatio * Math.PI * 2;
                let endRadian = endRatio * Math.PI * 2;
                let midRadian = midRatio * Math.PI * 2;

                // 如果只有一个扇形，则不实现选中效果。
                if (startRatio === 0 && endRatio === 1) {
                    isSelected = false;
                }

                // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
                k = typeof k !== 'undefined' ? k : 1 / 3;

                // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
                let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
                let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;

                // 计算高亮效果的放大比例（未高亮，则比例为 1）
                let hoverRate = isHovered ? 1.05 : 1;

                // 返回曲面参数方程
                return {
                    u: {
                        min: -Math.PI,
                        max: Math.PI * 3,
                        step: Math.PI / 32,
                    },

                    v: {
                        min: 0,
                        max: Math.PI * 2,
                        step: Math.PI / 20,
                    },

                    x: function (u, v) {
                        if (u < startRadian) {
                            return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
                        }
                        if (u > endRadian) {
                            return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
                        }
                        return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
                    },

                    y: function (u, v) {
                        if (u < startRadian) {
                            return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
                        }
                        if (u > endRadian) {
                            return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
                        }
                        return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
                    },

                    z: function (u, v) {
                        if (u < -Math.PI * 0.5) {
                            return Math.sin(u);
                        }
                        if (u > Math.PI * 2.5) {
                            return Math.sin(u);
                        }
                        // 修改这里的系数来控制扇形高度
                        return Math.sin(v) > 0 ? 1 * height * 0.15 : -1;  // <-- 调整这个系数
                    },
                };
            };

            let option = getPie3D(data, 0);

            myChart.setOption(option);

        },


    }
};
</script>
<style lang="scss" scoped>
.meteorological {
    .info {
        position: relative;
        margin-top: 6px;
        height: 358px;
        background: rgba(0, 38, 76, 0.51);

        .online {
            position: relative;

            .all {
                position: absolute;
                left: 176px;
                top: 60px;
                z-index: 99;

                .label {
                    height: 44px;
                    line-height: 44px;
                    font-weight: bold;
                    font-size: 32px;
                    color: #C9EBFF;
                }

                .value {
                    font-size: 24px;
                    font-weight: bold;

                    .num {
                        width: 60px;
                        height: 46px;
                        font-size: 36px;
                        line-height: 46px;
                        background: linear-gradient(90.00000000000013deg, #FFE4B2 0%, #FFC04C 100%);
                        background-clip: text;
                        justify-content: center;
                        color: transparent;
                    }
                }
            }
        }

        .main {
            width: 100%;
            height: 358px;
        }

        .items {
            width: 100%;
            padding: 0 35px;
            z-index: 99;
            position: absolute;
            bottom: 26px;
            display: flex;
            justify-content: space-between;

            .item {
                width: 162px;
                height: 150px;
                background: url('../../assets/image/index/dizuo.png') no-repeat center bottom;
                background-size: 100% 130px;
                font-size: 28px;
                text-align: center;
                img{
                    display: block;
                    width: 64px;
                    margin: 0 auto;
                }
            }
        }
    }
}
</style>