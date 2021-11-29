<template>
  <div>
    <el-tooltip 
      class="sw-title-tooltip" 
      :content="title" 
      placement="top-start" 
      effect="light">
      <span class="sw-title">{{title}}</span>
    </el-tooltip>
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'SwTitle',
  props: {
    title: {
      type: String,
      default: ''
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
  .sw-title{
    vertical-align: top;
    display: inline-block;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    max-width: 100%;


     /* display: -webkit-box;
    white-space: nowrap;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden; */
  }
</style>
