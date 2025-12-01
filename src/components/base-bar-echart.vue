<template>
    <div :id="id" :style="cssStyle"></div>
</template>
<script>
export default {
    name: 'BaseBarEchart',
    props: {
        id: {
            type: String,
            default: 'chart'
        },
        cssStyle: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            chart: null,
        }
    },
    mounted() {
        this.initChart();
    },
    methods: {
        initChart() {
            // 初始化echart
            this.chart = this.$echarts.init(this.$el)
            this.chart.setOption({
                xAxis: {
                    data: [
                        "机械名称",
                        "机械名称",
                        "机械名称",
                        "机械名称",
                        "机械名称",
                    ],
                    axisLine: {
                        lineStyle: {
                            
                            color: "rgba(179,223,255,0.5)",
                            width: 4,
                        },
                    },
                    axisLabel: {
                        color: "#ABDAFF",
                        fontSize: 22,
                         margin: 20, // 
                    },
                },
                yAxis: {
                    name: "服务面积",
                    splitNumber: 3,// 刻度分割数
                    nameGap: 30,
                    nameTextStyle: {
                        color: "#A6D0F1",
                        fontSize: 24,
                    },
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        color: "#A6D0F1",
                        fontSize: 24,
                    },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(217,231,255,0.24)",
                            type: "dashed",
                        },
                    },
                },
                series: [
                    {
                        type: "bar",
                        barWidth: 28,
                        itemStyle: {
                            normal: {
                                color: new this.$echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: "#A7CAFE",
                                        },
                                        {
                                            offset: 1,
                                            color: "rgba(0,102,198,0.2)",
                                        },
                                    ],
                                    false
                                ),
                            },
                        },
                        data: [254, 254, 254, 254, 254],
                    },
                ],
            }, true)
        }
    },
    beforeDestroy() {
        this.chart.dispose()
        this.chart = null
    },
}
</script>