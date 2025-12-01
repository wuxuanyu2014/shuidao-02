<template>
    <div>
        <div class="corporate-culture">
            <base-title>
                <span slot="title">园区介绍</span>
            </base-title>
            <div class="info">
                <div class="banner">
                    <el-carousel height="330px" indicator-position="none" arrow="never">
                        <el-carousel-item v-for="item in banners" :key="item">
                            <img :src="item" />
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div class="intro">
                    <div class="intro-content" v-if="shopContent">
                        <div v-html="shopContent"></div>
                    </div>
                    <div class="intro-content" v-else>
                        <div>公司自成立以来，始终坚持以人才为本、诚信立业的经营原则，荟萃业界精英.</div>
                        <div>
                            将国外先进的信息技术、管理方法及企业经验与国内企业的具体实际相结合，为企业供给全方位的解决方案，帮忙企业提高管理水平和生产本事,使企业在激烈的市场竞争中始终坚持竞争力:实现企业快速、稳定地发展。
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import BaseTitle from "@/components/base-title.vue";
import { getShopInfo } from "@/api/cockpit.js";
import axios from "axios";

const banner1 = require("@/assets/image/index/banner-1.png");
export default {
    name: "corporateCulture",
    components: {
        BaseTitle
    },
    data() {
        return {
            banners: [banner1],
            shopTitle: '',
            shopContent: ''
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            await this.fetchShopInfo();
        },
        async fetchShopInfo() {
            try {
                const response = await getShopInfo();
                const resData = response.data;
                let data = null;
                
                if (resData && resData.success === true && resData.data) {
                    data = resData.data;
                } else if (resData && resData.shopInfo) {
                    data = resData;
                }
                
                if (data && data.shopInfo) {
                    this.shopTitle = data.shopInfo.title || '';
                    this.shopContent = data.shopInfo.content || '';
                }
            } catch (error) {
                console.error('获取园区介绍数据失败:', error);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.corporate-culture {


    .info {
        margin-top: 6px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 24px 48px;
        height: 396px;
        background: rgba(0, 38, 76, 0.51);

        .banner {
            width: 382px;
            height: 346px;
            padding: 8px;
            background: url("../../assets/image/index/corporate-culture-border.png") no-repeat center;
        }

        .intro {
            width: 382px;
            height: 346px;
            display: flex;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .small-title {
            width: 356px;
            height: 52px;
            background: url("../../assets/image/index/title2.png");
            font-size: 32px;
            color: #C4E5FE;
            line-height: 52px;
            padding-left: 86px;
            letter-spacing: 5px;
        }

        .intro-content {
            margin-top: 16px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            >div {
                text-indent: 2em;
                color: #C4DBFE;
                font-size: 24px;
                line-height: 31px;
                text-transform: none;
            }
        }
    }
}
</style>