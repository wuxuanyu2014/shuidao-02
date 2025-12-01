<template>
    <div class="base-title">
        <div class="title">
            <div class="tit">
                <slot name="title"></slot>
            </div>
            <div class="tabs" v-if="tabs.length">
                <div :class="['tab', pot === index ? 'active' : '']" v-for="(item, index) in tabs" :key="index"
                    @click="tabClick(item, index)">
                    <span>
                        {{ item.name }}
                    </span>
                </div>
            </div>

        </div>
        <div class="more" v-if="!!more" @click="handleOpenPage">
            <span>更多</span>
        </div>
        <div class="label-t">
            <slot name="label"></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: "baseTitle",
    props: {
        tabs: {
            type: Array,
            default: () => [],
        },
        pot: {
            type: Number,
            default: 0,
        },
        more: {
            type: String,
            default: ""
        }
    },
    methods: {
        handleOpenPage() {
            this.$router.push(this.more)
        },
        tabClick(item, index) {
            this.$emit("update:pot", index)
            this.$emit("tabClick", item);
        },
    },
}
</script>
<style lang="scss" scoped>
.base-title {
    position: relative;
    width: 900px;
    height: 80px;
    background: url('../assets/image/index/title1.png') no-repeat center bottom;
    background-size: 900px 80px;

    .tit {
        height: 40px;
        font-weight: bold;
        font-size: 40px;
        line-height: 40px;
        text-align: left;
        background: linear-gradient(180deg, #FFFFFF 39%, #31BEFF 61%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;

        /* 兼容性回退 */
    }

    .title {
        position: relative;
        padding-left: 86px;
        padding-top: 22px;

        img {
            display: block;
            height: 72px;
        }

        .tabs {
            display: flex;
            position: absolute;
            bottom: -9px;
            right: 0;

            .tab {

                width: 188px;
                height: 66px;
                background: url('../assets/image/index/title-tab.png') no-repeat;
                cursor: pointer;
                text-align: center;
                line-height: 66px;
                background-size: 188px 66px;
                margin-left: -30px;

                >span {
                    color: transparent; // 关键：让文字透明
                    background: linear-gradient(#fff 0%, rgba(70, 174, 250, 1) 100%);
                    background-clip: text;
                    justify-content: center;
                    font-size: 28px;
                    font-weight: bold;
                    opacity: 0.46;

                }
            }

            .tab.active {
                background: url('../assets/image/index/title-tab-active.png') no-repeat;
                background-size: 188px 66px;

                >span {
                    opacity: 1;
                }
            }
        }
    }

    .more {
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 146px;
        height: 66px;
        background: url('../assets/image/index/tit-more.png') no-repeat center bottom;
        background-size: 146px;
        height: 66px;
        text-align: center;
        line-height: 66px;

        >span {
            font-size: 24px;
            line-height: 24px;
            color: rgba($color: #86C5FF, $alpha: 0.8);
            font-weight: bold;
        }
    }
    .label-t{
        position: absolute;
        right: 34px;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>