<template>
    <div class="business-management">
        <div class="title">
            <div>供应商管理</div>
            <div>总数：<countTo :startVal='0' :endVal='data.supplier.total' :duration='2000'></countTo>
            </div>
        </div>
        <div class="box supplier">
            <base-croll-board :data="data.supplier.list" :row-num="2">
                <template #props="{ index, item }">
                    <div class="item" :key="index">
                        <div class="index">{{ item.index }}</div>
                        <div class="company">{{ item.shopName }}</div>
                        <div class="region">{{ item.countryName }}</div>
                    </div>
                </template>
            </base-croll-board>
            <!-- <div class="item" v-for="(item, index) in  data.supplier.list " :key="item.id">
                <div class="index">{{ index + 1 }}</div>
                <div class="company">{{ item.shopName }}</div>
                <div class="region">{{ item.countryName }}</div>
            </div> -->
        </div>
        <div class="title">
            <div>客户管理</div>
            <div>总数：<countTo :startVal='0' :endVal='data.customer.total' :duration='2000'></countTo>
            </div>
        </div>
        <div class="box customer">
            <base-croll-board :data="data.customer.list" :row-num="2">
                <template #props="{ index, item }">
                    <div class="item" :key="index">
                        <div class="index">{{ item.index }}</div>
                        <div class="company">{{ item.shopName }}</div>
                        <div class="region">{{ item.countryName }}</div>
                    </div>
                </template>
            </base-croll-board>
            <!-- <div class="item" v-for="(item, index) in  data.customer.list " :key="item.id">
                <div class="index">{{ index + 1 }}</div>
                <div class="company">{{ item.shopName }}</div>
                <div class="region">{{ item.countryName }}</div>
            </div> -->
        </div>
        <div class="title">
            <div>从业人员管理</div>
            <div>总数： <countTo :startVal='0' :endVal='data.staff.total' :duration='2000'></countTo>
            </div>
        </div>
        <div class="staff">
            <div class="thead">
                <div class="flex-1">编号</div>
                <div class="flex-4">从业人员</div>
                <div class="flex-4">手机号码</div>
                <div class="flex-4">健康证</div>
                <div class="flex-4">健康证状态</div>
                <div class="flex-4">到期时间</div>
            </div>
            <div class="box" style="height: 208px;">
                <div style="height: 0; border: 0 none;"></div>
                <base-croll-board :data="data.staff.list" :row-num="3">
                    <template #props="{ index, item }">
                        <div class="item" :key="index">
                            <div class="flex-1">
                                <div class="index" style="margin-right: 0;">{{ item.index }}</div>
                            </div>
                            <div class="company flex-4">{{ item.name }}</div>
                            <div class="company  flex-4">{{ item.mobile }}</div>
                            <div class="company  flex-4">
                                <el-image style="width: 48px; height: 48px; border: 2px solid #30C6FE;"
                                    :src="item.healthImg" :preview-src-list="[item.healthImg]">
                                </el-image>
                            </div>
                            <div class="company  flex-4">{{ ["正常", "即将过期", "过期"][item.status] }}</div>
                            <div class="company  flex-4">{{ item.healthExpired }}</div>
                        </div>
                    </template>
                </base-croll-board>
                <!-- <div style="height: 0; border: 0 none;"></div>
                <div class="item" v-for="(item, index) in  data.staff.list " :key="item.id">
                    <div class="flex-1">
                        <div class="index" style="margin-right: 0;">{{ index + 1 }}</div>
                    </div>
                    <div class="company flex-4">{{ item.name }}</div>
                    <div class="company  flex-4">{{ item.mobile }}</div>
                    <div class="company  flex-4">
                        <el-image style="width: 48px; height: 48px; border: 2px solid #30C6FE;" :src="item.healthImg"
                            :preview-src-list="[item.healthImg]">
                        </el-image>
                    </div>
                    <div class="company  flex-4">{{ ["正常", "即将过期", "过期"][item.status] }}</div>
                    <div class="company  flex-4">{{ item.healthExpired }}</div>
                </div> -->
            </div>
        </div>
        <div class="title">
            <div>配送车辆管理</div>
            <div>总数： <countTo :startVal='0' :endVal='data.vehicle.total' :duration='2000'></countTo>
            </div>
        </div>
        <div class="vehicle">
            <div class="thead">
                <div class="flex-4">车辆类型</div>
                <div class="flex-4">车牌号</div>
                <div class="flex-4">驾驶员</div>
                <div class="flex-4">车辆状态</div>
            </div>
            <div class="box" style="height: 208px;">
                <div style="height: 0; border: 0 none;"></div>
                <base-croll-board :data="data.vehicle.list" :row-num="3">
                    <template #props="{ index, item }">
                        <div class="item" style="cursor: pointer;" :key="index"
                            @click="handleVehicleClick(item, index)">
                            <div class="company flex-4">{{ item.carType }}</div>
                            <div class="company  flex-4">{{ item.licensePlate }}</div>
                            <div class="company  flex-4">{{ item.driver }}</div>
                            <div class="company  flex-4">{{ item.status }}</div>
                        </div>
                    </template>
                </base-croll-board>
                <!-- <div class="item" v-for="(item, index) in  data.vehicle.list " style="cursor: pointer;" :key="item.id"
                    @click="handleVehicleClick(item)">
                    <div class="company flex-4">{{ item.carType }}</div>
                    <div class="company  flex-4">{{ item.licensePlate }}</div>
                    <div class="company  flex-4">{{ item.driver }}</div>
                    <div class="company  flex-4">{{ item.status }}</div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import Xtitle from "../../components/Xtitle/index-1";
import countTo from 'vue-count-to';
import baseCrollBoard from '../../components/base-croll-board';
export default {
    props: {
        data: {
            type: Object,
            default: () => ({
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
            })
        }
    },
    data() {
        return {
            loading: true,
            initData: {
                // header: ["组件", "分支", "覆盖率"],
                data: [],
                list: [],
                rowNum: 2, //表格行数
                oddRowBGC: "rgba(24,131,115,0.7)",
                evenRowBGC: "rgba(24,77,131,0.7)",
                index: false,
                columnWidth: [50, 300, 120, 436],
                align: ["left"],
                hoverPause: true,
                waitTime: 100000,

            },
            activeTrack: 0
        };
    },
    components: {
        Xtitle,
        countTo,
        baseCrollBoard
    },
    methods: {
        handleVehicleClick(item, index) {
            this.activeTrack = index
            this.$emit('on-track-click', item)
        },
        setTrackPoint() {
            setTimeout(() => {
                this.activeTrack += 1
                if (this.activeTrack >= this.vehicle.length) this.activeTrack = 0
                this.$emit('on-track-click',  this.vehicle[this.activeTrack])
                this.setTrackPoint()
            }, 10000)
        },
    },
    computed: {
        supplier() {
            return {
                ...this.initData,
                data: this.data.supplier.list.map((item, index) => [index + 1, item.shopName, item.countryName])
            }
        },
        vehicle() {
            return this.data.vehicle.list
        },
    },
    watch: {
        vehicle: {
            handler(value) {
                if (value && value.length) {
                    this.setTrackPoint()
                }
            },
            deep: true,
            immediate: true
        },
    }
};
</script>

<style lang="scss" scoped>
.business-management {
    .title {
        display: flex;
        justify-content: space-between;
        font-size: 36px;
        color: #02BCFC;
        padding-left: 164px;
        padding-right: 30px;
        height: 84px;
        line-height: 84px;
        background: url(../../assets/image/info/title.png) no-repeat;
        background-size: 100% 100%;
        margin: 28px 0 16px;
        font-weight: 600;
    }

    .box {
        height: 136px;
        overflow: hidden;

        .item {
            display: flex;
            align-items: center;
            padding: 0 18px;
            height: 64px;
            line-height: 64px;
            font-size: 24px;
            margin-bottom: 8px;

            .index {
                color: #000A23;
                font-size: 22px;
                width: 44px;
                height: 44px;
                text-align: center;
                line-height: 44px;
                margin-right: 48px;
            }

            &:nth-child(odd) {
                background: rgba($color: #184d83, $alpha: 0.9);
                border: 2px solid #30C6FE;

                .index {
                    background: url(../../assets/image/info/odd.png) no-repeat;
                }
            }

            &:nth-child(even) {
                background: rgba($color: #188373, $alpha: 0.9);
                border: 2px solid #30FEED;

                .index {
                    background: url(../../assets/image/info/even.png) no-repeat;
                }
            }

            .company {
                width: 500px;
                padding-right: 50px;
                color: #00EEF5;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }


        }
    }

    .thead {
        height: 64px;
        align-items: center;
        padding-left: 18px;
        display: flex;
        background: #184D83;
        border: 2px solid #30C6FE;
        margin-bottom: 8px;
        font-size: 24px;


    }

    .flex-1 {
        flex: 1;
    }

    .flex-4 {
        flex: 4;
        display: flex;
        justify-content: center;
        align-items: center;
    }

}
</style>