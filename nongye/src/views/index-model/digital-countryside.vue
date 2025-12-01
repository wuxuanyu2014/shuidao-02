<template>
    <div>
        <div class="digital-countryside">
            <base-title>
                <img slot="title" src="@/assets/image/index/digital-countryside.png" alt="">
            </base-title>
            <div class="info">
                <div class="intro">
                    <div class="small-title">{{ digitalTitle || '数字化乡村' }}</div>
                    <div class="intro-content" v-html="digitalContent || defaultContent">
                    </div>
                </div>
                <div class="banner">
                    <el-carousel height="330px" indicator-position="none" arrow="never">
                        <el-carousel-item v-for="item in banners" :key="item">
                            <img :src="item" />
                        </el-carousel-item>
                    </el-carousel>
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
    name: "digitalCountryside",
    components: {
        BaseTitle
    },
    data() {
        return {
            banners: [banner1],
            digitalTitle: '',
            digitalContent: '',
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
            await this.fetchDigitalInfo();
        },
        
        // 从localStorage加载数据
        loadFromLocalStorage() {
            const title = localStorage.getItem('digitalTitle');
            const content = localStorage.getItem('digitalContent');
            
            if (title) {
                this.digitalTitle = title;
            }
            if (content) {
                this.digitalContent = content;
            }
        },
        
        // 从接口获取数据
        async fetchDigitalInfo() {
            try {
                const response = await getShopInfo();
                const resData = response.data.data;
                if (resData && resData['digital-countryside']) {
                    const digitalData = resData['digital-countryside'];
                    this.digitalTitle = digitalData.digitalTitle || digitalData.title || '';
                    this.digitalContent = digitalData.digitalContent || digitalData.content || digitalData.defaultContent || '';
                    localStorage.setItem('digitalTitle', this.digitalTitle);
                    localStorage.setItem('digitalContent', this.digitalContent);
                    console.log('数字化乡村信息更新成功:', digitalData);
                }
            } catch (error) {
                // 接口失败时兜底读取localStorage
                const title = localStorage.getItem('digitalTitle');
                const content = localStorage.getItem('digitalContent');
                if (title) {
                    this.digitalTitle = title;
                }
                if (content) {
                    this.digitalContent = content;
                }
                console.error('获取数字化乡村信息失败:', error);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.digital-countryside {
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