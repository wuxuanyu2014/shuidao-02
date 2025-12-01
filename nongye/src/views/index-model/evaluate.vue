<template>
    <div>
        <div class="evaluate">
            <base-title>
                <img slot="title" src="@/assets/image/index/evaluate.png" alt="">
            </base-title>
            <div class="info">
                <div class="t-header">
                    <div v-for="(item, index) in headerTexts" :key="index" class="t-header--title"
                        :style="{ width: `${config.columnWidth[index]}px` }">
                        <div :style="{ background: `url(${item.background})`, backgroundSize: 'cover' }">{{ item.text }}</div>
                    </div>
                </div>
                <dv-scroll-board class="other-dv-scroll-board" :config="config" style="height:192px" />
            </div>
        </div>
    </div>
</template>
<script>
import BaseTitle from "@/components/base-title.vue";
import { getShopInfo } from "@/api/cockpit.js";
import axios from 'axios';

export default {
    name: "corporateCulture",
    components: {
        BaseTitle
    },
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * @description the data of evaluate
     * @property {array} headerTexts the header of table
     * @property {object} config the config of table
     * @property {array} datas the data of table
     * @property {string} datas.name the name of item
     * @property {string} datas.num the num of item
     * @property {string} datas.address the address of item
     */
    /*******  69e09723-2fa2-4461-95ea-dbee092d60eb  *******/
    data() {
        return {
            headerTexts: [{
                text: '时间',
                background: require('@/assets/image/evaluate/icon-1.png')
            }, {
                text: '评价',
                 background: require('@/assets/image/evaluate/icon-2.png')
            }, {
                text: '平均分',
                 background: require('@/assets/image/evaluate/icon-3.png')
            }],
            config: {
                rowNum: 3,
                evenRowBGC: 'transparent',
                oddRowBGC: 'transparent',
                columnWidth: [196, 408, 170],
                data: [],
            },
            datas: [
                { name: '2025-12-23', num: '“四员联动”指“农事服务中心+', address: '4.5' },
                { name: '2025-12-23', num: '“四员联动”指“农事服务中心+', address: '4.5' },
                { name: '2025-12-23', num: '“四员联动”指“农事服务中心+', address: '4.5' },
                { name: '2025-12-23', num: '“四员联动”指“农事服务中心+', address: '4.5' },
            ],
        };
    },
    mounted() {
        this.initData();
    },
    methods: {
        async initData() {
            await this.fetchEvaluateData();
            this.init();
        },
        async fetchEvaluateData() {
            try {
                // 首先尝试从后台获取审核通过的评论数据
                await this.fetchAuditedComments();
                
                // 然后尝试从统一接口获取配置数据
                const response = await getShopInfo();
                const resData = response.data.data;
                if (resData && resData['evaluate']) {
                    const evaluateData = resData['evaluate'];
                    if (evaluateData.headerTexts) {
                        this.headerTexts = evaluateData.headerTexts;
                    }
                    if (evaluateData.config) {
                        this.config = { ...this.config, ...evaluateData.config };
                    }
                    // 如果后台没有评论数据，才使用配置的默认数据
                    if (this.datas.length === 0 && evaluateData.datas) {
                        this.datas = evaluateData.datas;
                    }
                    localStorage.setItem('evaluate', JSON.stringify(evaluateData));
                    console.log('评价数据更新成功:', evaluateData);
                }
            } catch (error) {
                // 接口失败时兜底读取localStorage
                const cachedData = localStorage.getItem('evaluate');
                if (cachedData) {
                    try {
                        const data = JSON.parse(cachedData);
                        this.headerTexts = data.headerTexts || this.headerTexts;
                        this.config = { ...this.config, ...data.config };
                        if (this.datas.length === 0) {
                            this.datas = data.datas || this.datas;
                        }
                    } catch (e) {
                        console.error('解析评价数据失败:', e);
                    }
                }
                console.error('获取评价数据失败:', error);
            }
        },
        
        // 获取后台审核通过的评论数据
        async fetchAuditedComments() {
            try {
                const requestData = {
                    page: 1,
                    pageSize: 1000
                };
                
                console.log('获取审核通过评论数据:', requestData);
                const response = await axios({
                    method: 'post',
                    url: '/api/getAllOrders',
                    data: requestData,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                console.log('评论API响应:', response.data);
                
                let ordersData = null;
                if (response.data && response.data.success === true && response.data.data && response.data.data.orders) {
                    ordersData = response.data.data.orders;
                } else if (response.data && response.data.orders) {
                    ordersData = response.data.orders;
                }
                
                if (ordersData) {
                    // 筛选有评价且已审核通过的订单
                    const auditedComments = ordersData.filter(order => {
                        const hasEvaluated = order.evaluate && order.evaluate.trim() !== '';
                        const isAudited = order.isAudited === true;
                        return hasEvaluated && isAudited;
                    });
                    
                    console.log('审核通过的评论数量:', auditedComments.length);
                    
                    if (auditedComments.length > 0) {
                        // 转换数据格式，取最新的几条评论
                        const latestComments = auditedComments
                            .sort((a, b) => new Date(b.evaluateTime || b.createTime) - new Date(a.evaluateTime || a.createTime))
                            .slice(0, 10); // 最多显示10条
                        
                        this.datas = latestComments.map(order => ({
                            name: this.formatTime(order.evaluateTime || order.createTime),
                            num: this.truncateText(order.evaluate, 30), // 限制评价内容长度
                            address: order.score ? `${order.score}分` : '5.0分' // 显示评分，默认5分
                        }));
                        
                        console.log('转换后的评论数据:', this.datas);
                        //this.$message.success(`加载了 ${this.datas.length} 条审核通过的评论`);
                    } else {
                        console.log('暂无审核通过的评论数据');
                    }
                } else {
                    console.error('评论API返回数据格式异常:', response.data);
                }
            } catch (error) {
                console.error('获取审核通过评论失败:', error);
                // 不显示错误提示，静默失败，使用默认数据
            }
        },
        
        // 格式化时间
        formatTime(timeStr) {
            if (!timeStr) return '未知时间';
            try {
                const date = new Date(timeStr);
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            } catch (e) {
                return '未知时间';
            }
        },
        
        // 截断文本
        truncateText(text, maxLength) {
            if (!text) return '';
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        },
        
        init() {
            const config = JSON.parse(JSON.stringify(this.config));
            config.data = this.datas.map((item, index) => {
                return [
                    `<div>${item.name}</div>`,
                    `<div>${item.num}</div>`,
                    `<div>${item.address}</div>`,
                ]
            })
            this.config = config
            
            // 如果使用后台数据，调整表格行数
            if (this.datas.length > 0 && this.datas.length < this.config.rowNum) {
                this.config.rowNum = this.datas.length;
            }
        },
    }
};
</script>
<style lang="scss" scoped>
.evaluate {
    .info {
        width: 100%;
        padding: 24px 32px 0;

        .t-header {
            display: flex;
            text-align: center;
            height: 64px;
            line-height: 64px;
            margin-bottom: 10px;

            .t-header--title {
                padding-right: 10px;

                >div {
                   font-size: 30px;
                   color: #FFFFFF;
                }
            }
        }

        .other-dv-scroll-board {
            ::v-deep .rows {
                .ceil {
                    padding: 0;
                    font-size: 26px !important;
                    padding-bottom: 10px;
                    padding-right: 8px;

                    >div {
                        width: 100%;
                        height: 100%;
                        white-space: nowrap; // 禁止换行
                        overflow: hidden; // 隐藏超出内容
                        text-overflow: ellipsis; // 显示省略号
                        padding-right: 10px;
                        line-height: 54px;
                        background: rgba(53, 168, 235, 0.15);
                        text-align: center;
                    }
                }
            }
        }
    }
}
</style>