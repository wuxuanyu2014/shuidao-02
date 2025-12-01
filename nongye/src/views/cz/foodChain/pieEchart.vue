<template>
  <div class="">
    <Echart :options="options" :id="'ringChart' + params.colorListIndex" height="134px" width="134px"></Echart>
    
  </div>
</template>
<script>
import Echart from '@/common/echart'
let color = ['#81E6FF', '#9F82FA', '#38CFF2', '#FAB725', '#53DC8A', '#DB7721']
let defaultColor = '#232B5E'
let colorList = [
  { defaultColor, colors: ['#0CB0F4', '#31E7E1'], icon: require('../../../assets/image/index/pie0.png') },
  { defaultColor, colors: ['#EA776E', '#FFD290'], icon: require('../../../assets/image/index/pie1.png') },
  { defaultColor, colors: ['#4D8BFA', '#30CEFA'], icon: require('../../../assets/image/index/pie2.png') },
]
export default {
  name: '',
  components: {
    Echart
  },
  props: {
    params:  {
      type: Object,
      default: () => ({})
    },
  },
  watch: {
    'params.seriesData'() {
      this.options = this.getOptions(this.resetSeriesData())
    }
  },
  computed: {
    
  },
  data () {
    return {
      options: {}
    }
  },
  mounted () {
    this.options = this.getOptions(this.resetSeriesData())
  },
  methods: {
    resetSeriesData() {
      let seriesData = this.params.seriesData
      if(!seriesData.length)return
      return [
        {
          value: seriesData[0],
          name: this.params.title,
          itemStyle: {
            color: colorList[this.params.colorListIndex].colors[0],
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colorList[this.params.colorListIndex].colors[0] },
                { offset: 1, color: colorList[this.params.colorListIndex].colors[1] },
              ])
            }
          }
        },
        {
          value: seriesData[1],
          name: '',
          itemStyle: {
            color: defaultColor
          }
        },
      ]
    },
    // 获取echart的options
    getOptions(data = [], seriesLabelShow = true) {
      console.log(seriesLabelShow,'seriesLabelShow');
      return {
        tooltip: {
          trigger: 'item'
        },
        graphic: { // 这个属性可以在饼图内部填充图片,文字等
          elements: [{
            type: 'image',//需要填充图片,配置image,如果不需要图片可以配置其他的, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group,
            style: {
              lineWidth: 0,
              image: colorList[this.params.colorListIndex].icon, //这里添加图片地址
              width: 23,
              height: 20
            },
            left: 'center',//
            top: 'middle' //配置图片居中
          }]
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['60%', '82%'],
            clockWise: false,
            silent: true, // 取消hover效果
            hoverAnimation: false, // 取消hover动画
            avoidLabelOverlap: false,
            minAngle: 1,
            label: {
              show: false,
              position: 'center',
              formatter() {
                // return `{b|${total}}{bblock|}\n{a|${obj.categoryName}}{ablock|}`
              },
              width: 100,
              height: 70,
              borderRadius: 50,
              backgroundColor: 'transparent',
              verticalAlign: 'middle',
              padding: [39, 0, 0, 0],
              rich: {
                a: {
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: 500
                },
                ablock: {
                  padding: [10, 0, 40, 0]
                },
                b: {
                  color: '#33C7FA',
                  fontSize: 37,
                  fontWeight: 500
                },
                bblock: {
                  height: 40
                },
              }
            },
            // 分割
            itemStyle: {
              // borderRadius: 20,
              // borderColor: '#fff',
              // borderWidth: 2
            },
            emphasis: {
              label: {
                show: false,
                formatter(params) {
                  return `{b|${params.percent + '%'}}{bblock|}\n{a|${params.name}}{ablock|}`
                  // return `{b|${params.value}}{bblock|}\n{a|${params.name}}{ablock|}`
                },
                width: 100,
              height: 70,
              borderRadius: 50,
                backgroundColor: 'transparent',
                verticalAlign: 'middle',
                padding: [30, 0, 0, 0],
                rich: {
                  a: {
                    color: '#fff',
                    fontSize: 20,
                    fontWeight: 500
                  },
                  ablock: {
                    padding: [10, 0, 40, 0]
                  },
                  b: {
                    fontSize: 37,
                    fontWeight: 500
                  },
                  bblock: {
                    height: 40
                  },
                }
              }
            },
            color,
            data
          },
          {
            name: '外边框',
            type: 'pie',
            avoidLabelOverlap: false,
            labelLine: {
              show: false,
            },
            clockWise: false,
            silent: true, // 取消hover效果
            hoverAnimation: false, // 取消hover动画
            radius: ['85%', '85%'],//边框大小
            center: ['50%', '50%'],//边框位置
            data: [{
              value: 0,
              itemStyle: {
                normal: {
                  borderWidth: 4,//设置边框粗细
                  borderColor: '#22274E'//边框颜色
                }
              }
            }]
          },
          {
            name: '内边框',
            type: 'pie',
            avoidLabelOverlap: false,
            labelLine: {
              show: false,
            },
            clockWise: false,
            silent: true, // 取消hover效果
            hoverAnimation: false, // 取消hover动画
            radius: ['60%', '60%'],//边框大小
            center: ['50%', '50%'],//边框位置
            data: [{
              value: 0,
              itemStyle: {
                normal: {
                  borderWidth: 6,//设置边框粗细
                  borderColor: '#22274E'//边框颜色
                }
              }
            }]
          },
        ]
      }
    },
  }
}
</script>
<style scoped lang="scss">
</style>
