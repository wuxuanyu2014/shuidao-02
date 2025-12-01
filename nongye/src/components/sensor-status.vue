<!--
 * @Description: 传感器状态显示组件
 * @Author: AI Assistant
 * @Date: 2024-01-01
-->
<template>
    <div class="sensor-status" style="display:none;">
        <div class="sensor-item">
            <div class="sensor-label">设备状态</div>
            <div class="sensor-value" :class="{ 'online': isOnline, 'offline': !isOnline }">
                {{ isOnline ? '在线' : '离线' }}
            </div>
        </div>
        <div class="sensor-item">
            <div class="sensor-label">传感器数量</div>
            <div class="sensor-value">{{ totalSensors }}</div>
        </div>
        <div class="sensor-item">
            <div class="sensor-label">电池电压</div>
            <div class="sensor-value">{{ batteryVoltage }}V</div>
        </div>
        <div class="sensor-item">
            <div class="sensor-label">最后更新</div>
            <div class="sensor-value small">{{ lastUpdateTime }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SensorStatus",
    props: {
        isOnline: {
            type: Boolean,
            default: true
        },
        totalSensors: {
            type: Number,
            default: 0
        },
        batteryVoltage: {
            type: Number,
            default: 0
        },
        lastUpdateTime: {
            type: String,
            default: ''
        }
    }
};
</script>

<style lang="scss" scoped>
.sensor-status {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    background: rgba(30, 60, 100, 0.8);
    border-radius: 10px;
    border: 2px solid rgba(70, 174, 234, 0.3);

    .sensor-item {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .sensor-label {
            font-size: 18px;
            color: #C9EBFF;
        }

        .sensor-value {
            font-size: 20px;
            font-weight: bold;
            color: #FFFFFF;

            &.online {
                color: #00FF88;
            }

            &.offline {
                color: #FF4444;
            }

            &.small {
                font-size: 16px;
                font-weight: normal;
                color: #8BC7FF;
            }
        }
    }
}
</style> 