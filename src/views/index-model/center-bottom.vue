<template>
    <div class="center-bottom">
        <div class="item">
            <base-title class="othder-base-title">
                <span slot="title">作物主题</span>
            </base-title>
            <div class="box">
                <div class="plan">
                    <img src="../../assets/image/index/center-icon-1.png" width="76px" alt="">
                    <div class="type-box">
                        <div class="label">水稻：</div>
                        <div class="value">
                            <span class="num">{{ cropArea }}</span>
                            <span class="unit">亩</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="item">
            <base-title class="othder-base-title" :tabs="tabs" :pot.sync="pot" @tabClick="tabClick">
                <span slot="title">农技服务</span>
            </base-title>
            <div class="actives" v-show="pot === 0">
                <div class="active">
                    <img src="../../assets/image/technology/icon-1.png" style="width: 218px; height: 139px;" />
                    <div class="label">王教授</div>
                </div>
                <div class="active">
                    <img src="../../assets/image/technology/icon-2.png" style="width: 218px; height: 139px;" />
                    <div class="label">王教授</div>
                </div>
                <div class="active">
                    <img src="../../assets/image/technology/icon-3.png" style="width: 218px; height: 139px;" />
                    <div class="label">王教授</div>
                </div>
            </div>
            <div class="actives" v-show="pot === 1">
                <div class="active">
                    <img src="../../assets/image/technology/icon-1.png" style="width: 218px; height: 139px;" />
                    <div class="label">王教授1</div>
                </div>
                <div class="active">
                    <img src="../../assets/image/technology/icon-2.png" style="width: 218px; height: 139px;" />
                    <div class="label">王教授1</div>
                </div>
                <div class="active">
                    <img src="../../assets/image/technology/icon-3.png" style="width: 218px; height: 139px;" />
                    <div class="label">王教授1</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import BaseTitle from "@/components/base-title.vue";
import { getShopInfo } from "@/api/cockpit.js";

export default {
    components: {
        BaseTitle
    },
    data() {
        return {
            tabs: [{
                name: '专家库',
            }, {
                name: '新品种培养'
            }],
            pot: 0,
            cropArea: 516.16,
            technologyData: {
                tabs: [],
                banners: []
            }
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            await this.fetchData();
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
                
                if (data && data.technology) {
                    this.technologyData = data.technology;
                    if (data.technology.tabs) {
                        this.tabs = data.technology.tabs;
                    }
                }
            } catch (error) {
                console.error('获取中心底部数据失败:', error);
            }
        },
        handleClick(path) {
            this.$router.push(path);
        },
        tabClick(){}
    }
};
</script>
<style lang="scss" scoped>
.center-bottom {
    position: absolute;
    bottom: 5px;
    left: 0;
    width: 100%;
    display: flex;
    padding: 6px 50px 0;
    justify-content: space-between;
    .othder-base-title {
       width: 858px;
       background-size: 858px 80px;
    }
    .item {
        padding-top: 8px;
        border-radius: 0px 0px 0px 0px;
        width: 858px;

        .box {
            width: 858px;
            padding: 0 90px 0 66px;
            height: 252px;
            padding-top: 36px;
            background: rgba(0, 38, 76, 0.51) url('../../assets/image/index/center-plant-bg.png') no-repeat left bottom;
            border-radius: 0px 0px 0px 0px;
            margin-top: 6px;
            background-size: 100% 126px;
        }

        .plan {
            display: flex;
            justify-content: space-between;

            .type-box {
                display: flex;
                padding: 0 16px 0 38px;
                align-items: center;
                justify-content: space-between;
                font-size: 32px;
                font-weight: bold;
                width: 606px;
                height: 72px;
                background: linear-gradient(270deg, rgba(0, 87, 255, 0) 0%, rgba(0, 133, 255, 0.47) 100%);
                border-radius: 0px 0px 0px 0px;

                .value {
                    display: flex;
                    height: 36px;
                    line-height: 36px;

                    .num {
                        color: rgba(255, 210, 126, 1);
                        font-size: 36px;
                    }

                    .unit {
                        height: 36px;
                        line-height: 38px;
                        font-size: 26px;
                        margin-left: 20px;
                    }
                }
            }
        }

    }


    .actives {
        width: 858px;
        height: 256px;
        background: rgba(0, 38, 76, 0.51);
        padding: 26px 20px 0;
        display: flex;
        justify-content: space-between;

        .active {
            width: 264px;
            height: 204px;
            text-align: center;
            background: url(../../assets/image/index/rectangle.png) no-repeat;
            background-size: 100% 100%;
            padding-top: 6px;

            img {
                display: block;
                margin: 0 auto 26px;

            }

            .label {
                font-size: 24px;
                font-weight: bold;
                color: rgba(255, 255, 255, 1);
            }
        }
    }
}
</style>