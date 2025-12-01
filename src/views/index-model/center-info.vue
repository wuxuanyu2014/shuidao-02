<template>
    <div class="center-info">
        <div class="items">
            <div class="item">
                <img src="../../assets/image/center-info/icon-1.png" alt="">
                <div class="item-info" @click="handleClick('/monitor')" style="cursor: pointer;">
                    <div class="item-info--title">实时监控</div>
                    <div class="item-info--nunber">{{ centetData.number1 }}<div class="unit">个</div>
                    </div>
                </div>
            </div>
            <div class="item">
                <img src="../../assets/image/center-info/icon-2.png" alt="">
                <div class="item-info">
                    <div class="item-info--title">冷库面积</div>
                    <div class="item-info--nunber">{{ centetData.number2 }}<div class="unit">亩</div>
                    </div>
                </div>
            </div>
            <div class="item">
                <img src="../../assets/image/center-info/icon-3.png" alt="">
                <div class="item-info">
                    <div class="item-info--title">基地面积</div>
                    <div class="item-info--nunber">{{ centetData.number3 }}<div class="unit">亩</div>
                    </div>
                </div>
            </div>
            <div class="item">
                <img src="../../assets/image/center-info/icon-4.png" alt="">
                <div class="item-info">
                    <div class="item-info--title">产量</div>
                    <div class="item-info--nunber">{{ centetData.number4 }}<div class="unit">吨</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "center-info",
    data() {
        return {
            centetData: {
                number1: 10,
                number2: 106,
                number3: 200,
                number4: 12
            }
        }
    },
    methods: {
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