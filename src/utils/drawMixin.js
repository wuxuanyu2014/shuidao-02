// 屏幕适配 mixin 函数
import dayjs from 'dayjs';
// * 默认缩放值
const scale = {
  width: '1',
  height: '1',
}

// * 设计稿尺寸（px）
const baseWidth = 3840
const baseHeight = 2160

// * 需保持的比例（默认1.77778）
// const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5))
const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5))

export default {
  data() {
    return {
      // * 定时函数
      drawTiming: null,
      dayTime: '',
      setTimeOut: null,
    }
  },
  mounted() {
    this.calcRate()
    this.getTime()
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
    clearTimeout(this.setTimeOut)
  },
  methods: {
    getTime() {
      this.dayTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      setTimeout(() => {
        this.getTime()
      }, 1000)
    },
    calcRate() {
      const appRef = this.$refs["appRef"]
      if (!appRef) return
      // 当前宽高比
      const currentRate = parseFloat((window.innerWidth / window.innerHeight).toFixed(5))
      if (appRef) {
        if (currentRate > baseProportion) {
          // 表示更宽
          scale.width = ((window.innerHeight * baseProportion) / baseWidth).toFixed(5)
          scale.height = (window.innerHeight / baseHeight).toFixed(5)

        } else {
          // 表示更高
          scale.height = ((window.innerWidth / baseProportion) / baseHeight).toFixed(5)
          scale.width = (window.innerWidth / baseWidth).toFixed(5)
        }

        // document.body.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
        appRef.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
        this.$store.commit('scaleChange', scale)
      }
    },
    resize() {
      clearTimeout(this.drawTiming)
      this.drawTiming = setTimeout(() => {
        this.calcRate()
      }, 200)
    }
  },
}