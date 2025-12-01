<template>
    <div class="cold-storage-management">
        <Xtitle :name="`AI场所管理`">
            <div slot="option">
                <el-select class="el-range-info-select" v-model="video" value-key="index" size="medium"
                    placeholder="请选择" @change="setVideo">
                    <el-option v-for="item in data" :key="item.index" :label="item.deviceName" :value="item">
                    </el-option>
                </el-select>
            </div>
        </Xtitle>
        <div class="content">
            <div class="box">
                <!-- <video-player v-if="isRead" class="video" ref="videoPlayer" :options="playerOptions"></video-player> -->
                <div id="player" style="width: 100%; height: 602px;"></div>
            </div>
        </div>
    </div>
</template>

<script>
import Xtitle from "../../components/Xtitle/index-1";
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import 'videojs-contrib-hls';
export default {
    components: {
        Xtitle,
        videoPlayer
    },
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            video: {},
            loading: true,
            isRead: false,
            player: null,
            // playerOptions: {
            //     autoplay: true, //如果true,浏览器准备好时开始回放。
            //     muted: true, // 默认情况下将会消除任何音频。
            //     preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
            //     language: 'zh-CN',
            //     // aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
            //     fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
            //     sources: [],
            //     poster: '', //你的封面地址
            //     // width: document.documentElement.clientWidth,
            //     notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
            //     controlBar: {
            //         timeDivider: true, //当前时间和持续时间的分隔符
            //         durationDisplay: true, //显示持续时间
            //         remainingTimeDisplay: false, //是否显示剩余时间功能
            //         fullscreenToggle: true //全屏按钮
            //     }
            // }
        }
    },
    mounted() {
        // this.initPlayer()
    },
    methods: {

        //初始化播放器
        async initPlayer() {
            this.player = new window.JSPlugin({
                // 需要英文字母开头 必填
                szId: 'player',
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
            this.video = this.data[0]
            if (this.video.previewUrl) {
                const playURL = this.video.previewUrl.url
                this.player.JS_Play(playURL, { playURL, mode: 1 }).then(
                    () => { console.log('realplay success') },
                    e => { console.error(e) }
                )
            }

        },

        getVideo() {
            if (this.data.length) {
                this.video = this.data[0]
                if (this.video.previewUrl) {
                    this.playerOptions.sources = [{
                        type: 'application/x-mpegURL',
                        src: this.video.previewUrl.url
                    }]
                    setTimeout(() => {
                        this.isRead = true
                    })
                }

            }

        },
        setVideo(e) {
            if (e.previewUrl) {
                // this.playerOptions.sources = [{
                //     type: 'application/x-mpegURL',
                //     src: e.previewUrl.url
                // }]
                // this.$refs.videoPlayer.player().load();
                // this.$refs.videoPlayer.player().play();
                const playURL = this.video.previewUrl.url
                this.player.JS_Play(playURL, { playURL, mode: 1 }).then(
                    () => { console.log('realplay success') },
                    e => { console.error(e) }
                )
            }
        },
    },
    watch: {
        data: {
            handler() {
                // this.getVideo()
               if(this.data && this.data.length){
                this.$nextTick(() =>{
                    this.initPlayer()
                })
               }
            },
            deep: true,
            immediate: true
        }
    }
};
</script>

<style lang="scss" scoped>
.cold-storage-management {
    .content {
        .box {
            height: 606px;
            border: 2px solid #1982FF;
            margin-top: 18px;

            .video {
                width: 100%;
                height: 100%;
            }
        }
    }

}
</style>