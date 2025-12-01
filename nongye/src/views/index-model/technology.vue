<template>
    <div>
        <div class="technology">
            <base-title :pot="pot" @tabClick="tabClick" :tabs="tabs">
                <img slot="title" src="@/assets/image/index/technology.png" alt="">
            </base-title>
            <div class="info">
                <div class="item" v-for="(item, index) in banners" :key="index">
                    <div class="img">
                        <img :src="item.banner" alt="" />
                    </div>
                    <div class="info-text">
                        <div class="name-phone">{{ item.name }} {{ item.phone || '联系方式待更新' }}</div>
                        <div class="description">{{ item.description || '专业农业技术专家，经验丰富' }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 农业资讯弹窗 -->
        <el-dialog
            title="农业资讯"
            :visible.sync="consultingDialogVisible"
            width="80%"
            :before-close="handleConsultingClose"
            :append-to-body="true"
            :modal-append-to-body="false"
            :z-index="3000"
            class="consulting-dialog"
        >
            <div class="consulting-content">
                <!-- 左侧标题列表 -->
                <div class="consulting-list">
                    <div class="list-header">
                        <h3>资讯列表</h3>
                    </div>
                    <div class="list-items">
                        <div 
                            v-for="(item, index) in consultingList" 
                            :key="item._id || index"
                            class="list-item"
                            :class="{ active: selectedConsulting && selectedConsulting._id === item._id }"
                            @click="selectConsulting(item)"
                        >
                            <div class="item-title">{{ item.title }}</div>
                            <div class="item-meta">
                                <!-- <span class="item-type">{{ item.type || '咨询' }}</span> -->
                                <span class="item-date">{{ formatDate(item.createTime) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右侧内容区域 -->
                <div class="consulting-detail">
                    <div v-if="selectedConsulting" class="detail-content">
                        <div class="detail-header">
                            <h2>{{ selectedConsulting.title }}</h2>
                            <div class="detail-meta">
                                <!-- <span class="detail-type">{{ selectedConsulting.type || '咨询' }}</span> -->
                                <span class="detail-date">{{ formatDate(selectedConsulting.createTime) }}</span>
                            </div>
                        </div>
                        <div class="detail-body">
                            <div v-if="selectedConsulting.imageUrl" class="detail-image">
                                <img :src="selectedConsulting.imageUrl" alt="资讯图片" />
                            </div>
                            <div class="detail-text" v-html="formatContent(selectedConsulting.content)"></div>
                        </div>
                    </div>
                    <div v-else class="no-selection">
                        <p>请选择左侧资讯查看详情</p>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import BaseTitle from "@/components/base-title.vue";
import { getShopInfo, getConsulting } from "@/api/cockpit.js";

const banner1 = require("@/assets/image/technology/微信图片_20251014230133_487_20.jpg");
const banner2 = require("@/assets/image/technology/微信图片_20251014230134_488_20.jpg");
const banner3 = require("@/assets/image/technology/微信图片_20251014230714_492_20.png");

export default {
    name: "corporateCulture",
    components: {
        BaseTitle
    },
    data() {
        return {
            tabs: [{
                name: '专家库',
            },{
                name: '农业资讯',
            }],
            banners: [{
                banner: banner1,
                name: '张教授',
                phone: '138****8888',
                description: '农业种植专家，擅长作物病虫害防治'
            }, {
                banner: banner2,
                name: '陈教授',
                phone: '139****9999',
                description: '土壤改良专家，专注有机农业研究'
            }, {
                banner: banner3,
                name: '王教授',
                phone: '136****6666',
                description: '农业机械化专家，智慧农业推广者'
            }],
            pot: 0,
            // 农业资讯相关数据
            consultingDialogVisible: false,
            consultingList: [],
            selectedConsulting: null,
            consultingLoading: false
        };
    },
    mounted() {
        this.initData();
    },
    methods: {
        async initData() {
            // 首先从localStorage获取数据
            this.loadFromLocalStorage();
            
            // 然后尝试从接口获取最新数据
            await this.fetchTechnologyData();
        },
        
        // 从localStorage加载数据
        loadFromLocalStorage() {
            const cachedData = localStorage.getItem('technology');
            if (cachedData) {
                try {
                    const data = JSON.parse(cachedData);
                    this.tabs = data.tabs || this.tabs;
                    this.pot = data.pot || 0;
                    if (data.banners) {
                        // 将API中的banner映射到本地图片
                        const imageMap = [banner1, banner2, banner3];
                        this.banners = data.banners.map((item, index) => ({
                            ...item,
                            banner: imageMap[index] || banner1
                        }));
                    }
                } catch (error) {
                    console.error('解析技术数据失败:', error);
                }
            }
        },
        
        // 从接口获取数据
        async fetchTechnologyData() {
            try {
                const response = await getShopInfo();
                const resData = response.data.data;
                if (resData && resData['technology']) {
                    const techData = resData['technology'];
                    if (techData.tabs) {
                        this.tabs = techData.tabs;
                    }
                    if (techData.pot !== undefined) {
                        this.pot = techData.pot;
                    }
                    if (techData.banners) {
                        // 将API中的banner映射到本地图片
                        const imageMap = [banner1, banner2, banner3];
                        this.banners = techData.banners.map((item, index) => ({
                            ...item,
                            banner: imageMap[index] || banner1
                        }));
                    }
                    localStorage.setItem('technology', JSON.stringify(techData));
                    console.log('技术数据更新成功:', techData);
                }
            } catch (error) {
                // 接口失败时兜底读取localStorage
                const cachedData = localStorage.getItem('technology');
                if (cachedData) {
                    try {
                        const data = JSON.parse(cachedData);
                        this.tabs = data.tabs || this.tabs;
                        this.pot = data.pot || 0;
                        if (data.banners) {
                            const imageMap = [banner1, banner2, banner3];
                            this.banners = data.banners.map((item, index) => ({
                                ...item,
                                banner: imageMap[index] || banner1
                            }));
                        }
                    } catch (e) {
                        console.error('解析技术数据失败:', e);
                    }
                }
                console.error('获取技术数据失败:', error);
            }
        },
        
        init() {

        },
        tabClick(item) {
            if (item.name === '农业资讯') {
                this.openConsultingDialog();
            }
        },

        // 打开农业资讯弹窗
        async openConsultingDialog() {
            this.consultingDialogVisible = true;
            if (this.consultingList.length === 0) {
                await this.loadConsultingData();
            }
        },

        // 加载农业资讯数据
        async loadConsultingData() {
            this.consultingLoading = true;
            try {
                const response = await getConsulting();
                const data = response.data;
                
                if (data.success && data.data) {
                    this.consultingList = data.data;
                    // 默认选择第一个
                    if (this.consultingList.length > 0) {
                        this.selectedConsulting = this.consultingList[0];
                    }
                    console.log('农业资讯数据加载成功:', this.consultingList);
                } else {
                    console.error('农业资讯数据格式异常:', data);
                    this.$message.error('获取农业资讯数据失败');
                }
            } catch (error) {
                console.error('加载农业资讯失败:', error);
                this.$message.error('网络请求失败：' + error.message);
            } finally {
                this.consultingLoading = false;
            }
        },

        // 选择资讯
        selectConsulting(item) {
            this.selectedConsulting = item;
        },

        // 关闭弹窗
        handleConsultingClose() {
            this.consultingDialogVisible = false;
            this.selectedConsulting = null;
        },

        // 格式化日期
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        },

        // 格式化内容
        formatContent(content) {
            if (!content) return '';
            // 将换行符转换为HTML换行
            return content.replace(/\n/g, '<br>');
        }
    }
};
</script>
<style lang="scss" scoped>
.technology {
    .info {
        width: 100%;
        padding: 24px 32px 0;
        display: flex;
        justify-content: space-between;

        .item {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            min-width: 0;
            
            .img {
                padding: 6px;
                width: 180px;
                height: 140px;
                background: url("../../assets/image/index/technology-border.png") no-repeat;
                background-size: contain;
                flex-shrink: 0;
                
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
            
            .info-text {
                margin-top: 12px;
                width: 100%;
                
                .name-phone {
                    text-align: center;
                    height: 32px;
                    line-height: 32px;
                    font-size: 20px;
                    color: #C9EBFF;
                    font-weight: bold;
                    letter-spacing: 1px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                .description {
                    margin-top: 8px;
                    text-align: center;
                    font-size: 24px;
                    color: #A8D8F0;
                    line-height: 1.4;
                    padding: 0 8px;
                    height: 68px;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
            }
        }
    }
}

// 农业资讯弹窗样式
::v-deep .consulting-dialog {
    z-index: 3000 !important;
    
    .el-dialog {
        background: rgba(39, 67, 105, 0.95);
        border: 1px solid rgba(36, 186, 255, 0.5);
        border-radius: 8px;
        z-index: 3000 !important;
    }
    
    .el-dialog__wrapper {
        z-index: 3000 !important;
    }
    
    .el-overlay {
        z-index: 2999 !important;
    }
    
    .el-dialog__header {
        background: rgba(36, 186, 255, 0.2);
        border-bottom: 1px solid rgba(36, 186, 255, 0.3);
        
        .el-dialog__title {
            color: #FFFFFF;
            font-weight: bold;
        }
        
        .el-dialog__close {
            color: #FFFFFF;
        }
    }
    
    .el-dialog__body {
        padding: 0;
        background: transparent;
    }
}

.consulting-content {
    display: flex;
    height: 600px;
    background: transparent;

    .consulting-list {
        width: 30%;
        border-right: 1px solid rgba(36, 186, 255, 0.3);
        background: rgba(20, 40, 70, 0.8);
        
        .list-header {
            padding: 20px;
            border-bottom: 1px solid rgba(36, 186, 255, 0.3);
            background: rgba(36, 186, 255, 0.2);
            
            h3 {
                margin: 0;
                color: #FFFFFF;
                font-size: 24px;
                font-weight: bold;
            }
        }
        
        .list-items {
            height: calc(100% - 70px);
            overflow-y: auto;
            
            .list-item {
                padding: 15px 20px;
                border-bottom: 1px solid rgba(36, 186, 255, 0.2);
                cursor: pointer;
                transition: all 0.3s ease;
                
                &:hover {
                    background: rgba(36, 186, 255, 0.1);
                }
                
                &.active {
                    background: rgba(36, 186, 255, 0.3);
                    border-left: 3px solid rgba(36, 186, 255, 0.8);
                }
                
                .item-title {
                    color: #FFFFFF;
                    font-size: 20px;
                    font-weight: 500;
                    margin-bottom: 10px;
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .item-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    
                    .item-type {
                        color: #5EACFF;
                        font-size: 14px;
                        background: rgba(94, 172, 255, 0.2);
                        padding: 4px 10px;
                        border-radius: 4px;
                    }
                    
                    .item-date {
                        color: #C4E5FE;
                        font-size: 14px;
                    }
                }
            }
        }
    }

    .consulting-detail {
        width: 70%;
        background: rgba(20, 40, 70, 0.6);
        
        .detail-content {
            height: 100%;
            display: flex;
            flex-direction: column;
            
            .detail-header {
                padding: 20px;
                border-bottom: 1px solid rgba(36, 186, 255, 0.3);
                background: rgba(36, 186, 255, 0.1);
                
                h2 {
                    margin: 0 0 15px 0;
                    color: #FFFFFF;
                    font-size: 28px;
                    font-weight: bold;
                    line-height: 1.4;
                }
                
                .detail-meta {
                    display: flex;
                    gap: 20px;
                    
                    .detail-type {
                        color: #5EACFF;
                        font-size: 16px;
                        background: rgba(94, 172, 255, 0.2);
                        padding: 6px 14px;
                        border-radius: 4px;
                    }
                    
                    .detail-date {
                        color: #C4E5FE;
                        font-size: 16px;
                    }
                }
            }
            
            .detail-body {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                
                .detail-image {
                    margin-bottom: 20px;
                    text-align: center;
                    
                    img {
                        max-width: 100%;
                        max-height: 300px;
                        border-radius: 8px;
                        border: 1px solid rgba(36, 186, 255, 0.3);
                    }
                }
                
                .detail-text {
                    color: #E6F3FF;
                    font-size: 20px;
                    line-height: 1.8;
                    word-break: break-word;
                    
                    ::v-deep br {
                        margin: 12px 0;
                    }
                }
            }
        }
        
        .no-selection {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            
            p {
                color: #C4E5FE;
                font-size: 24px;
                margin: 0;
            }
        }
    }
}

// 滚动条样式
.consulting-list .list-items::-webkit-scrollbar,
.consulting-detail .detail-body::-webkit-scrollbar {
    width: 6px;
}

.consulting-list .list-items::-webkit-scrollbar-track,
.consulting-detail .detail-body::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

.consulting-list .list-items::-webkit-scrollbar-thumb,
.consulting-detail .detail-body::-webkit-scrollbar-thumb {
    background: rgba(36, 186, 255, 0.5);
    border-radius: 3px;
}

.consulting-list .list-items::-webkit-scrollbar-thumb:hover,
.consulting-detail .detail-body::-webkit-scrollbar-thumb:hover {
    background: rgba(36, 186, 255, 0.8);
}
</style>