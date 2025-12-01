<template>
    <div class="center-main">
        <div class="item">
            <div class="icon">
                <img src="../../assets/image/index/center-icon-2.png" width="44px" />
            </div>
            <div class="t">
                <div class="label">监控</div>
                <div class="value">
                    <div class="num">{{ topData.monitor }}</div>
                    <div class="unit">个</div>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="icon">
                <img src="../../assets/image/index/center-icon-3.png" width="56px" />
            </div>
            <div class="t">
                <div class="label">冷库</div>
                <div class="value">
                    <div class="num">{{ topData.coldStorage }}</div>
                    <div class="unit">㎡</div>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="icon">
                <img src="../../assets/image/index/center-icon-4.png" width="54px" />
            </div>
            <div class="t">
                <div class="label">面积</div>
                <div class="value">
                    <div class="num">{{ topData.area }}</div>
                    <div class="unit">亩</div>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="icon">
                <img src="../../assets/image/index/center-icon-5.png" width="62px" />
            </div>
            <div class="t">
                <div class="label">产量</div>
                <div class="value">
                    <div class="num">{{ topData.output }}</div>
                    <div class="unit">吨</div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
export default {
    name: "center-main",
     props: {
        topData:{
            type: Object,
            default: () => ({})
        },
    },
    data() {
        return {

        }
    },
   
    mounted() {

    },
    methods: {

    }
}
</script>
<style lang="scss" scoped>
.center-main {
    position: absolute;
    left: 0;
    top: 150px;
    position: relative;
    display: flex;
    padding: 0 160px;
    justify-content: space-between;

    .item {
        height: 122px;
        display: flex;

        .icon {
            text-align: center;
            width: 174px;
            height: 122px;
            background: url('../../assets/image/index/dizuo-4.png') no-repeat;
            background-size: 100% 100%;
        }

        .t {
             font-weight: bold;
            .label {
                width: 80px;
                height: 54px;
                line-height: 54px;
               
                font-size: 36px;
                color: #C9EBFF;
            }

            .value {
                display: flex;
                align-items: center;
                height: 56px;
                line-height: 56px;
                .num {
                    font-size: 36px;
                    color: rgba(255, 192, 76, 1);
                }
                .unit{
                    height: 56px;
                    line-height: 60px;
                    font-size: 24px;
                    margin-left: 12px;
                }
            }
        }
    }
}
</style>