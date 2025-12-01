<template>
    <div class="al-capture-records">
        <Xtitle name="AI行为管理" />
        <div class="content">
            <base-croll-board :data="data.list" :row-num="3" :row-height="92" :margin-bottom="4">
                <template #props="{ index, item }">
                    <div class="item" :key="index">
                        <div class="index">{{ item.index }}</div>
                        <div class="color-1" style="flex: 2;">{{ item.resName }}</div>
                        <div class="color-1" style="flex: 1;">{{ item.eventTypeName }}</div>
                        <div class="region" style="flex: 2;">{{ item.dateTime }}</div>
                        <div style="width: 116px;">
                            <el-image style="width: 112px; height: 56px;border: 2px solid #30C6FE;" :src="item.url"
                                :preview-src-list="[item.url]"></el-image>
                        </div>
                    </div>
                </template>
            </base-croll-board>
            <!-- <div class="item" v-for="(item, index) in data.list" :key="index">
                <div class="index">{{ index + 1 }}</div>
                <div class="color-1" style="flex: 2;">{{ item.resName }}</div>
                <div class="color-1" style="flex: 1;">{{ item.eventTypeName }}</div>
                <div class="region" style="flex: 2;">{{ item.dateTime }}</div>
                <div style="width: 116px;">
                    <el-image style="width: 112px; height: 56px;border: 2px solid #30C6FE;" :src="item.url"
                        :preview-src-list="[item.url]"></el-image>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script>
import Xtitle from "../../components/Xtitle/index-1";
import baseCrollBoard from '../../components/base-croll-board';
export default {
    props: {
        data: {
            type: Object,
            default: () => ({
                total: 0,
                list: []
            })
        }
    },
    data() {
        return {
            loading: true,
        };
    },
    components: {
        Xtitle,
        baseCrollBoard
    },
};
</script>

<style lang="scss" scoped>
.al-capture-records {
    .content {
        margin-top: 24px;
        height: 284px;
        overflow: hidden;

        .item {
            display: flex;
            height: 92px;
            align-items: center;
            font-size: 32px;
            padding: 0 140px 0 14px;
            margin-bottom: 4px;

            .index {
                color: #000A23;
                font-size: 32px;
                width: 60px;
                height: 60px;
                text-align: center;
                line-height: 60px;
                margin-right: 40px;
            }

            .color-1 {
                color: #00EEF5;
            }

            &:nth-child(odd) {
                background: rgba($color: #184d83, $alpha: 0.9);
                border: 2px solid #30C6FE;

                .index {
                    background: url(../../assets/image/info/odd.png) no-repeat;
                    background-size: 100% 100%;
                }
            }

            &:nth-child(even) {
                background: rgba($color: #188373, $alpha: 0.9);
                border: 2px solid #30FEED;

                .index {
                    background: url(../../assets/image/info/even.png) no-repeat;
                    background-size: 100% 100%;
                }
            }
        }
    }
}
</style>