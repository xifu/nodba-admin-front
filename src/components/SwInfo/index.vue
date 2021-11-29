<template>
  <div class="info-box">
    <slot name="left"/>
    <div class="right" :style="{ marginLeft: gutter + 'px' }">
      <slot name="right"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sw-info',
  props: {
    gutter: {
      type: Number,
      default: 8
    }
  },
  data() {
    return {
      
    }
  },
  mounted(){
  
  }
}
</script>

<style lang="scss" scoped>
  .info-box{
    display: flex;
    .right{
      flex: 1;
      width: 0;
    }
  }
</style>
