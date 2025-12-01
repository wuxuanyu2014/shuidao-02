<template>
    <div class="title">
        <div class="small-title">{{ mainTitle || '打造乡村振兴' }}</div>
        <div class="sub-title">{{ subTitle || '滦州样板' }}</div>
    </div>
</template>
<script>
import { getShopInfo } from "@/api/cockpit.js";

export default {
    name: "title",
    data() {
        return {
            mainTitle: '',
            subTitle: ''
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
            await this.fetchTitleData();
        },
        
        // 从localStorage加载数据
        loadFromLocalStorage() {
            const mainTitle = localStorage.getItem('mainTitle');
            const subTitle = localStorage.getItem('subTitle');
            
            if (mainTitle) {
                this.mainTitle = mainTitle;
            }
            if (subTitle) {
                this.subTitle = subTitle;
            }
        },
        
        // 从接口获取数据
        async fetchTitleData() {
            try {
                const response = await getShopInfo();
                const resData = response.data.data;
                if (resData && resData['title']) {
                    const titleData = resData['title'];
                    this.title = titleData.title || titleData.title1 || '仓山区农业数字化服务平台';
                    this.subTitle = titleData.subTitle || titleData.title2 || '基于新时代农业发展新要求，聚焦农业经营过程数字化改造';
                    if (titleData.currentTime) {
                        this.currentTime = titleData.currentTime;
                    }
                    localStorage.setItem('titleData', JSON.stringify({
                        title: this.title,
                        subTitle: this.subTitle
                    }));
                    console.log('标题数据更新成功:', titleData);
                }
            } catch (error) {
                // 接口失败时兜底读取localStorage
                const cachedData = localStorage.getItem('titleData');
                if (cachedData) {
                    try {
                        const data = JSON.parse(cachedData);
                        this.title = data.title || '仓山区农业数字化服务平台';
                        this.subTitle = data.subTitle || '基于新时代农业发展新要求，聚焦农业经营过程数字化改造';
                    } catch (e) {
                        console.error('解析标题数据失败:', e);
                    }
                }
                console.error('获取标题数据失败:', error);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.title {
    position: relative;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .small-title {
        font-size: 46px;
        color: #C4E5FE;
        letter-spacing: 23px;
        line-height: 63px;
    }

    .sub-title {
        font-size: 46px;
        color: #C4E5FE;
        letter-spacing: 23px;
        line-height: 63px;
    }
}
</style> 