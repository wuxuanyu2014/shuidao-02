<template>
    <div>
        <div class="technology">
            <base-title>
                <span slot="title">农资配送</span>
            </base-title>
            <div class="info">
                <div class="items">
                    <div class="item">
                        <div class="icon">
                            <img src="../../assets/image/index/technology-icon-1.png" width="56px" alt="" />
                        </div>
                        <div class="t">
                            <div class="label">种子</div>
                            <div class="value">
                                <span class="num">{{ seedCount }}</span>
                                斤
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="icon">
                            <img src="../../assets/image/index/technology-icon-2.png" width="46px" alt="" />
                        </div>
                        <div class="t">
                            <div class="label">种苗</div>
                            <div class="value">
                                <span class="num">{{ seedlingCount }}</span>
                                株
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="icon">
                            <img src="../../assets/image/index/technology-icon-3.png" width="38px" alt="" />
                        </div>
                        <div class="t">
                            <div class="label">肥料</div>
                            <div class="value">
                                <span class="num">{{ fertilizerCount }}</span>
                                斤
                            </div>
                        </div>
                    </div>
                </div>
                <div class="items">
                    <div class="item">
                        <div class="icon">
                            <img src="../../assets/image/index/technology-icon-4.png" width="30px" alt="" />
                        </div>
                        <div class="t">
                            <div class="label">农药</div>
                            <div class="value">
                                <span class="num">{{ pesticideCount }}</span>
                                瓶
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="icon">
                            <img src="../../assets/image/index/technology-icon-5.png" width="52px" alt="" />
                        </div>
                        <div class="t">
                            <div class="label">农膜</div>
                            <div class="value">
                                <span class="num">{{ filmCount }}</span>
                                平方米
                            </div>
                        </div>
                    </div>
                    <div class="item"></div>
                </div>
                <dv-scroll-board class="other-dv-scroll-board" :config="config" style="height:180px" />
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
            config: {
                rowNum: 3,
                evenRowBGC: 'transparent',
                oddRowBGC: 'transparent',
                columnWidth: [200, 300, 100],
                data: [],
            },
            list: [
                { date: '2025.10.1', company: 'XXXXX有限公司', type: '种子', num: 10, unit: "KG" },
                { date: '2025.10.1', company: 'XXXXX有限公司', type: '种苗', num: 10, unit: "KG" },
                { date: '2025.10.1', company: 'XXXXX有限公司', type: '肥料', num: 10, unit: "KG" },
                { date: '2025.10.1', company: 'XXXXX有限公司', type: '种子', num: 10, unit: "KG" },
            ],
            seedCount: 10290,
            seedlingCount: 5690,
            fertilizerCount: 451,
            pesticideCount: 854,
            filmCount: 148
        }
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
                
                // 这里可以根据实际接口返回的数据结构来更新
                // 目前保持默认值，如果接口有相关数据可以在这里更新
            } catch (error) {
                console.error('获取农资配送数据失败:', error);
            }
        },
        updateConfig() {
            const config = JSON.parse(JSON.stringify(this.config));
            config.data = this.list.map((item, index) => {
                const color = 'rgba(17, 58, 99, 0.75)';
                return [
                    `<div style="background:${color}">${item.date}</div>`,
                    `<div style="background:${color}">${item.company}</div>`,
                    `<div style="background:${color}">${item.type}</div>`,
                    `<div style="background:${color}; color: rgba(255, 192, 76, 1)">${item.num}${item.unit}</div>`,
                ]
            })
            this.config = config
        },
        tabClick(item) {

        }
    }
};
</script>
<style lang="scss" scoped>
.technology {
    .info {
        width: 100%;
        padding: 26px 20px 0;
        height: 456px;
        background: rgba(0, 38, 76, 0.51);
        margin-top: 6px;

        .items {
            display: flex;
            margin-bottom: 14px;
            .item {
                flex: 1;
                display: flex;

                .icon {
                    width: 140px;
                    background: url('../../assets/image/index/dizuo-2.png') no-repeat left bottom;
                    background-size: 140px 98px;
                    height: 108px;

                    img {
                        display: block;
                        margin: 0 auto;
                    }
                }

                .t {

                    .label {
                        height: 44px;
                        line-height: 44px;
                        font-weight: bold;
                        font-size: 26px;
                        color: #C9EBFF;
                    }

                    .value {
                        font-size: 20px;
                        font-weight: bold;

                        .num {
                            font-weight: bold;
                            font-size: 30px;
                            color: rgba(255, 192, 76, 1);
                            line-height: 46px;
                        }
                    }
                }



            }
        }
    }

    .other-dv-scroll-board {
        ::v-deep .rows {
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
                    padding-left: 10px;
                    padding-right: 10px;
                    line-height: 50px;
                    text-align: center;
                    color: #C9EBFF;

                    .border-box {
                        margin-top: 12px;
                        width: 122px;
                        height: 42px;
                        font-size: 20px;
                        line-height: 38px;
                        border-radius: 6px;
                        border: 2px solid #1F7DCD;
                        color: #7BC2FF;
                    }
                }
            }
        }
    }
}
</style>