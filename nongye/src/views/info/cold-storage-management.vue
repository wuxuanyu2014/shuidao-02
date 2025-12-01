<template>
    <div class="cold-storage-management">
        <Xtitle name="冷库管理"></Xtitle>
        <div class="content">
            <div class="box">
                <base-croll-board :data="data" :row-num="3" :row-height="300" :margin-bottom="0">
                    <template #props="{ index, item }">
                        <div class="item" :key="index">
                            <div class="image-box">
                                <img style="width: 100%; height: 100%;" :src="showImages[item.index - 1]"
                                    v-if="isRead && showImages[item.index - 1]" />
                                <div v-if="isRead && !showImages[item.index - 1]" :id="`player-${item.index - 1}`"
                                    class="video"></div>
                                <!-- <video-player v-if="isRead && !showImages[item.index - 1]" class="video"
                                    :options="videos[item.index - 1]"></video-player> -->
                            </div>
                            <div class="info-warp">
                                <div class="title">{{ item.name }}</div>
                                <div class="info">
                                    <div>
                                        <div class="label"><img src="../../assets/image/info/temperature.png" />温度</div>
                                        <div class="value">{{ item.temperature }}℃</div>
                                    </div>
                                    <div>
                                        <div class="label"><img src="../../assets/image/info/humidity.png" />湿度</div>
                                        <div class="value">{{ item.humidity }}%RH</div>
                                    </div>
                                    <div>
                                        <div class="label"><img src="../../assets/image/info/status.png" /> 状态</div>
                                        <div class="value">{{ item.statusText }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </base-croll-board>

            </div>
        </div>
    </div>
</template>

<script>
import Xtitle from "../../components/Xtitle/index-1";
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import baseCrollBoard from '../../components/base-croll-board';
import 'videojs-contrib-hls';
export default {
    components: {
        Xtitle,
        videoPlayer,
        baseCrollBoard
    },
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            playerOptions: {
                autoplay: true, //如果true,浏览器准备好时开始回放。
                muted: true, // 默认情况下将会消除任何音频。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [],
                poster: '', //你的封面地址
                // width: document.documentElement.clientWidth,
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: true, //当前时间和持续时间的分隔符
                    durationDisplay: true, //显示持续时间
                    remainingTimeDisplay: false, //是否显示剩余时间功能
                    fullscreenToggle: true //全屏按钮
                }
            },
            videos: [],
            isRead: true,
            showImages: []
        }
    },
    methods: {
        getVideo() {
            this.showImages = []
            this.data.forEach((item, index) => {
                this.showImages[index] = item.previewUrl ? null : (item.image || "https://cs.lawqs.com/uploads/allimg/191118/1-19111P92QU38.png")
                console.log(121)
                if (!this.showImages[index]) {
                    const player = new window.JSPlugin({
                        // 需要英文字母开头 必填
                        szId: `player-${index}`,
                        // 必填,引用H5player.min.js的js相对路径
                        szBasePath: './static/',
                        // 当容器div#play_window有固定宽高时，可不传iWidth和iHeight，窗口大小将自适应容器宽高
                        iWidth: 600,
                        iHeight: 400,
                        // 分屏播放，默认最大分屏4*4
                        iMaxSplit: 16,
                        iCurrentSplit: 1,
                        // 样式
                        oStyle: {
                            border: '#343434',
                            borderSelect: '#FFCC00',
                            background: '#000'
                        }
                    });
                    this.videos.push({
                        player,
                        index
                    })
                }

            })
            this.videos.forEach(({player, index}) => {
                const playURL = this.data[index].previewUrl.url
                player.JS_Play(playURL, { playURL, mode: 1 }).then(
                    () => { console.log('realplay success') },
                    e => { console.error(e) }
                )
            })
        },
        // getVideo() {
        //     this.showImages = []
        //     console.log(this.data)
        //     this.videos = this.data.map(item => {
        //         this.playerOptions.sources = [{
        //             type: 'application/x-mpegURL',
        //             src: item.previewUrl ? item.previewUrl.url : ''
        //         }]
        //         this.showImages.push(item.previewUrl ? null : (item.image || "https://cs.lawqs.com/uploads/allimg/191118/1-19111P92QU38.png"))
        //         return { ...this.playerOptions }
        //     })
        //     setTimeout(() => {
        //         this.isRead = true
        //     }, 1000)
        // },
    },
    watch: {
        data: {
            handler() {
                this.$nextTick(() => {
                    this.getVideo()
                })
            },
            deep: true,
            immediate: true
        }
    }
};
</script>

<style lang="scss" scoped>
.cold-storage-management {
    margin-top: 38px;

    .content {
        .box {
            height: 900px;
            overflow: hidden;

            .item {
                display: flex;
                font-size: 32px;
                padding: 40px 0;
                border-bottom: 2px solid rgba(6, 243, 253, 0.4);

                .image-box {
                    width: 384px;
                    height: 218px;
                    border: 2px solid #1982FF;
                }

                .info-warp {
                    margin-left: 10px;
                    flex: 1;

                    .title {
                        height: 80px;
                        padding-left: 68px;
                        line-height: 80px;
                        font-size: 40px;
                        font-weight: bold;
                        background: url(../../assets/image/license-management-title.png) no-repeat left bottom;
                    }

                    .info {
                        margin-top: 36px;
                        display: flex;

                        >div {
                            padding-left: 36px;
                            flex: 1;

                            .label {
                                display: flex;
                                align-items: center;
                                font-weight: bold;
                                height: 40px;
                                margin-bottom: 32px;
                                color: #06F3FD;

                                >img {
                                    margin-right: 20px;
                                }
                            }

                            .value {
                                padding-left: 10px;
                                font-size: 24px;
                                font-weight: bold;
                                font-size: 36px;
                            }
                        }
                    }
                }

            }
        }
        .video{
            width: 100%;
            height: 100%;
        }
    }

}
</style>