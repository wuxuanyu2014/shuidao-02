<template>
    <div>
        <div class="agricultural-management">
            <base-title :tabs="tabs" :pot.sync="pot" @tabClick="tabClick">
                <span slot="title">地块管理</span>
            </base-title>
            <div class="info">
                <dv-scroll-board class="other-dv-scroll-board" :config="config" style="height:225px" />
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
        BaseTitle
    },
    props:{
        items:{
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            tabs: [{
                name: '种植规划',
            }, {
                name: '农事记录'
            }],
            pot: 0,
            config: {
                rowNum: 3,
                evenRowBGC: 'transparent',
                oddRowBGC: 'transparent',
                columnWidth: [],
                data: [],
            },
            datas: [
                [],
                []
            ],
        };
    },
    mounted() {
        this.initData();
    },
    methods: {
        async initData() {
            await this.fetchAgriculturalManagement();
            this.init();
        },
        async fetchAgriculturalManagement() {
            try {
                const response = await getShopInfo();
                const resData = response.data;
                let data = null;
                
                if (resData && resData.success === true && resData.data) {
                    data = resData.data;
                } else if (resData && resData.shopInfo) {
                    data = resData;
                }
                
                if (data && data['agricultural-management']) {
                    const managementData = data['agricultural-management'];
                    if (Array.isArray(managementData) && managementData.length >= 2) {
                        this.datas = managementData;
                    } else if (Array.isArray(managementData) && managementData.length === 1) {
                        // 如果只有一个数组，复制一份作为第二个标签页
                        this.datas = [managementData[0], managementData[0]];
                    }
                    console.log('农业管理数据更新成功:', this.datas);
                } else if (this.items && this.items.length > 0) {
                    // 如果没有数据，使用props传入的items作为默认数据
                    this.datas = [[...this.items], []];
                }
            } catch (error) {
                console.error('获取农业管理数据失败:', error);
                // 如果接口失败，使用props传入的items作为默认数据
                if (this.items && this.items.length > 0) {
                    this.datas = [[...this.items], []];
                }
            }
        },
        init() {
            const config = JSON.parse(JSON.stringify(this.config));
            const currentData = this.datas[this.pot] || [];
            config.data = currentData.map((item, index) => {
                const color = index % 2 === 0 ? 'rgba(17,58,99,0.75)' : 'rgba(17,58,99,0.34)';
                // 根据数据结构处理，支持不同的字段名
                const name = item.name || item.title || '';
                const num = item.num || item.count || '';
                const address = item.address || item.description || '';
                return [
                    `<div style="background:${color}">${name}</div>`,
                    `<div style="background:${color}">${num}</div>`,
                    `<div style="background:${color}">${address}</div>`,
                ]
            });
            this.config = config;
        },
        tabClick(item){
            this.init();
        }
    }
};
</script>
<style lang="scss" scoped>
.agricultural-management {
    .info {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 18px 32px 0;
    }

    .other-dv-scroll-board {
        ::v-deep .rows {
            .ceil {
                padding: 0;
                font-size: 26px !important;
                padding-bottom: 10px;

                >div {
                    width: 100%;
                    height: 100%;
                    white-space: nowrap; // 禁止换行
                    overflow: hidden; // 隐藏超出内容
                    text-overflow: ellipsis; // 显示省略号
                    padding-left: 32px;
                    padding-right: 10px;
                    line-height: 65px;
                }
            }
        }
    }
}
</style>