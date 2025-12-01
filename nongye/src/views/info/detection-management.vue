<template>
    <div class="detection-management">
        <Xtitle name="检测管理" />
        <div class="content">
            <div v-for="(type, index) in types" :key="index" class="check-data">
                <div class="icon">
                    <img style="width: 100%; height: 100%" :src="images[index]" alt="">
                </div>
                <div class="text">{{ texts[index] }}</div>
                <div class="number">
                    <countTo :startVal='0' :endVal='data[type].count' :duration='2000'></countTo>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Xtitle from "../../components/Xtitle/index-1";
import countTo from 'vue-count-to';
export default {
    components: {
        Xtitle,
        countTo
    },
    props: {
        data: {
            type: Object,
            default: () => ({
                checkData: {
                    count: 0,
                },
                qualified: {
                    count: 0,
                },
                unCheckData: {
                    count: 0,
                },
                unQualified: {
                    count: 0,
                }
            })
        }
    },
    data() {
        return {
            loading: true,
            types: ['unCheckData', "checkData", "qualified", "unQualified"],
            texts: ['在检测数', "已检测数", "合格数", "不合格数"],
            images: []
        };
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.images = this.types.map(item => require(`../../assets/image/info/${item}.png`))
        }
    },
};
</script>

<style lang="scss" scoped>
.detection-management {
    .content {
        display: flex;
        margin-top: 20px;
        padding: 0 27px;
        height: 180px;
        background: rgba($color: #184D83, $alpha: 0.9);
        align-items: center;
        justify-content: space-between;

        .check-data {
            position: relative;
            padding: 26px 0 0 146px;
            width: 316px;
            height: 124px;
            background: url(../../assets/image/info/check-bg.png) no-repeat center;

            .icon {
                position: absolute;
                width: 122px;
                height: 156px;
                top: -20px;
                left: 0;
            }

            .text {
                font-size: 26px;
                height: 26px;
                line-height: 26px;
                margin-bottom: 18px;
            }

            .number {
                font-size: 38px;
                color: #D5EAF8;
                font-weight: bold;
            }
        }
    }
}
</style>