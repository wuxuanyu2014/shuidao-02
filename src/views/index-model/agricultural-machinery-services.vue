<template>
    <div>
        <div class="agricultural-machinery-services">
            <base-title more="/monitor">
                <span slot="title">监控数量</span>
            </base-title>
            <div class="info">
                <div class="item" v-for="(item, index) in items" :key="index">
                    <div class="text">{{ item.title }}</div>
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
        BaseTitle,
    },
    props: {
        items: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
        };
    },

    mounted() {
        this.init();
    },
    methods: {
        init() {

        }
    }
};
</script>
<style lang="scss" scoped>
.agricultural-machinery-services {
    margin-top: 20px;

    .info {
        padding-top: 38px;
        padding-left: 98px;
        flex-wrap: wrap;
        margin-top: 6px;
        width: 900px;
        height: 250px;
        background: rgba(0, 38, 76, 0.51);

        .item {
            display: inline-block;
            padding-top: 14px;
            padding-left: 140px;
            width: 316px;
            height: 74px;
            background: url('../../assets/image/index/jiankong.png') no-repeat center;
            background-size: 316px 74px;
            margin-bottom: 28px;
            .text {
                width: 170px;
                height: 42px;
                text-align: center;
                font-weight: bold;
                font-size: 30px;
                line-height: 42px;
                background: linear-gradient(180deg, #FFFFFF 39%, #31BEFF 61%);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                color: transparent;
                
            }

        }

        .item:nth-child(2n+1) {
            margin-right: 56px;

        }
    }
}
</style>