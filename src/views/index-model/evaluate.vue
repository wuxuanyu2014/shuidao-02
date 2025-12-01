<template>
    <div>
        <div class="evaluate">
            <base-title>
                <span slot="title">监督评价</span>
                <div class="title-label" slot="label">
                    群众满意度:
                    <span class="num">100%</span>
                </div>
            </base-title>
            <div class="info">

                <dv-scroll-board class="other-dv-scroll-board" :config="config" style="height:256px" />
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
            headerTexts: [{
                text: '时间',
                background: require('@/assets/image/evaluate/icon-1.png')
            }, {
                text: '评价',
                background: require('@/assets/image/evaluate/icon-2.png')
            }, {
                text: '平均分',
                background: require('@/assets/image/evaluate/icon-3.png')
            }],
            config: {
                rowNum: 4,
                evenRowBGC: 'transparent',
                oddRowBGC: 'transparent',
                columnWidth: [196],
                data: [],
            },
            datas: [
                { name: '2025-12-23', num: '“四员联动”指“农事服务中心农事服务中心', address: '4.5' },
                { name: '2025-12-23', num: '“四员联动”指“农事服务中心农事服务中心', address: '4.5' },
                { name: '2025-12-23', num: '“四员联动”指“农事服务中心农事服务中心', address: '4.5' },
                { name: '2025-12-23', num: '“四员联动”指“农事服务中心农事服务中心', address: '4.5' },
                { name: '2025-12-23', num: '“四员联动”指“农事服务中心农事服务中心', address: '4.5' },
            ],
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            await this.fetchData();
            this.updateConfig();
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
                
                if (data && data.evaluate) {
                    const evaluateData = data.evaluate;
                    if (evaluateData.headerTexts) {
                        this.headerTexts = evaluateData.headerTexts;
                    }
                    if (evaluateData.config) {
                        this.config = { ...this.config, ...evaluateData.config };
                    }
                    if (evaluateData.datas) {
                        this.datas = evaluateData.datas;
                    }
                }
            } catch (error) {
                console.error('获取监督评价数据失败:', error);
            }
        },
        updateConfig() {
            const config = JSON.parse(JSON.stringify(this.config));
            config.data = this.datas.map((item, index) => {
                return [
                    `<div>${item.name}</div>`,
                    `<div>${item.num}</div>`
                ]
            })
            this.config = config
        },
    }
};
</script>
<style lang="scss" scoped>
.evaluate {
    .title-label {
        font-size: 28px;
        height: 36px;
        line-height: 36px;

        .num {
            font-size: 36px;
            color: rgba(255, 187, 0, 1);
        }
    }

    .info {
        width: 100%;
        height: 274px;
        background: rgba(0, 38, 76, 0.51);
        margin-top: 6px;
        padding: 10px 22px 0;

        .t-header {
            display: flex;
            text-align: center;
            height: 64px;
            line-height: 64px;
            margin-bottom: 10px;

            .t-header--title {
                padding-right: 10px;

                >div {
                    font-size: 30px;
                    color: #FFFFFF;
                }
            }
        }

        .other-dv-scroll-board {
            ::v-deep .rows {
                .row-item {
                    position: relative;

                    &::before {
                        position: absolute;
                        top: 18px;
                        left: 0;
                        content: ' ';
                        width: 4px;
                        height: 20px;
                        background: rgba(61, 115, 255, 1);
                    }

                    &::after {
                        position: absolute;
                        bottom: 10px;
                        left: 0;
                        content: ' ';
                        width: 100%;
                        border-bottom: 2px dashed rgba(61, 115, 255, 1);
                    }
                }

                .ceil {
                    padding: 0;
                    font-size: 26px !important;
                    padding-bottom: 10px;

                    >div {
                        width: 100%;
                        height: 100%;
                        white-space: nowrap; // 禁止换行
                        overflow: hidden; // 隐藏超出内容
                        text-overflow: ellipsis; // 显示省略号
                        padding-right: 10px;
                        line-height: 54px;
                        background: rgba(53, 168, 235, 0.15);
                        text-align: center;
                    }
                }
            }
        }
    }
}
</style>