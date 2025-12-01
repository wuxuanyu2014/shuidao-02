<template>
    <div>
        <div class="agricultural-machinery-services">
            <div class="title-container">
                <base-title :tabs="tabs">
                    <img slot="title" src="@/assets/image/index/agricultural-machinery-services-title.png" alt="">
                </base-title>
                <el-popover popper-class="device-list-popover" placement="right" trigger="click">
                    <div class="device-table-popover">
                        <div class="table-header">
                            <div class="header-cell">项目名称</div>
                            <div class="header-cell">数量</div>
                            <div class="header-cell">单位</div>
                        </div>
                        <div class="table-body">
                            <div class="table-row" v-for="(device, index) in deviceList" :key="index">
                                <div class="table-cell">{{ device.name }}</div>
                                <div class="table-cell">{{ device.count }}</div>
                                <div class="table-cell">{{ device.unit }}</div>
                            </div>
                        </div>
                    </div>
                    <div slot="reference" class="device-list-tab">
                        <div class="tab">
                            <span>设备列表</span>
                        </div>
                    </div>
                </el-popover>
            </div>
            <div class="info">
                <div class="base">
                    <div>
                        <div class="number">{{ number }} <span class="icon">台</span></div>
                        <div class="name">农机设备</div>
                    </div>
                    <div>
                        <div class="number">{{ kilometer }} <span class="icon">台次</span></div>
                        <div class="name">累计服务</div>
                    </div>
                    <div>
                        <div class="number">{{ mu }} <span class="icon">亩</span></div>
                        <div class="name">累计田地</div>
                    </div>
                </div>
                <base-bar-echart :id="'agricultural-machinery-services'"
                    :cssStyle="{ height: '300px', width: '100%' }"></base-bar-echart>
            </div>
        </div>
    </div>
</template>
<script>
import BaseTitle from "@/components/base-title.vue";
import BaseBarEchart from "@/components/base-bar-echart.vue";
import { getShopInfo } from "@/api/cockpit.js";

export default {
    name: "corporateCulture",
    components: {
        BaseTitle,
        BaseBarEchart
    },
    data() {
        return {
            number: 38,
            kilometer: 56,
            mu: 5,
            tabs: [],
            deviceList: [
                { name: '拖拉机', count: 2, unit: '台' },
                { name: '农业无人机', count: 2, unit: '台' },
                { name: '旋耕机', count: 2, unit: '台' },
                { name: '微耕机', count: 4, unit: '台' },
                { name: '圆盘开沟机', count: 1, unit: '台' },
                { name: '土豆播种机', count: 2, unit: '台' },
                { name: '土豆收获机', count: 2, unit: '台' },
                { name: '土豆筛选机', count: 1, unit: '台' },
                { name: '农膜覆盖机', count: 2, unit: '台' }
            ]
        };
    },

    mounted() {
        this.init();
    },
    methods: {
        async init() {
            // this.loadFromLocalStorage(); // 注释掉本地缓存优先
            await this.fetchAgriculturalMachineryServices();
        },
        
        
        // 从localStorage加载数据
        loadFromLocalStorage() {
            const cachedData = localStorage.getItem('agricultural-machinery-services');
            if (cachedData) {
                try {
                    const data = JSON.parse(cachedData);
                    this.number = data.number || 38;
                    this.kilometer = data.kilometer || 56;
                    this.mu = data.mu || 5;
                } catch (error) {
                    console.error('解析农机服务数据失败:', error);
                }
            }
        },
        
        // 从接口获取数据
        async fetchAgriculturalMachineryServices() {
            try {
                const response = await getShopInfo();
                const resData = response.data.data;
                console.log("wxy",resData);
                if (resData && resData['agricultural-machinery-services']) {
                    const machineryData = resData['agricultural-machinery-services'];
                    console.log("wxy1",machineryData);
                    this.number = machineryData.number || 38;
                    this.kilometer = machineryData.kilometer || 56;
                    this.mu = machineryData.mu || 5;
                    localStorage.setItem('agricultural-machinery-services', JSON.stringify({
                        number: this.number,
                        kilometer: this.kilometer,
                        mu: this.mu
                    }));
                    console.log('农机服务数据更新成功:', machineryData);
                }
                if (resData && resData['deviceList']) {
                    this.deviceList = resData['deviceList'];
                }
            } catch (error) {
                // 接口失败时兜底读取localStorage
                const cachedData = localStorage.getItem('agricultural-machinery-services');
                if (cachedData) {
                    try {
                        const data = JSON.parse(cachedData);
                        this.number = data.number || 38;
                        this.kilometer = data.kilometer || 56;
                        this.mu = data.mu || 5;
                    } catch (e) {
                        console.error('解析农机服务数据失败:', e);
                    }
                }
                console.error('获取农机服务数据失败:', error);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.agricultural-machinery-services {
    margin-top: 38px;

    .title-container {
        position: relative;
        display: flex;
        align-items: center;
    }

    .device-list-tab {
        position: absolute;
        bottom: 10px;
        right: 0;
        cursor: pointer;

        .tab {
            width: 158px;
            height: 46px;
            background: url('../../assets/image/index/title-tab.png');
            cursor: pointer;
            text-align: center;
            line-height: 46px;

            >span {
                color: transparent;
                background: linear-gradient(#fff 0%, rgba(70, 174, 250, 1) 100%);
                background-clip: text;
                justify-content: center;
                font-size: 22px;
                font-weight: bold;
                opacity: 0.46;
            }

            &:hover {
                background: url('../../assets/image/index/title-tab-active.png');
                
                >span {
                    opacity: 1;
                }
            }
        }
    }

    .info {
        margin-top: 22px;

        .base {
            display: flex;
            margin-bottom: 24px;
            >div {
                flex: 1;
                background: url('../../assets/image/index/agricultural-machinery-services-icon.png') no-repeat center 18px;

                .number {
                    display: flex;
                    font-weight: bold;
                    font-size: 52px;
                    height: 62px;
                    line-height: 62px;
                    color: transparent; // 关键：让文字透明
                    background: linear-gradient(#F5FEFF 0%, #5EACFF 82%);
                    background-clip: text;
                    justify-content: center;
                    margin-bottom: 58px;

                    .icon {
                        display: block;
                        font-size: 28px;
                        height: 52px;
                        line-height: 62px;
                        margin-left: 6px;
                    }
                }

                .name {
                    height: 42px;
                    font-weight: bold;
                    font-size: 32px;
                    line-height: 42px;
                    color: transparent; // 关键：让文字透明
                    background: linear-gradient(#F5FEFF 0%, #5EACFF 82%);
                    background-clip: text;
                    justify-content: center;
                    text-align: center;
                }
            }
        }

        .tab-reference {
            cursor: pointer;
        }
    }
}

// 弹框样式
::v-deep .device-list-popover {
    background: rgba(20, 40, 70, 0.98) !important;
    border: 1px solid rgba(36, 186, 255, 0.7) !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7) !important;
    padding: 0 !important;
}

.device-table-popover {
    width: 400px;
    padding: 20px;

    .table-header {
        display: flex;
        background: rgba(36, 186, 255, 0.2);
        border-radius: 4px;
        margin-bottom: 10px;

        .header-cell {
            flex: 1;
            padding: 12px 8px;
            font-size: 18px;
            font-weight: bold;
            // color: #FFFFFF;
            text-align: center;
            border-right: 1px solid rgba(36, 186, 255, 0.3);

            &:last-child {
                border-right: none;
            }
        }
    }

    .table-body {
        max-height: 300px;
        overflow-y: auto;

        .table-row {
            display: flex;
            border-bottom: 1px solid rgba(36, 186, 255, 0.2);
            transition: background-color 0.3s ease;

            &:hover {
                background: rgba(36, 186, 255, 0.1);
            }

            &:last-child {
                border-bottom: none;
            }

            .table-cell {
                flex: 1;
                padding: 10px 8px;
                font-size: 16px;
                // color: #C4E5FE;
                text-align: center;
                border-right: 1px solid rgba(36, 186, 255, 0.2);

                &:last-child {
                    border-right: none;
                }

                &:nth-child(2) {
                    color: #FFD700;
                    font-weight: bold;
                }
            }
        }
    }
}
</style>