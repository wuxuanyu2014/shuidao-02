<template>
    <div>
        <div class="agricultural-services">
            <base-title :tabs="tabs" :pot.sync="pot" @tabClick="tabClick">
                <img slot="title" src="@/assets/image/index/agricultural-services-title.png" alt="">
            </base-title>
            <div class="info">
                <div class="natural-resources">
                    <div class="">
                        <img src="@/assets/image/index/natural.png" alt="" />
                        <div class="t">
                            <div class="text">农资配送</div>
                            <div class="number">{{ naturalResources.number1 }}<div class="icon">吨</div>
                            </div>
                        </div>
                    </div>
                    <div class="">
                        <img src="@/assets/image/index/resources.png" alt="" />
                        <div class="t">
                            <div class="text">农资回收</div>
                            <div class="number">{{ naturalResources.number2 }}<div class="icon">吨</div>
                            </div>
                        </div>
                    </div>
                </div>
                <dv-scroll-board class="other-dv-scroll-board" :config="config" style="height:225px" />
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
            tabs: [{
                name: '农资配送',
            }, {
                name: '农资回收'
            }],
            pot: 0,
            config: {
                rowNum: 3,
                evenRowBGC: 'transparent',
                oddRowBGC: 'transparent',
                columnWidth: [],
                data: [],
            },
            datas: [
                [
                    { name: '洋芋', num: '10斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
                    { name: '洋芋', num: '11斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
                    { name: '洋芋', num: '12斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
                    { name: '洋芋', num: '13斤', address: '上海市浦东新区康桥镇秀沿路2783弄' }
                ],
                [
                    { name: '洋芋1', num: '10斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
                    { name: '洋芋1', num: '11斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
                    { name: '洋芋1', num: '12斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
                    { name: '洋芋1', num: '13斤', address: '上海市浦东新区康桥镇秀沿路2783弄' }
                ]
            ],
            naturalResources:{
                number1: 12,
                number2: 3
            }
        };
    },
    mounted() {
        this.initData();
    },
    methods: {
        async initData() {
            await this.fetchAgriculturalServices();
            this.init();
        },
        async fetchAgriculturalServices() {
            try {
                const response = await getShopInfo();
                const resData = response.data;
                if (resData && resData.data && resData.data['agricultural-services']) {
                    const servicesData = resData.data['agricultural-services'];
                    this.datas = servicesData;
                    localStorage.setItem('agricultural-services', JSON.stringify(servicesData));
                    console.log('农业服务数据更新成功:', servicesData);
                }
            } catch (error) {
                // 接口失败时兜底读取localStorage
                const cachedData = localStorage.getItem('agricultural-services');
                if (cachedData) {
                    try {
                        const data = JSON.parse(cachedData);
                        this.datas = data || this.datas;
                    } catch (e) {
                        console.error('解析农业服务数据失败:', e);
                    }
                }
                console.error('获取农业服务数据失败:', error);
            }
        },
        init() {
            const config = JSON.parse(JSON.stringify(this.config));
            config.data = this.datas[this.pot].map((item, index) => {
                const color = index % 2 === 0 ? 'rgba(17,58,99,0.75)' : ' rgba(17,58,99,0.34)';
                return [
                    `<div style="background:${color}">${item.name}</div>`,
                    `<div style="background:${color}">${item.num}</div>`,
                    `<div style="background:${color}">${item.address}</div>`,
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
        width: 100%;
        padding: 24px 32px 0;

        .natural-resources {
            display: flex;
            justify-content: center;
            margin-bottom: 22px;

            >div {
                display: flex;
                align-items: center;
                margin-right: 68px;
                img {
                    display: block;
                    width: 122px;
                    height: 130px;
                }

                .t {
                    height: 90px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;

                    .text {
                        font-size: 24px;
                        height: 32px;
                        line-height: 32px;
                        color: #C9EBFF; // 关键：让文字透明
                        font-weight: bold;
                    }

                    .number {
                        font-weight: bold;
                        display: flex;
                        font-size: 36px;
                        color: transparent; // 关键：让文字透明
                        background: linear-gradient(#FFFFFF 0%, #46AEFA 100%);
                        background-clip: text;
                        justify-content: center;
                        height: 46px;
                        line-height: 46px;
                        .icon{
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
                padding-bottom: 10px;

                >div {
                    width: 100%;
                    height: 100%;
                    white-space: nowrap; // 禁止换行
                    overflow: hidden; // 隐藏超出内容
                    text-overflow: ellipsis; // 显示省略号
                    padding-left: 32px;
                    padding-right: 10px;
                    line-height: 65px;
                }
            }
        }
    }
}
</style>