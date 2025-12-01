<template>
    <div>
        <div class="agricultural-management">
            <base-title :tabs="tabs" :pot.sync="pot" @tabClick="tabClick">
                <img slot="title" src="@/assets/image/index/agricultural-management-title.png" alt="">
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
                [
                    { name: '洋芋', num: '10斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
                    { name: '洋芋', num: '11斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
                    { name: '洋芋', num: '12斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
                    { name: '洋芋', num: '13斤', address: '上海市浦东新区康桥镇秀沿路2783弄' }
                ],
                [
                    { name: '洋芋1', num: '10斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
                    { name: '洋芋1', num: '11斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
                    { name: '洋芋1', num: '12斤', address: '上海市浦东新区康桥镇秀沿路2783弄' },
                    { name: '洋芋1', num: '13斤', address: '上海市浦东新区康桥镇秀沿路2783弄' }
                ]
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
                if (resData && resData.data && resData.data['agricultural-management']) {
                    const managementData = resData.data['agricultural-management'];
                    this.datas = managementData;
                    localStorage.setItem('agricultural-management', JSON.stringify(managementData));
                    console.log('农业管理数据更新成功:', managementData);
                }
            } catch (error) {
                // 接口失败时兜底读取localStorage
                const cachedData = localStorage.getItem('agricultural-management');
                if (cachedData) {
                    try {
                        const data = JSON.parse(cachedData);
                        this.datas = data || this.datas;
                    } catch (e) {
                        console.error('解析农业管理数据失败:', e);
                    }
                }
                console.error('获取农业管理数据失败:', error);
            }
        },
        init() {
            const config = JSON.parse(JSON.stringify(this.config));
            config.data = this.datas[this.pot].map((item, index) => {
                const color = index % 2 === 0 ? 'rgba(17,58,99,0.75)' : ' rgba(17,58,99,0.34)';
                return [
                    `<div style="background:${color}">${item.name}</div>`,
                    `<div style="background:${color}">${item.num}</div>`,
                    `<div style="background:${color}">${item.address}</div>`,
                ]
            })
            this.config = config
        },
        tabClick(item){
            this.init()
        }
    }
};
</script>
<style lang="scss" scoped>
.agricultural-management{
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