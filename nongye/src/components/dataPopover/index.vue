<template>
  <el-popover ref="dataPopover" :placement="placement" :width="parseFloat(width)" trigger="click" popper-class="data-popover aa1"
    :popper-options="popperOptions">
    <div class="popover_wrap" :style="style">
      <!-- <svg-icon @click="close" :style="closeIocnStyle" class="close" icon-class="close_popover"></svg-icon> -->
      <img  @click="close" :style="closeIocnStyle" class="close"  src="../../assets/image/index/close.png" />
      <slot name="dataSlot"></slot>
    </div>
    <div slot="reference">
      <slot name="btnSlot"></slot>
    </div>
  </el-popover>
</template>
<script>
export default {
  name: "dataPopover",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    refName: {
      type: String,
      default: "dataPopover"
    },
    popperClass: {
      type: String,
      default: ""
    },
    placement: {
      type: String,
      default: "bottom"
    },
    width: {
      type: [String, Number],
      default: 500
    },
    closeIocnStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      popperOptions: { boundariesElement: "body", gpuAcceleration: false }
    };
  },
  computed: {
    popoverVisible: {
      get() {
        console.log(this.visible, "this.visible");
        return this.visible;
      },
      set(val) {
        return val;
      }
    },
    scale() {
      return this.$store.state.scale;
    },
    style() {
      // return {}\
      console.log(this.width, "width");
      let translate = `translate(-50%, -50%)`;
      translate = "";
      let scale = `scale(${this.scale.width}, ${this.scale.height})`;
      return {
        transform: `${scale} ${translate}`
      };
    }
  },
  methods: {
    close() {
      this.$emit("close");
      this.popoverVisible = false;
      this.$refs["dataPopover"].doClose();
    }
  }
};
</script>
<style lang="scss">
.data-popover.el-popover {
  background: none;
  border: none;

  .popper__arrow {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
.popover_wrap {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  transform-origin: top right;
  background: #011623;
  border: 2px solid #0498fc;
  box-shadow: -7px 11px 27px 0px rgba(0, 121, 186, 0.59),
    7px -11px 27px 0px rgba(0, 121, 186, 0.59);
  padding: 8px;
  min-height: 160px;
  overflow: hidden;
  background-color: #011623;
  background: #011623;

  .close {
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
