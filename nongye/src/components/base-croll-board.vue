<template>
    <div class="base-croll-board" :style="style" @mouseenter="stop" @mouseleave="handleRun">
        <slot name="props" v-for="(item, index) in list" :item="item" :index="index"></slot>
    </div>
</template>
<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => []
        },
        rowHeight: {
            type: Number,
            default: 64
        },
        marginBottom: {
            type: Number,
            default: 8
        },
        duration: {
            type: Number,
            default: 2000
        },
        rowNum: {
            type: Number,
            default: 10
        }
    },
    data() {
        return {
            style: {
                transition: 'none',
                transform: `translateY(0px)`
            },
            top: 0,
            pot: 0,
            setTime: null
        }
    },
    methods: {
        runOne() {
            this.top = this.top - this.rowHeight - this.marginBottom
            this.pot++
            this.style = {
                transition: 'all 0.3s',
                transform: `translateY(${this.top}px)`
            }
            this.run()
        },
        run() {
            if (this.pot > this.data.length) {
                this.style.transition = 'none'
                this.pot = 0
                this.top = 0
                this.style.transform = `translateY(${this.top}px)`
                setTimeout(() => {
                    this.runOne()
                }, 0)
            } else {
                this.setTime = setTimeout(() => {
                    this.top = this.top - this.rowHeight - this.marginBottom
                    this.pot++
                    this.style = {
                        transition: 'all 0.3s',
                        transform: `translateY(${this.top}px)`
                    }
                    clearTimeout(this.setTime)
                    this.run()
                }, this.duration)
            }


        },
        stop() {
            clearTimeout(this.setTime)
        },
        handleRun() {
            if (this.data.length > this.rowNum) {
                this.run()
            }
        }
    },
    computed: {
        list() {
            if (this.data.length > this.rowNum) {
                const arr = this.data.map((item, index) => ({
                    ...item,
                    index: index + 1
                }))
                return [...arr, ...arr.slice(0, this.rowNum)]
            } else {
                return this.data.map((item, index) => ({
                    ...item,
                    index: index + 1
                }))
            }

        },
    },
    watch: {
        data: {
            handler() {
                if (this.data.length > this.rowNum) {
                    this.$nextTick(() => {
                        this.run()
                    })
                }
            },
            immediate: true
        }
    }
}
</script>
<style lang="scss" scoped>
.base-croll-board {
    transition: all 0.3s;
}
</style>