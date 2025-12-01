<template>
    <div class="statistical-data">
        <div
            class="statistical-data-item"
            v-for="item in statistics"
            :key="item.title"
        >
            <div class="img-container">
                <img :src="item.img" alt="" />
            </div>
            <div class="title">{{ item.title }}</div>
            <div class="number">{{ item.number }}</div>
            <div class="unit">{{ item.unit }}</div>
        </div>
    </div>
</template>
<script>
import { getShopInfo } from "@/api/cockpit.js";

const img1 = require("@/assets/image/index/statistical-data-1.png");
const img2 = require("@/assets/image/index/statistical-data-2.png");
const img3 = require("@/assets/image/index/statistical-data-3.png");
const img4 = require("@/assets/image/index/statistical-data-4.png");

export default {
    name: "statisticalData",
    data() {
        return {
            statistics: [],
            defaultStatistics: [
                {
                    img: img1,
                    title: "万元",
                    number: "8050",
                    unit: "年度销售额"
                },
                {
                    img: img2,
                    title: "类",
                    number: "16",
                    unit: "产品种类"
                },
                {
                    img: img3,
                    title: "户",
                    number: "820",
                    unit: "覆盖农户"
                },
                {
                    img: img4,
                    title: "个",
                    number: "46",
                    unit: "合作社数量"
                }
            ]
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
            await this.fetchStatisticsInfo();
        },
        
        // 从localStorage加载数据
        loadFromLocalStorage() {
            const data = localStorage.getItem('statisticsData');
            
            if (data) {
                try {
                    this.statistics = JSON.parse(data);
                } catch (error) {
                    console.error('解析统计数据失败:', error);
                    this.statistics = this.defaultStatistics;
                }
            } else {
                this.statistics = this.defaultStatistics;
            }
        },
        
        // 从接口获取数据
        async fetchStatisticsInfo() {
            try {
                const response = await getShopInfo();
                const resData = response.data.data;
                if (resData && resData['statistical-data']) {
                    const statisticsData = resData['statistical-data'];
                    // 将图片URL映射到本地图片
                    const imageMap = [img1, img2, img3, img4];
                    // 使用接口数据或默认数据
                    const dataToUse = statisticsData.statistics && statisticsData.statistics.length > 0 
                        ? statisticsData.statistics 
                        : statisticsData.defaultStatistics || this.defaultStatistics;
                    // 更新组件数据
                    this.statistics = dataToUse.map((item, index) => ({
                        ...item,
                        img: imageMap[index] || img1
                    }));
                    localStorage.setItem('statisticsData', JSON.stringify(this.statistics));
                    console.log('统计数据更新成功:', this.statistics);
                }
            } catch (error) {
                // 接口失败时兜底读取localStorage
                const data = localStorage.getItem('statisticsData');
                if (data) {
                    try {
                        this.statistics = JSON.parse(data);
                    } catch (e) {
                        console.error('解析统计数据失败:', e);
                        this.statistics = this.defaultStatistics;
                    }
                } else {
                    this.statistics = this.defaultStatistics;
                }
                console.error('获取统计数据失败:', error);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.statistical-data {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 48px 0;

    .statistical-data-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .img-container {
            width: 92px;
            height: 92px;
            border-radius: 50%;
            background: radial-gradient(50% 50% at 50% 50%, #003D73 0%, #003A7B 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
        }

        .title {
            font-size: 28px;
            color: #C4E5FE;
            margin-bottom: 4px;
        }

        .number {
            font-size: 48px;
            color: #C4E5FE;
            margin-bottom: 4px;
        }

        .unit {
            font-size: 24px;
            color: #C4E5FE;
        }
    }
}
</style> 