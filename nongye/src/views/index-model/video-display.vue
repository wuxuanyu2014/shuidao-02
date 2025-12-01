<template>
    <div>
        <div class="video-display">
            <base-title>
                <img slot="title" src="@/assets/image/index/video-display.png" alt="">
            </base-title>
            <div class="video-container">
                <video 
                    :src="videoSrc || defaultVideoSrc" 
                    controls 
                    :poster="videoPoster || defaultVideoPoster"
                    preload="none"
                    width="100%" 
                    height="100%"
                >
                    您的浏览器不支持视频播放。
                </video>
            </div>
        </div>
    </div>
</template>
<script>
import BaseTitle from "@/components/base-title.vue";
import { getShopInfo } from "@/api/cockpit.js";

export default {
    name: "videoDisplay",
    components: {
        BaseTitle
    },
    data() {
        return {
            videoSrc: '',
            videoPoster: '',
            defaultVideoSrc: '', // 默认视频地址
            defaultVideoPoster: '', // 默认视频封面
            videoVisible: true,
            videoUrl: ''
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            // 首先从localStorage获取数据
            this.loadFromLocalStorage();
            
            // 然后尝试从接口获取最新数据
            await this.fetchVideoDisplayData();
        },
        
        // 从localStorage加载数据
        loadFromLocalStorage() {
            const videoSrc = localStorage.getItem('videoSrc');
            const videoPoster = localStorage.getItem('videoPoster');
            
            if (videoSrc) {
                this.videoSrc = videoSrc;
            }
            if (videoPoster) {
                this.videoPoster = videoPoster;
            }
        },
        
        // 从接口获取数据
        async fetchVideoDisplayData() {
            try {
                const response = await getShopInfo();
                const resData = response.data.data;
                if (resData && resData['video-display']) {
                    const videoData = resData['video-display'];
                    this.videoVisible = videoData.videoVisible !== undefined ? videoData.videoVisible : true;
                    this.videoUrl = videoData.videoUrl || this.videoUrl;
                    localStorage.setItem('video-display', JSON.stringify(videoData));
                    console.log('视频显示数据更新成功:', videoData);
                }
            } catch (error) {
                // 接口失败时兜底读取localStorage
                const cachedData = localStorage.getItem('video-display');
                if (cachedData) {
                    try {
                        const data = JSON.parse(cachedData);
                        this.videoVisible = data.videoVisible !== undefined ? data.videoVisible : true;
                        this.videoUrl = data.videoUrl || this.videoUrl;
                    } catch (e) {
                        console.error('解析视频显示数据失败:', e);
                    }
                }
                console.error('获取视频显示数据失败:', error);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.video-display {
    .video-container {
        width: 100%;
        height: 430px;
        padding: 18px 32px 0;
        
        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
        }
    }
}
</style> 