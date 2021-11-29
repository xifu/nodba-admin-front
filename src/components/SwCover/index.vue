<template>
  <el-popover
    placement="right-start"
    trigger="hover"
    :open-delay="500"
    transition="fade-in-linear"
    >
    <el-image
      style="max-width:300px"
      :src="src"
    ></el-image>
    <el-image
      slot="reference"
      :style="coverSize"
      :src="src"
      :fit="fit"
    ></el-image>
  </el-popover>
</template>

<script>
export default {
  name: 'SwCover',
  props: {
    size: {
      type: Array,
      default: () =>[36]
    },
    fit: {
      type: String,
      default: 'contain'
    },
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      
    }
  },
  computed: {
    // 获取图片尺寸
    coverSize: function() {
      if(this.size.length==1){
        return 'width:' + this.size[0] + 'px; height:'+ this.size[0] + 'px'
      }else{
        return 'width:' + this.size[0] + 'px; height:'+ this.size[1] + 'px'
      }
    }
  },
}
</script>

<style lang="scss" scoped>
  .el-image{
      vertical-align: top;
      border-radius: 2px;
    }
</style>
