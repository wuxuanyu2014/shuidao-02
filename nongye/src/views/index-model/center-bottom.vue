<template>
    <div class="center-bottom">
        <div class="item">
            <base-title>
                <img slot="title" src="@/assets/image/center-info/bottom-title-01.png" alt="">
            </base-title>
            <div class="plant">
                <div class="name">洋芋</div>
                <div class="number">200</div>
                <div class="unit">亩</div>
            </div>
            <div class="plant">
                <div class="name">水稻</div>
                <div class="number">200</div>
                <div class="unit">亩</div>
            </div>
        </div>
        <div class="item">
            <base-title>
                <img slot="title" src="@/assets/image/center-info/bottom-title-02.png" alt="">

            </base-title>
            <div class="actives">
                <div class="active" @click="handleClick('/commodity')">
                    <img src="../../assets/image/center-info/icon-5.png" alt="">
                </div>
                <div class="active" @click="handleClick('/orders')">
                    <img src="../../assets/image/center-info/icon-6.png" alt="">
                </div>
                <div class="active" @click="handleClick('/activitys')">
                    <img src="../../assets/image/center-info/icon-7.png" alt="">
                </div>
                <el-popover popper-class="other-el-popover" placement="top"  trigger="click">
                    <div style="text-align: center;">
                        <img :src="qrInfo.qrcode" style="width: 200px; height: 200px;" alt="" />
                        <div style="margin-top: 10px; font-size: 14px; color: #fff;">{{ qrInfo.qrtext }}</div>
                    </div>
                    <div class="active" slot="reference">
                        <img src="../../assets/image/center-info/icon-8.png" alt="">
                    </div>
                </el-popover>

            </div>
            <div class="serve" v-if="serveVisible">

            </div>
        </div>
    </div>
</template>
<script>
import BaseTitle from "@/components/base-title.vue";
import { getShopInfo } from "@/api/cockpit.js";

export default {
    components: {
        BaseTitle
    },
    data() {
        return {
            serveVisible: true,
            qrInfo: {
                qrcode: '../../assets/wnExHCeY9J.png',
                qrtext: '扫码联系'
            }
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            await this.fetchCenterBottomData();
        },
        async fetchCenterBottomData() {
            try {
                const response = await getShopInfo();
                const resData = response.data.data;
                if (resData && resData['center-bottom']) {
                    const bottomData = resData['center-bottom'];
                    this.serveVisible = bottomData.serveVisible !== undefined ? bottomData.serveVisible : true;
                    localStorage.setItem('center-bottom', JSON.stringify(bottomData));
                    console.log('中心底部数据更新成功:', bottomData);
                }
                if (resData && resData['qr-info']) {
                    const qrInfoData = resData['qr-info'];
                    this.qrInfo = qrInfoData;
                    localStorage.setItem('qr-info', JSON.stringify(qrInfoData));
                    console.log('二维码信息数据更新成功:', qrInfoData);
                }
            } catch (error) {
                // 接口失败时兜底读取localStorage
                const cachedData = localStorage.getItem('center-bottom');
                if (cachedData) {
                    try {
                        const data = JSON.parse(cachedData);
                        this.serveVisible = data.serveVisible !== undefined ? data.serveVisible : true;
                    } catch (e) {
                        console.error('解析中心底部数据失败:', e);
                    }
                }
                
                // 兜底读取二维码信息缓存
                const cachedQrData = localStorage.getItem('qr-info');
                if (cachedQrData) {
                    try {
                        const qrData = JSON.parse(cachedQrData);
                        this.qrInfo = qrData;
                    } catch (e) {
                        console.error('解析二维码信息数据失败:', e);
                    }
                }
                
                console.error('获取中心底部数据失败:', error);
            }
        },
        handleClick(path) {
            this.$router.push(path);
        }
    }
};
</script>
<style lang="scss" scoped>
.center-bottom {
    display: flex;
    padding: 6px 70px 0;
    justify-content: space-between;

    .item {
        padding-top: 8px;
        background: rgba(39, 67, 105, 0.83);
        border-radius: 0px 0px 0px 0px;
        width: 858px;
        height: 432px;

        .plant {
            width: 692px;
            height: 88px;
            background: url('../../assets/image/center-info/plant.png') no-repeat;
            display: flex;
            margin-left: 74px;
            margin-top: 40px;

            .name {
                width: 226px;
                height: 88px;
                text-align: center;
                font-weight: 400;
                font-size: 36px;
                color: #FFFFFF;
                line-height: 88px;
                text-align: center;
            }

            .number {
                margin-left: 36px;
                width: 350px;
                font-weight: bold;
                font-size: 52px;
                line-height: 88px;
                color: transparent; // 关键：让文字透明
                background: linear-gradient(#F5FEFF 0%, #5EACFF 82%);
                background-clip: text;
                justify-content: center;
            }

            .unit {
                flex: 1;
                height: 88px;
                line-height: 88px;
                font-size: 36px;
                color: #A8D9FF;
            }
        }
    }

    .actives {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 55px 72px 0 92px;

        .active {
            margin-bottom: 30px;
            cursor: pointer;
        }
    }
}
</style>