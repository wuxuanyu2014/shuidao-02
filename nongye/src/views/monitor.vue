<template>
  <div id="index" ref="appRef" style="background: rgba(14, 30, 54, 1);">
    <div>
      <div>
        <dv-loading v-if="loading">Loading...</dv-loading>
        <div v-else class="host-body">
          <div class="top-bg">
            <img src="../assets/image/index/title.png" alt="">
            <div class="date-time">{{ dayTime }}</div>
            <div class="go-home" @click="goHome">返回首页</div>
          </div>
          <div class="body-box-1">
            <div class="sidebar">
              <div class="camera-list">
                <div class="camera-item" v-for="(item, index) in videos" :key="index"
                  :class="{ active: currentCamera === index }" @click="selectCamera(index)">
                  <div class="camera-icon">
                    <img src="../assets/image/camera.png" alt="" width="64" />
                  </div>
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </div>
            <div class="main-content">
              <div class="video-container">
                <div v-if="currentCamera !== null && currentCamera >= 0" class="video-wrapper">
                  <video-player class="vjs-default-skin" :options="currentPlayerOptions" :key="currentVideoUrl" />
                </div>
                <div v-else class="placeholder">
                  <div class="placeholder-text">请选择摄像头</div>
                </div>
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
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import 'videojs-contrib-hls'

export default {
  mixins: [drawMixin],
  data() {
    return {
      loading: true,
      currentTab: 'monitor',
      currentCamera: 0, // 默认激活第一个摄像头
      videos: [
        { url: 'https://open.ys7.com/v3/openlive/FS1433536_1_2.m3u8?expire=1786340075&id=876458859781017600&t=45ace00eeee7210430223eee03d2a52ee6dfdc432392ff2f88f472cd439bbe9e&ev=100', name: '摄像头1' },
        { url: 'https://open.ys7.com/v3/openlive/FS1433536_2_2.m3u8?expire=1786340149&id=876459166117507072&t=c8f347257052511192ebdd15c64b04e0abddc49d63a4bc4094b4fbefe772f4b6&ev=100', name: '摄像头2' },
        { url: 'https://open.ys7.com/v3/openlive/FS1433536_3_2.m3u8?expire=1786340179&id=876459293593833472&t=b0476241eb0b744f697df5b833f725c1fe798193320d2175a22a75ecc5e41a09&ev=100', name: '摄像头3' },
        { url: 'https://open.ys7.com/v3/openlive/FS1433536_4_2.m3u8?expire=1786340201&id=876459384438259712&t=b4ea48c315af2b43a9328956ee5171fadae6805c80a1635b14cd6f33e0d27116&ev=100', name: '摄像头4' },
        { url: 'https://open.ys7.com/v3/openlive/FS1433536_5_2.m3u8?expire=1786340223&id=876459477585170432&t=2d59652e87b619adb637346719be556f8026b5c5b05338dc95d6bf7afd038a35&ev=100', name: '摄像头5' },
        { url: 'https://open.ys7.com/v3/openlive/FS1433536_6_2.m3u8?expire=1786340242&id=876459558151225344&t=574d311ad9f8c8a605c31575c42e4a8def897b9ea33e02b3360321e5b5f1ffc1&ev=100', name: '摄像头6' },
        { url: 'https://open.ys7.com/v3/openlive/FS1433536_7_2.m3u8?expire=1786340261&id=876459635974864896&t=6380ba9da4b4fb415fbfc46107edcdfd3fcc0916f831842af184845c7ac09baa&ev=100', name: '摄像头7' },
        { url: 'https://open.ys7.com/v3/openlive/FS1433536_8_2.m3u8?expire=1786340278&id=876459707819102208&t=4910421f6c6cec030992344dea2e748c67800e5b0285631fbc8a04ae5075463f&ev=100', name: '摄像头8' },
        { url: 'https://open.ys7.com/v3/openlive/FS1433536_9_2.m3u8?expire=1786340299&id=876459796234883072&t=f8002cc847fa67d93118a6fc369570361995e1432f9c3961ffc6c17a0edbb29a&ev=100', name: '摄像头9' },
        { url: 'https://open.ys7.com/v3/openlive/FS1433536_10_2.m3u8?expire=1786340324&id=876459900442513408&t=cb2f11748d9c47ceb5a7532164ade9dea8a0bbbc905759e56d345b7a236084cf&ev=100', name: '摄像头10' },
        { url: 'https://open.ys7.com/v3/openlive/FS1433536_11_2.m3u8?expire=1786340343&id=876459982843805696&t=b5dd59b576e47e7605d44fa0f4f8f8e1a351e7298e089bee8d5d9b3e9579fe4e&ev=100', name: '摄像头11' },
        { url: 'https://open.ys7.com/v3/openlive/FS1433536_12_2.m3u8?expire=1786340378&id=876460129716908032&t=0898b042a49528f1c9b8c67fe8710da90eaed7898042d1798b80044716040468&ev=100', name: '摄像头12' },
        { url: 'https://open.ys7.com/v3/openlive/FS1433536_13_2.m3u8?expire=1786340398&id=876460212567506944&t=88b084932e3b2b87c7fe442fa4cc05ff74cc6da0f26570faaa85591c85cf55ef&ev=100', name: '摄像头13' }
      ]
    };
  },
  components: {
    videoPlayer
  },
  computed: {
    currentVideoUrl() {
      return this.currentCamera !== null ? this.videos[this.currentCamera].url : '';
    },
    currentPlayerOptions() {
      if (this.currentCamera === null || this.currentCamera < 0) return {};

      return {
        autoplay: true,
        muted: true,
        controls: true,
        preload: 'auto',
        language: 'zh-CN',
        fluid: true,
        aspectRatio: '16:9',
        poster: '', // 移除默认海报
        responsive: true,
        sources: [
          {
            type: 'application/x-mpegURL',
            src: this.currentVideoUrl
          }
        ],
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true,
          volumePanel: {
            inline: false
          }
        },
        html5: {
          hls: {
            enableLowInitialPlaylist: true,
            smoothQualityChange: true,
            overrideNative: true
          }
        }
      };
    }
  },
  mounted() {
    this.cancelLoading();
    // 确保第一个摄像头被选中
    if (this.videos.length > 0) {
      this.currentCamera = 0;
    }
  },
  methods: {
    cancelLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    selectCamera(index) {
      this.currentCamera = index;
    },
    goHome() {
      this.$router.push('/');
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/index.scss";

.top-bg {
  position: relative;
  background: url("../assets/image/index/top-bg.png") no-repeat;
  background-position: center 0px;
  background-size: 3292px 260px;
  height: 200px;
  width: 100%;
  text-align: center;

  .date-time {
    position: absolute;
    left: 80px;
    top: 86px;
    font-size: 32px;
    color: #C4E5FE;
  }

  .go-home {
    position: absolute;
    right: 200px;
    top: 86px;
    font-size: 40px;
    font-weight: bold;
    color: #C4E5FE;
    cursor: pointer;
  }

  .title {
    font-size: 32px;
    color: #FFFFFF;
    font-weight: bold;
    text-align: center;
    flex: 1;
  }

  .nav-tabs {
    display: flex;
    gap: 20px;

    .tab {
      padding: 12px 24px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #C4E5FE;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 16px;
      font-weight: 500;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #FFFFFF;
      }

      &.active {
        background: rgba(36, 186, 255, 0.8);
        color: #FFFFFF;
        box-shadow: 0 4px 15px rgba(36, 186, 255, 0.3);
      }
    }
  }
}

.body-box-1 {
  display: flex;
  position: relative;
  width: 3674px !important;
  height: 1776px;
  padding: 40px 0;
  background: url("../assets/image/monitor-bg.png") no-repeat;
  background-size: 100% 100%;
  margin: 80px auto 0;
  box-sizing: border-box;

}

.sidebar {
  width: 716px;
  box-sizing: border-box;
  padding-left: 72px;
  overflow-y: auto;

  .camera-list {
    .camera-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 104px;
      cursor: pointer;
      background: url("../assets/image/monitor-item-no.png") no-repeat;
      background-size: cover;
      margin-bottom: 10px;

      &:hover {
        background: url("../assets/image/monitor-item-selected.png") no-repeat;
        background-size: cover;
        transform: translateX(5px);
      }

      &.active {
        background: url("../assets/image/monitor-item-selected.png") no-repeat;
        background-size: cover;
        transform: translateX(5px);
      }

      .camera-icon {
        position: absolute;
        left: 48px;
        top: 50%;
        transform: translateY(-50%);
        color: #24BAFF;
      }

      span {
        color: #C4E5FE;
        font-size: 48px;

        font-weight: 500;
      }

      &.active span {
        color: #FFFFFF;
        font-weight: 600;
      }
    }
  }
}

.main-content {
  flex: 1;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;

  .video-container {
    width: 100%;
    height: 100%;
    // background: rgba(0, 0, 0, 0.4);
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url("../assets/image/video-bg.png") no-repeat;
    background-size: 100% 100%;

    .video-wrapper {
      width: 100% !important;
      height: 100% !important;
      position: relative;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 8px;
      border: 1px solid rgba(36, 186, 255, 0.5);
      box-shadow: 0 0 20px rgba(36, 186, 255, 0.3);

      ::v-deep .video-js {
        width: 100% !important;
        height: 100% !important;
        background: #000 !important;
        border-radius: 8px;
      }

      ::v-deep .vjs-poster {
        background: #000 !important;
      }

      ::v-deep .vjs-loading-spinner {
        border-color: rgba(36, 186, 255, 0.8) transparent transparent transparent !important;
      }

      ::v-deep .vjs-control-bar {
        background: rgba(0, 0, 0, 0.7) !important;
      }
    }

    .placeholder {
      width: 80%;
      height: 70%;
      max-width: 1000px;
      max-height: 600px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 8px;
      border: 1px solid rgba(36, 186, 255, 0.5);
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80px;
        height: 80px;
        border: 2px solid rgba(36, 186, 255, 0.3);
        border-radius: 50%;
        border-top-color: rgba(36, 186, 255, 0.8);
        animation: spin 2s linear infinite;
      }

      .placeholder-text {
        font-size: 24px;
        color: #C4E5FE;
        font-weight: 500;
        text-align: center;
        opacity: 0.8;
        z-index: 1;
        position: relative;
      }
    }
  }

  @keyframes spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
}

// 滚动条样式
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(36, 186, 255, 0.5);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(36, 186, 255, 0.8);
}
</style>
