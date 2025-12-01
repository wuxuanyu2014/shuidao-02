<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" @click.native.stop="dialogClick" :width="parseFloat(width)+'px'"
    custom-class="info-dialog data-popover aa1" :close-on-click-modal="false" :show-close="true" @close="handleClose"
    ref="dataDialog" :modal="false" :append-to-body="true">
    <div class="popover_wrap s-flex-center"  :style="{...style, height: parseFloat(height) +'px',width: parseFloat(width) +'px'}">
      <!-- <svg-icon @click="handleClose" :style="closeIocnStyle" class="close" icon-class="close_popover"></svg-icon> -->
      <img  @click="handleClose" :style="closeIocnStyle" class="close"  src="../../assets/image/index/close.png" />
      <div class="">

      </div>
      <slot name="dataSlot"></slot>
    </div>
    <slot></slot>
  </el-dialog>
</template>
<script>
export default {
  name: "dataDialog",
  props: {
    title: {
      type: String,
      default: "提示"
    },
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: 100
    },
    height: {
      type: [String, Number],
      default: 100
    },
    closeIocnStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('input', val);
    }
  },
  created() {
    this.dialogVisible = this.value
  },
  computed: {
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
    dialogClick(e) {
      e.stopPropagation()
    },
    handleClose() {
      this.dialogVisible = false;
      this.$emit('close')
    }
  }

};
</script>
<style lang="scss">
.data-popover.el-dialog {
  margin-top: 0;
  height: 0;

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
  }

  .popper__arrow {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
.popover_wrap {
  position: fixed;
  width: 1300px;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
  // transform-origin: top right;
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
