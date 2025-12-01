<template>
    <div id="container" class="bm-view"></div>
</template>
<script>
export default {
    props: {
        data: {
            type: Object,
            default: () => ({
                licensePlate: '',
                showInfo: false,
                coldStorage: {},
                point: [],
            })
        }
    },
    data() {
        return {

        }
    },
    methods: {
        initMap() {
            const { BMapGL } = window
            // eslint-disable-next-line no-undef
            this.map = new BMapGL.Map('container');
            this.map.enableScrollWheelZoom(true);
           
            
            this.map.setMapStyleV2({
                styleId: '7d3910e7f98332c5ed9ad938353da5ad',
            });
            if (this.data.showInfo) {
                this.setInfo()
            }else{
                this.point = new BMapGL.Point(this.data.point[0], this.data.point[1]);
                this.map.centerAndZoom(this.point, 15);
            }
        },
        setInfo() {
            const { BMapGL } = window
            const icon = require('../../assets/image/info/marker.png')
            this.point = new BMapGL.Point(this.data.point[0], this.data.point[1]);
            var myIcon = new BMapGL.Icon(icon, new BMapGL.Size(19, 19));
            var marker = new BMapGL.Marker(this.point, {
                icon: myIcon
            });
            this.map.addOverlay(marker);
            const {coldStorage} = this.data
            const temperature = coldStorage ? ( coldStorage.status >= 0 ? coldStorage.temperature + '℃' : '-')  : '-'
            const humidity = coldStorage ? ( coldStorage.status >= 0 ? coldStorage.humidity + "%RH" : '-' ) : '-'
            const title = `<div class="el-other-info-title"><div>${this.data.licensePlate}</div><div>${this.data.carType}</div></div>`
            var content = `<div class="el-other-info-content"><div class="temperature"><div class="label">温度</div><div>${temperature}</div></div><div class="humidity"><div class="label">湿度</div><div>${humidity}</div></div></div>`;
            var opts = {
                width: 314,     // 信息窗口宽度
                height: 75,     // 信息窗口高度
                title, // 信息窗口标题
                message: "这里是故宫"
            }

            var infoWindow = new BMapGL.InfoWindow(content, opts);  // 创建信息窗口对象 
            this.map.openInfoWindow(infoWindow, this.point); //开启信息窗口
            this.map.centerAndZoom(this.point, 15);
        }
    },
    watch: {
        'window.BMapGL': {
            handler() {
                this.$nextTick(() => {
                    if (this.data.point.length) {
                        this.initMap()
                    }
                })
            },
            deep: true,
            immediate: true
        },
        data: {
            handler() {
                this.$nextTick(() => {
                    if (window.BMapGL) {
                        if (this.map) {
                            this.setInfo()
                        } else {
                            this.initMap()
                        }
                    }
                })
            },
            deep: true
        }
    }
}
</script>

<style lang="scss" scoped>
.bm-view {
    width: 100vw;
    height: 100vh;
}
</style>
