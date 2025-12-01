<template>
    <div class="license-management">
        <Xtitle name="证照管理" />
        <div class="license-management-content">
            <div class="box">
                <div class="license-management-title">营业执照</div>
                <el-image class="licenceUrl" :src="data.licenceUrl" :preview-src-list="[data.licenceUrl]">
                </el-image>
            </div>
            <div class="box">
                <div class="license-management-title">食品经营许可证</div>
                <el-image class="licenceUrl" :src="data.foodUrl" :preview-src-list="[data.foodUrl]">
                </el-image>
            </div>
        </div>
    </div>
</template>

<script>
import Xtitle from "../../components/Xtitle/index-1";
export default {
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            loading: true,
        };
    },
    components: {
        Xtitle
    },
};
</script>

<style lang="scss" scoped>
.license-management {
    .license-management-content {
        display: flex;
        justify-content: space-between;
        height: 413px;
        padding: 32px 86px;
        margin-top: 20px;
        background: rgba(24, 77, 131, 0.9);
        border: 2px solid #30C6FE;
    }

    .license-management-title {
        margin-bottom: 32px;
        height: 56px;
        padding-left: 70px;
        font-size: 40px;
        font-weight: bold;
        background: url(../../assets/image/license-management-title.png) no-repeat;
    }

    .box {
        width: 388px;
    }

    .licenceUrl {
        width: 100%;
        height: 250px;
    }
}
</style>