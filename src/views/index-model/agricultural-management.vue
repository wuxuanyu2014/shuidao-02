<template>
    <div>
        <div class="agricultural-management">
            <base-title more="/activitys">
                <span slot="title">地块管理</span>
            </base-title>
            <div class="info">
                <div class="item" v-for="(item, index) in items" :key="index">
                    <div>
                        <div class="icon">{{ item.index }}</div>
                        <div class="label">{{ item.name }}</div>
                    </div>
                </div>
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
    props:{
        items:{
            type: Array,
            default: () => []
        }
    },
    data() {
        return {

        };
    },
    mounted() {

    },
    methods: {

    }
};
</script>
<style lang="scss" scoped>
.agricultural-management {
    .info {
        margin-top: 6px;
        padding: 60px 0 0 84px;
        background: rgba(0, 38, 76, 0.51);
        height: 286px;

        .item {
            display: inline-block;
            width: 328px;
            height: 72px;
            background: url('../../assets/image/index/plot.png');
            background-size: 100% 100%;
            margin-bottom: 30px;

            >div {
                display: flex;
                height: 72px;

                .icon {
                    padding-top: 23px;
                    width: 100px;
                    padding-left: 20px;
                    font-weight: bold;
                    font-size: 40px;
                    color: #FFFFFF;
                }

                .label {
                    margin-top: 15px;
                    height: 44px;
                    line-height: 44px;
                    width: 220px;
                    font-weight: bold;
                    font-size: 32px;
                    background: linear-gradient(180deg, #FFFFFF 39%, #31BEFF 61%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    color: transparent;
                    text-align: center;
                }
            }
        }

        .item:nth-child(2n+1) {
            margin-right: 72px;

        }
    }
}
</style>