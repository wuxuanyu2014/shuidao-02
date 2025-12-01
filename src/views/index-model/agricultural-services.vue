<template>
    <div>
        <div class="agricultural-services">
            <base-title :tabs="tabs" :pot.sync="pot" @tabClick="tabClick">
                <span slot="title">农资服务</span>
            </base-title>
            <div class="info">
                <el-select v-model="year" placeholder="请选择" class="i-select">
                    <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
                    </el-option>
                </el-select>
                <div class="natural-resources">
                    <div class="">
                        <img src="@/assets/image/index/natural.png" alt="" />
                        <div class="t">
                            <div class="text">24年提供稻麦烘干服务</div>
                            <div class="number">{{ naturalResources.number1 }}<div class="icon">吨</div>
                            </div>
                        </div>
                    </div>
                    <div class="">
                        <img src="@/assets/image/index/natural.png" alt="" />
                        <div class="t">
                            <div class="text">累计稻麦烘干</div>
                            <div class="number">{{ naturalResources.number2 }}<div class="icon">吨</div>
                            </div>
                        </div>
                    </div>
                </div>
                <dv-scroll-board class="other-dv-scroll-board" :config="config" style="height:320px" />
            </div>
        </div>
    </div>
</template>
<script>
import BaseTitle from "@/components/base-title.vue";
export default {
    name: "corporateCulture",
    components: {
        BaseTitle
    },
    data() {
        return {
            tabs: [{
                name: '工厂化育秧',
            }, {
                name: '稻麦烘干'
            }, {
                name: '稻米加工'
            }],
            pot: 0,
            config: {
                rowNum: 4,
                evenRowBGC: 'transparent',
                oddRowBGC: 'transparent',
                columnWidth: [60, 150, 300],
                data: [],
            },
            datas: [
                [
                    { index: 1, name: '名字', date: '2024-10-24 22:24:56', type: '服务秧苗' },
                    { index: 2, name: '名字', date: '2024-10-24 22:24:56', type: '服务秧苗' },
                    { index: 3, name: '名字', date: '2024-10-24 22:24:56', type: '服务秧苗' },
                    { index: 4, name: '名字', date: '2024-10-24 22:24:56', type: '服务秧苗' }
                ],
                [
                    { index: 1, name: '名字1', date: '2024-10-24 22:24:56', type: '服务秧苗' },
                    { index: 2, name: '名字1', date: '2024-10-24 22:24:56', type: '服务秧苗' },
                    { index: 3, name: '名字1', date: '2024-10-24 22:24:56', type: '服务秧苗' },
                    { index: 4, name: '名字1', date: '2024-10-24 22:24:56', type: '服务秧苗' }
                ],
                [
                    { index: 1, name: '名字2', date: '2024-10-24 22:24:56', type: '服务秧苗' },
                    { index: 2, name: '名字2', date: '2024-10-24 22:24:56', type: '服务秧苗' },
                    { index: 3, name: '名字2', date: '2024-10-24 22:24:56', type: '服务秧苗' },
                    { index: 4, name: '名字2', date: '2024-10-24 22:24:56', type: '服务秧苗' }
                ]
            ],
            naturalResources: {
                number1: 1290,
                number2: 392
            },
            options: [{
                value: 2024
            }, {
                value: 2025
            }],
            year: 2024
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            const config = JSON.parse(JSON.stringify(this.config));
            config.data = this.datas[this.pot].map((item, index) => {
                const color = index % 2 === 0 ? 'rgba(17,58,99,0.75)' : ' rgba(17,58,99,0.34)';
                return [
                    `<div style="background:${color}">${item.index}</div>`,
                    `<div style="background:${color}">${item.name}</div>`,
                    `<div style="background:${color}">${item.date}</div>`,
                    `<div style="background:${color}">${item.type}</div>`,
                    `<div style="background:${color}"><div class="border-box">用户画像</div></div>`,
                ]
            })
            this.config = config
        },
        tabClick(item) {
            this.init()
        }
    }
};
</script>
<style lang="scss" scoped>
.agricultural-services {
    .info {
        margin-top: 6px;
        width: 100%;
        padding: 24px 32px 0;
        background: rgba(0, 38, 76, 0.51);
        height: 572px;
        .natural-resources {
            display: flex;
            padding: 0 86px 0 10px;
            justify-content: space-between;
            margin-bottom: 22px;

            >div {
                display: flex;
                align-items: center;
                margin-right: 68px;

                img {
                    display: block;
                    width: 100px;
                    height: 100px;
                }

                .t {
                    height: 80px;
                    display: flex;
                    flex-direction: column;

                    .text {
                        font-size: 26px;
                        height: 36px;
                        line-height: 36px;
                        color: #C9EBFF; // 关键：让文字透明
                        font-weight: bold;
                    }

                    .number {
                        font-weight: bold;
                        display: flex;
                        font-size: 36px;
                        color: transparent; // 关键：让文字透明
                        background: linear-gradient(90.00000000000013deg, #FFE4B2 0%, #FFC04C 100%);
                        background-clip: text;
                        height: 46px;
                        line-height: 46px;


                        .icon {
                            color: #C9EBFF;
                            font-size: 24px;
                            line-height: 53px;
                            margin-left: 6px;
                        }
                    }
                }

                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }

    .other-dv-scroll-board {
        ::v-deep .rows {
            .ceil {
                padding: 0;
                font-size: 26px !important;
                padding-bottom: 15px;

                >div {
                    width: 100%;
                    height: 100%;
                    white-space: nowrap; // 禁止换行
                    overflow: hidden; // 隐藏超出内容
                    text-overflow: ellipsis; // 显示省略号
                    padding-left: 10px;
                    padding-right: 10px;
                    line-height: 65px;
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

    .i-select {
        width: 382px;
        margin-bottom: 24px;

        ::v-deep .el-input {
            height: 50px;

            .el-input__inner {
                height: 50px;
                background: rgba(5, 59, 114, 0.58);
                border: 2px solid #007AE3;
                font-size: 28px;
                color: #C9EBFF;
                font-weight: bold;
            }
        }
    }

}
</style>