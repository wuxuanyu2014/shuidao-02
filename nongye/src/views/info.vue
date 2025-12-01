<template>
    <div>
        <pot-baidu-map :data="center"></pot-baidu-map>
        <div id="info" ref="appRef">
            <div class="bg">
                <dv-loading v-if="loading">Loading...</dv-loading>
                <div v-else class="host-body">
                    <div class="top-bg">
                        阳光配送
                        <div style="font-size: 40px; margin-top: 45px;">{{ licenseManagement.shopName }}</div>
                    </div>
                    <div class="body-box">
                        <div class="bottom-box">
                            <div class="box" style="width: 1074px;">
                                <license-management :data="licenseManagement"></license-management>
                                <business-management :data="businessManagement"
                                    @on-track-click="handleTrackClick"></business-management>
                            </div>
                            <div class="box" style="width: 1430px;">
                                <detection-management :data="detection"></detection-management>
                                <div style="height: 1157px;"></div>
                                <ai-capture-records :data="eventData"></ai-capture-records>
                            </div>
                            <div class="box" style="width: 1074px;">

                                <ai-management :data="camera" style="margin-bottom: 140px;"></ai-management>
                                <cold-storage-management :data="coldStorage"></cold-storage-management>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import drawMixin from "../utils/drawMixin";
import LicenseManagement from "./info/license-management.vue";
import BusinessManagement from "./info/business-management.vue";
import DetectionManagement from "./info/detection-management.vue";
import AiCaptureRecords from "./info/ai-capture-records.vue";
import AiManagement from "./info/ai-management.vue";
import ColdStorageManagement from "./info/cold-storage-management.vue";
import PotBaiduMap from './info/pot-baidu-map.vue'

import {
    getBigDataShop,
    getShopGetShopList,
    getShopStaff,
    getShopColdVehicle,
    getShopReport,
    getShopAiCamera,
    getShopEventList,
    getShopColdStorage,
    getShopTrack
} from "../api/cockpit";
export default {
    components: {
        LicenseManagement,
        BusinessManagement,
        DetectionManagement,
        AiCaptureRecords,
        AiManagement,
        ColdStorageManagement,
        PotBaiduMap
    },
    mixins: [drawMixin],
    data() {
        return {
            loading: true,
            center: {
                licensePlate: '',
                showInfo: false,
                coldStorage: {},
                point: [],
            },
            licenseManagement: {},
            businessManagement: {
                supplier: {
                    total: 0,
                    list: []
                },
                customer: {
                    total: 0,
                    list: []
                },
                staff: {
                    total: 0,
                    list: []
                },
                vehicle: {
                    total: 0,
                    list: []
                }
            },
            detection: {
                checkData: {
                    count: 0,
                },
                qualified: {
                    count: 0,
                },
                unCheckData: {
                    count: 0,
                },
                unQualified: {
                    count: 0,
                }
            },
            eventData: {
                total: 0,
                list: []
            },
            camera: [],
            coldStorage: [],
        };
    },
    mounted() {
        this.cancelLoading();
        this.init()
    },
    methods: {
        init() {
            this.getBigDataShopData()
            this.getShopGetShopData()
            this.getCustomer()
            this.getStaff()
            this.getVehicle()
            this.getReport()
            this.getAiCamera()
            this.getEventList()
            this.getColdStorage()
            this.setColdStorageTimeout()
        },
        cancelLoading() {
            setTimeout(() => {
                this.loading = false;
            }, 1000);
        },
        async getBigDataShopData() {
            const res = await getBigDataShop(this.$route.query.id);
            this.licenseManagement = res.data
            this.center = {
                licensePlate: '',
                showInfo: false,
                coldStorage: {},
                point: [res.data.shopLongitude || 116.404, res.data.shopLatitude || 39.925]
                // point: [116.404, 39.925]
            }
            console.log(this.center)
        },
        async getShopGetShopData() {
            const res = await getShopGetShopList(this.$route.query.id, 1);
            this.businessManagement.supplier = res.data
        },
        async getCustomer() {
            const res = await getShopGetShopList(this.$route.query.id, 2);
            this.businessManagement.customer = res.data
        },
        async getStaff() {
            const res = await getShopStaff(this.$route.query.id);
            this.businessManagement.staff = res.data
        },
        async getVehicle() {
            const res = await getShopColdVehicle(this.$route.query.id);
            this.businessManagement.vehicle = res.data
        },
        async getReport() {
            const res = await getShopReport(this.$route.query.id);
            this.detection = res.data
        },
        async getAiCamera() {
            const res = await getShopAiCamera(this.$route.query.id, { protocol: 'wss' });
            this.camera = res.data.map((item, index) => ({ ...item, index }))
        },
        async getEventList() {
            const res = await getShopEventList(this.$route.query.id);
            this.eventData = res.data
        },
        async getColdStorage() {
            const res = await getShopColdStorage(this.$route.query.id, { protocol: 'wss' });
            this.coldStorage = res.data
        },
        async handleTrackClick(item) {
            const res = await getShopTrack(item.id);
            const { gps, coldStorage, licensePlate, carType } = res.data
            const { lat, lng } = gps
            this.center = {
                licensePlate,
                coldStorage,
                showInfo: true,
                point: [lng, lat],
                carType
            }
            console.log(this.center)
        },
        setColdStorageTimeout(){
            setTimeout(async () => {
                await this.getColdStorage()
                this.setColdStorageTimeout()
            }, 10000)
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/index.scss";

.top-bg {
    padding-top: 30px;
    height: 166px;
    width: 100%;
    font-size: 50px;
    font-family: Source Han Sans CN;
    font-weight: 800;
    color: #01b5ff;
    text-align: center;
}

.box {
    flex: none !important;
}
</style>
