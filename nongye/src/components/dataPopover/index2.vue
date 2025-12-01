<template>
    <div
      :ref="refName"
      :style="{width: width}"
      :class="['data-popover', {'data-popover--visible': visible}]"
      
    >
      <div class="data-popover_wrap" :style="style">
        <svg-icon @click="close" :style="closeIocnStyle" class="close" icon-class="close_popover"></svg-icon>
        <slot name="dataSlot" class="data-popover--data">啊分身乏术</slot>
      </div>
      <div slot="reference"><slot name="btnSlot"></slot></div>
    </div>
  </template>
  <script>
  export default {
    name: 'dataPopover',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      refName: {
        type: String,
        default: "dataPopover",
      },
      popperClass: {
        type: String,
        default: "",
      },
      placement: {
        type: String,
        default: "bottom",
      },
      width: {
        type: [Number, String],
        default: 100,
      },
      closeIocnStyle: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        popperOptions: { boundariesElement: 'body', gpuAcceleration: false }
      };
    },
    computed: {
      popoverVisible: {
        get() {
          console.log(this.visible,'this.visible')
          return this.visible
        },
        set(val) {
          return val
        }
      },
      scale() {
        return this.$store.state.scale
      },
      style() {
        return {}
        // return {
        //   transform: `scale(${this.scale.width}, ${this.scale.height}) translate(-50%, -50%)`
        // }
      },
    },
    methods: {
      close() {
        this.$emit('close')
        this.popoverVisible = false
        this.$refs.popoverRef.doClose()
      },
    },
  };
  </script>
  <style lang="scss">
</style>
<style lang="scss" scoped>
  .data-popover {
    
    background: #011623;
    border: 2px solid #0498fc;
    box-shadow: -7px 11px 27px 0px rgba(0, 121, 186, 0.59),
      7px -11px 27px 0px rgba(0, 121, 186, 0.59);
      padding: 8px;
    &--visible .data-popover--data{
      display: block;
    }
  }
  .data-popover--data{
    display: none;
  }
  .data-popover_wrap{
    min-height: 160px;
    background-color: #011623;
    background: #011623;
    .close{
      position: absolute;
      top: 18px;
      right: 15px;
      width: 35px;
      height: 35px;
      z-index: 1;
      cursor: pointer;
    }
  }
  </style>
  