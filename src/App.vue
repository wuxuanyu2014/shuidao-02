<!--
 * @Author: huangl
 * @Date: 2022-09-13 20:10:31
 * @LastEditors: huangl
 * @LastEditTime: 2022-09-13 20:45:27
 * @Description: file content
 * @FilePath: \money-datav\vue-dataV\src\App.vue
-->
<!-- :class="{'grey': env}" -->
<template>
  <div id="app" >
    <router-view />
  </div>
</template>
<script>
export default{
  data() {
    return {
      env: process.env.NODE_ENV === 'development'
    }
  }
}
</script>
<style lang="scss" scoped>
#app {
  width: 100vw;
  height: 100vh;
  background-color: #000000;
  overflow: hidden;
}

</style>
