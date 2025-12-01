<!--
 * @Author: huangl
 * @Date: 2022-09-18 19:40:01
 * @LastEditors: huangl
 * @LastEditTime: 2022-09-18 20:23:08
 * @Description: file content
 * @FilePath: \money-datav\vue-dataV\src\views\cz\venuePersonnelhealth\components\carGPS.vue
-->
<template lang="">
  <div class="ztable">
    <div class="ztable-header d-flex">
      车辆轨迹
    </div>
    <div class="GPS-picker">
      <el-date-picker v-model="value1" type="date" placeholder="选择日期">
      </el-date-picker>
      <el-time-picker
        is-range
        v-model="value2"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围"
      >
      </el-time-picker>
      <el-button class="sumbit-primary">更新</el-button>
    </div>

    <div class="">
      <img
        style="width:100%;height:400px"
        src="../../../../assets/image/index/baiduImg.png"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value1: "",
      value2: ""
    };
  }
};
</script>
<style lang="scss">
//
.el-input__prefix {
  color: #36f6ff !important;
  font-size: 18px;
}
.el-input--prefix .el-input__inner {
  border: 1px solid #30c6fe !important;
  height: 50px;
  padding-left: 70px;
  border-radius: 0;
  background: #184d83 !important;
  color: #36f6ff;
  &::placeholder {
    color: #36f6ff;
  }
}

//
.el-range-editor.el-input__inner {
  position: absolute;
  left: 230px;
  top: 0px;
  height: 50px;
  border: 1px solid #30c6fe;
  border-radius: 0;
  background: #184d83;
}
.el-date-editor .el-range__icon {
  color: #36f6ff;
  padding: 0;
  font-size: 18px;
}
.el-range-editor .el-range-input {
  background: #184d83;
  color: #07c6ff;
  &::placeholder {
    color: #36f6ff;
  }
}
.el-date-editor .el-range-separator {
  color: #07c6ff;
  padding: 0;
  line-height: revert;
}
.sumbit-primary {
  margin-left: 370px;
  width: 101px;
  border-radius: 0;
  height: 50px;
  background: linear-gradient(-13deg, #01a7fc, #07fffd);
  border: 1px solid #30c6fe;
  font-size: 16px;
  color: #011623;
  &:hover {
    color: #011623;
    background: linear-gradient(-13deg, #01a7fc, #07fffd);
    border: 1px solid #30c6fe;
  }
}
</style>
<style lang="scss" scoped>
@import "@/assets/scss/ztable.scss";

.GPS-picker {
  position: relative;
  width: 100%;
  height: 50px;
  margin: 8px 0;
}

.ztable-header {
  color: #02bcfc;
  font-size: 22px;
  line-height: 55px;
  padding-left: 50px;
}
</style>
