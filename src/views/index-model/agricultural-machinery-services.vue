<template>
    <div>
        <div class="agricultural-machinery-services">
            <base-title more="/monitor">
                <span slot="title">监控数量</span>
            </base-title>
            <div class="info">
                <div class="item" v-for="(item, index) in displayItems" :key="index">
                    <div class="text">{{ item.title }}</div>
                </div>
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
            monitorItems: []
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
                
                if (data && data['agricultural-machinery-services']) {
                    const machineryData = data['agricultural-machinery-services'];
                    if (machineryData.monitorItems) {
                        this.monitorItems = machineryData.monitorItems;
                    }
                }
            } catch (error) {
                console.error('获取农机服务数据失败:', error);
                // 如果接口失败，使用props传入的数据
                if (this.items && this.items.length > 0) {
                    this.monitorItems = this.items;
                }
            }
        }
    },
    computed: {
        displayItems() {
            return this.monitorItems.length > 0 ? this.monitorItems : this.items;
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