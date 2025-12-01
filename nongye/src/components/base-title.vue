<template>
    <div class="base-title">
        <div class="title">
            <slot name="title"></slot>
            <div class="tabs" v-if="tabs.length">
                <div :class="['tab', pot === index ? 'active' : '']" v-for="(item, index) in tabs" :key="index" @click="tabClick(item, index)">
                    <span>
                        {{ item.name }}
                    </span>
                </div>
            </div>
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
    },
    methods: {
        tabClick(item, index) {
            this.$emit("update:pot", index)
            this.$emit("tabClick", item);
        },
    },
}
</script>
<style lang="scss" scoped>
.base-title {
    width: 860px;
    height: 72px;
    background: url('../assets/image/index/title1.png') no-repeat center bottom;

    .title {
        position: relative;
        padding-left: 72px;

        img {
            display: block;
            height: 72px;
        }

        .tabs {
            display: flex;
            position: absolute;
            bottom: 10px;
            right: 0;

            .tab {
                width: 158px;
                height: 46px;
                background: url('../assets/image/index/title-tab.png');
                cursor: pointer;
                text-align: center;
                line-height: 46px;

                &:last-child {
                    margin-left: -20px;
                }

                >span {
                    color: transparent; // 关键：让文字透明
                    background: linear-gradient(#fff 0%, rgba(70, 174, 250, 1) 100%);
                    background-clip: text;
                    justify-content: center;
                    font-size: 22px;
                    font-weight: bold;
                    opacity: 0.46;
                }
            }

            .tab.active {
                background: url('../assets/image/index/title-tab-active.png');

                >span {
                    opacity: 1;
                }
            }
        }
    }
}
</style>