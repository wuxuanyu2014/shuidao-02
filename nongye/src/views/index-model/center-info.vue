<template>
    <div class="center-info">
        <div class="items">
            <div class="item">
                <img src="../../assets/image/center-info/icon-1.png" alt="">
                <div class="item-info" @click="handleClick('/monitor')" style="cursor: pointer;">
                    <div class="item-info--title">{{ centetName.name1 }}</div>
                    <div class="item-info--nunber">{{ centetData.number1 }}<div class="unit">个</div>
                    </div>
                </div>
            </div>
            <div class="item">
                <img src="../../assets/image/center-info/icon-2.png" alt="">
                <div class="item-info">
                    <div class="item-info--title">{{ centetName.name2 }}</div>
                    <div class="item-info--nunber">{{ centetData.number2 }}<div class="unit">立方</div>
                    </div>
                </div>
            </div>
            <div class="item">
                <img src="../../assets/image/center-info/icon-3.png" alt="">
                <div class="item-info">
                    <div class="item-info--title">{{ centetName.name3 }}</div>
                    <div class="item-info--nunber">{{ centetData.number3 }}<div class="unit">亩</div>
                    </div>
                </div>
            </div>
            <div class="item">
                <img src="../../assets/image/center-info/icon-4.png" alt="">
                <div class="item-info">
                    <div class="item-info--title">{{ centetName.name4 }}</div>
                    <div class="item-info--nunber">{{ centetData.number4 }}<div class="unit">吨/年</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getShopInfo } from "@/api/cockpit.js";

export default {
    name: "center-info",
    data() {
        return {
            centetName: {
                name1: '实时监控',
                name2: '冷库面积',
                name3: '基地面积',
                name4: '农产品销售'
            },
            centetData: {
                number1: 10,
                number2: 106,
                number3: 200,
                number4: 12
            }
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            await this.fetchCenterInfo();
        },
        async fetchCenterInfo() {
            try {
                const response = await getShopInfo();
                const resData = response.data.data;
                if (resData && resData['center-info']) {
                    const centerInfoData = resData['center-info'];
                    if (centerInfoData.centetData) {
                        this.centetName = {
                            name1: centerInfoData.centetName.name1 || '实时监控',
                            name2: centerInfoData.centetName.name2 || '冷库面积',
                            name3: centerInfoData.centetName.name3 || '基地面积',
                            name4: centerInfoData.centetName.name4 || '农产品销售'
                        };
                        this.centetData = {
                            number1: centerInfoData.centetData.number1 || 10,
                            number2: centerInfoData.centetData.number2 || 106,
                            number3: centerInfoData.centetData.number3 || 200,
                            number4: centerInfoData.centetData.number4 || 12
                        };
                        localStorage.setItem('center-info', JSON.stringify(centerInfoData));
                        console.log('中心信息数据更新成功:', centerInfoData);
                    }
                }
            } catch (error) {
                // 接口失败时兜底读取localStorage
                const cachedData = localStorage.getItem('center-info');
                if (cachedData) {
                    try {
                        const data = JSON.parse(cachedData);
                        this.centetName = {
                            name1: data.centetName?.name1 || '实时监控',
                            name2: data.centetName?.name2 || '冷库面积',
                            name3: data.centetName?.name3 || '基地面积',
                            name4: data.centetName?.name4 || '农产品销售'
                        };
                        this.centetData = {
                            number1: data.centetData?.number1 || 10,
                            number2: data.centetData?.number2 || 106,
                            number3: data.centetData?.number3 || 200,
                            number4: data.centetData?.number4 || 12
                        };
                    } catch (e) {
                        console.error('解析中心信息数据失败:', e);
                    }
                }
                console.error('获取中心信息数据失败:', error);
            }
        },
        handleClick(path) {
            this.$router.push(path)
        }
    }
}
</script>
<style lang="scss" scoped>
.center-info {
    margin-top: 40px;
    padding: 0 180px;
    width: 1940px;
    height: 260px;
    background: url('../../assets/center-info.png') no-repeat center;
    background-size: 100% 260px;

    .items {
        display: flex;
        padding-top: 10px;

        .item {
            position: relative;
            padding-left: 174px;
            flex: 1;

            img {
                position: absolute;
                left: 0;
                top: 0;
            }

            .item-info {
                padding-top: 20px;

                .item-info--title {
                    color: #C9EBFF;
                    height: 50px;
                    line-height: 50px;
                    font-size: 36px;
                }

                .item-info--nunber {
                    display: flex;
                    margin-top: 8px;
                    height: 62px;
                    font-weight: bold;
                    font-size: 48px;
                    line-height: 62px;
                    color: transparent; // 关键：让文字透明
                    background: linear-gradient(#F5FEFF 0%, #5EACFF 82%);
                    background-clip: text;

                    .unit {
                        color: #C9EBFF;
                        font-size: 24px;
                        line-height: 75px;
                        margin-left: 6px
                    }
                }

                ;
            }
        }
    }
}
</style>