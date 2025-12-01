<template>
    <div>
        <div class="industrial-upgrading">
            <base-title>
                <img slot="title" src="@/assets/image/index/industrial-upgrading.png" alt="">
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
                    <div class="small-title">{{ industryTitle || '产业升级' }}</div>
                    <div class="intro-content" v-html="industryContent || defaultContent">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import BaseTitle from "@/components/base-title.vue";
import { getShopInfo } from "@/api/cockpit.js";

const banner1 = require("@/assets/image/index/banner-1.png");

export default {
    name: "industrialUpgrading",
    components: {
        BaseTitle
    },
    data() {
        return {
            banners: [banner1],
            industryTitle: '',
            industryContent: '',
            defaultContent: `
                <div>《两个结合》结合技能培和"农文旅"融合发展，不断拓展群众增收渠道；实施"四员动"。</div>
                <div> "四员联动"指"农事服务中心+村集体经济合作社+种植大户+群众"的联农带农模式；好"两个结合"，结合技能培训和"农文旅"融合发展。</div>
            `
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            // 首先从localStorage获取数据
            this.loadFromLocalStorage();
            
            // 然后尝试从接口获取最新数据
            await this.fetchIndustryInfo();
        },
        
        // 从localStorage加载数据
        loadFromLocalStorage() {
            const title = localStorage.getItem('industryTitle');
            const content = localStorage.getItem('industryContent');
            
            if (title) {
                this.industryTitle = title;
            }
            if (content) {
                this.industryContent = content;
            }
        },
        
        // 从接口获取数据
        async fetchIndustryInfo() {
            try {
                const response = await getShopInfo();
                const resData = response.data.data;
                if (resData && resData['industrial-upgrading']) {
                    const industrialData = resData['industrial-upgrading'];
                    if (industrialData.tabs) {
                        this.tabs = industrialData.tabs;
                    }
                    if (industrialData.pot !== undefined) {
                        this.pot = industrialData.pot;
                    }
                    if (industrialData.banners) {
                        const imageMap = [image1, image2, image3];
                        this.banners = industrialData.banners.map((item, index) => ({
                            ...item,
                            banner: imageMap[index] || image1
                        }));
                    }
                    localStorage.setItem('industryTitle', industrialData.industryTitle || industrialData.title || '');
                    localStorage.setItem('industryContent', industrialData.industryContent || industrialData.content || industrialData.defaultContent || '');
                    console.log('产业升级数据更新成功:', industrialData);
                }
            } catch (error) {
                // 接口失败时兜底读取localStorage
                const cachedData = localStorage.getItem('industrial-upgrading');
                if (cachedData) {
                    try {
                        const data = JSON.parse(cachedData);
                        this.tabs = data.tabs || this.tabs;
                        this.pot = data.pot || 0;
                        if (data.banners) {
                            const imageMap = [image1, image2, image3];
                            this.banners = data.banners.map((item, index) => ({
                                ...item,
                                banner: imageMap[index] || image1
                            }));
                        }
                    } catch (e) {
                        console.error('解析产业升级数据失败:', e);
                    }
                }
                console.error('获取产业升级数据失败:', error);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.industrial-upgrading {
    .info {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 18px 32px 0;

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
            
            ::v-deep div {
                text-indent: 2em;
                color: #C4DBFE;
                font-size: 24px;
                line-height: 31px;
                margin-bottom: 8px;
                
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
}
</style> 