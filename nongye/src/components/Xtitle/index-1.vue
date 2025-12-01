<template>
  <div>
    <div class="d-flex title s-flex-start">
      <div>
        <div class="title-name">{{ name }}</div>
        <span class="title-other" v-if="other != ''">{{ other }}</span>
      </div>
      <slot name="option"></slot>
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
  height: 112px;
  background: url("../../assets/image/table2.png") no-repeat center;
  background-size: 100% 100%;
  padding-left: 88px;
  padding-right: 88px;
  justify-content: space-between ;
}

.title-name {
  height: 100%;
  line-height: 112px;
  font-weight: bold;
  margin-right: 27px;
  color: #a2d9ff;
  font-size: 48px;
}

.title-other {
  font-size: 22px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #FABE88;
}
</style>
