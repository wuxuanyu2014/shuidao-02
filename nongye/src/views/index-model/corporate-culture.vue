<template>
    <div>
        <div class="corporate-culture">
            <base-title>
                <img slot="title" src="@/assets/image/index/corporate-culture.png" alt="">
            </base-title>
            <div class="info">
                <div class="banner">
                    <el-carousel height="330px" indicator-position="none" arrow="never">
                        <el-carousel-item v-for="item in banners" :key="item">
                            <img style="width: 100%; height: 100%;" :src="item" />
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div class="intro">
                    <div class="small-title">{{ shopTitle || '农事服务中心' }}</div>
                    <div class="intro-content" v-html="shopContent || defaultContent">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import BaseTitle from "@/components/base-title.vue";
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
            shopContent: '',
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
            await this.fetchShopInfo();
        },
        
        // 从localStorage加载数据
        loadFromLocalStorage() {
            const title = localStorage.getItem('shopTitle');
            const content = localStorage.getItem('shopContent');
            
            if (title) {
                this.shopTitle = title;
            }
            if (content) {
                this.shopContent = content;
            }
        },
        
        // 从接口获取数据
        async fetchShopInfo() {
            try {
                const response = await axios.get('/api/getShopInfo');
                
                if (response.data && response.data.success && response.data.data) {
                    const { title, content } = response.data.data.shopInfo;
                    
                    // 更新组件数据
                    this.shopTitle = title;
                    this.shopContent = content;
                    
                    // 存储到localStorage
                    localStorage.setItem('shopTitle', title);
                    localStorage.setItem('shopContent', content);
                    
                    console.log('农事服务中心信息更新成功:', { title, content });
                }
            } catch (error) {
                console.error('获取农事服务中心信息失败:', error);
                // 如果接口调用失败，继续使用localStorage中的数据或默认数据
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.corporate-culture {
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