<template>
  <div>
    <div class="d-flex title s-flex-start">
      <div class="title-name">{{name}}</div>
      <span class="title-other" v-if="other!= ''">{{other}}</span>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    other: {
      type: String,
      default: ''
    }

  },

};
</script>
<style lang="scss" scoped>
.title {
  width: 100%;
  height: 55px;
  background: url("../../assets/image/table1.png") no-repeat center;
  background-size: 100% 55px;
  padding-left: 44px;
}

.title-name {
  height: 100%;
  line-height: 55px;
  font-weight: bold;
  margin-right: 27px;
  color: #a2d9ff;
  font-size: 24px;
}

.title-other {
  font-size: 22px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #FABE88;
}
</style>
