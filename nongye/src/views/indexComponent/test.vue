<template>
  <div id="centerRight1">
    <div class="bg-color-black">

      <dv-scroll-board :config="config5" style="width:100%;height:200px" />
    </div>
  </div>
</template>

<script>


export default {
  components: {

  },
  data() {
    return {

      config5: {
        // header: ["组件", "分支", "覆盖率"],
        data: [['行1列1', '行1列2', '行1列3', '行1列3'],
        ['行2列1', '行2列2', '行2列3', '行1列3'],
        ['行3列1', '行3列2', '行3列3', '行1列3'],
        ],
        list: [],
        rowNum: 2, //表格行数
        index: false,
        headerHeight: 44,
        columnWidth: [50],
        align: ["left"],

      },

    };
  },
  created() { },
  async mounted() {
    //  await this.getShop();

    // this.timer = setInterval(() => {
    //   this.getShop();
    // }, 5000)
  },
  methods: {

  },
  destroyed() {

  }
};
</script>
<style lang="scss">

</style>
<style lang="scss" scoped>
$box-height: 810px;
$box-width: 960px;

#centerRight1 {
  width: 100% !important;
  height: 100% !important;

}
</style>
