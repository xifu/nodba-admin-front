<template>
  <div id="tags-view-container" ref='tagsView'  class="tags-view-container">
    <!-- <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
        <router-link
          v-for="(tag,index) in visitedViews"
          ref="tag"
          :key="tag.path"
          :class="isActive(tag)?'active':''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="span"
          class="tags-view-item"
          @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
          @contextmenu.prevent.native="openMenu(tag,$event)"
        >
          {{ tag.title }}
          <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(index,tag)" />
        </router-link>
    </scroll-pane> -->

    <div class="tags-view-wrapper" >
        <router-link
          v-for="(tag,index) in visitedViews"
          ref="tag"
          :key="tag.path"
          :class="isActive(tag)?'active':''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="span"
          class="tags-view-item"
          @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        >
         <!-- @contextmenu.prevent.native="openMenu(tag,$event)" -->
          <span class="item-left"></span>
          {{ tag.title }}
          <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
          <span class="item-right"></span>
        </router-link>
         
        <el-dropdown  v-if="hiddenViews.length>0" placement='bottom-start' trigger="click">
          <i class="el-icon-more icon-more-tags"></i>
          <el-dropdown-menu class="tag-dropdown-menu" slot="dropdown">
            <router-link
              v-for="(tag,index) in hiddenViews"
              ref="tag"
              :key="tag.path"
              :class="isActive(tag)?'active':''"
              :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
              tag="span"
              class="tags-view-item"
              @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
            
            >
              <el-dropdown-item class="tags-more-item">
                {{ tag.title }}
                <span v-if="!isAffix(tag)" class="el-icon-close icon-del" @click.prevent.stop="closeSelectedTag(tag)" />
              </el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </el-dropdown>
         
    </div>
    <!-- <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul> -->
  </div>
</template>

<script>
import ScrollPane from './ScrollPane'
import path from 'path'

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      tagIndex:0,
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    hiddenViews() {
      return this.$store.state.tagsView.hiddenViews
    },
    routes() {
      return this.$store.state.permission.routes
    }
  },
  watch: {
    $route() {
      this.addTags()
      this.getTagsIndex()
      // this.moveToCurrentTag()
    },
    
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.initVisitedNumber()
    window.onresize = () => {
      return (() => {
          this.initVisitedNumber()
      })()
    }
    this.initTags()
    this.addTags()
  },
  methods: {
    getTagsIndex(){
      const view = this.$route
      let index = 0
      this.$store.state.tagsView.allViews.forEach((v,i) => {
        if( v.path === view.path ){ 
          index= i;        // 赋值
        } 
      })
      this.tagIndex = index
      // console.log('tagIndex',this.tagIndex)
    },
    initVisitedNumber(){
      const tagsViewWidth = this.$refs.tagsView.clientWidth,
            tagWidht = 120,
            moreWidth = 50,
            number = parseInt((tagsViewWidth - moreWidth)/tagWidht)
      // console.log('number',number )
      this.getTagsIndex()
      this.$store.dispatch('tagsView/setVisitedNumber', number)
      this.$store.dispatch('tagsView/resetViewsList',this.tagIndex)
      // console.log("visitedNumber",this.$store.state.tagsView.visitedNumber)
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    addTags() {
      // console.log("改变tag页",this.$route)
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag(view) {
      // console.log("删除tag页面",view)
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags(view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    },
    handleScroll() {
      this.closeMenu()
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 100%;
  width: 100%;
  // background: #fff;
  // border-bottom: 1px solid #d8dce5;
  // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 40px;
      line-height: 40px;
      color: #555;
      // background: #fff;
      padding: 0 12px;
      font-size: 12px;
      &::after{
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 16px;
        background: #ddd;
        content: " ";
        display: inline-block;
      }
      &.active {
        background-color: #fff;
        color: #333;
        .item-left,.item-right{
          width: 6px;
          height: 100%;
          display: inline-block;
          position: absolute;
          top: 0;
          background: #fff;
        }
        .item-left{
         left: -6px;
         &:before{
           width: 100%;
           height: 100%;
           display: block;
           content: "";
           background:#f5f5f5;
           border-radius: 0 0 5px 0;
         }
        }
        .item-right{
         right: -5px;
         &:before{
           width: 100%;
           height: 100%;
           display: block;
           content: "";
           background:#f5f5f5;
           border-radius: 0 0 0 5px;
         }
        }
        &::after{
          display: none;
        }
      }
      // &:first-of-type {
      //   margin-left: 15px;
      // }
      // &:last-of-type {
      //   margin-right: 15px;
      // }
      &.active {
        background-color: #fff;
        color: #333;
        // border-color: #42b983;
        // &::before {
        //   content: '';
        //   background: #fff;
        //   display: inline-block;
        //   width: 8px;
        //   height: 8px;
        //   border-radius: 50%;
        //   position: relative;
        //   margin-right: 2px;
        // }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
.icon-more-tags{
  width: 40px;
  height: 26px;
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;
  outline: none;
}
// .tag-dropdown-menu{
//   border:solid 1px #f9f9f9;
//   box-shadow: 0 4px 16px -4px rgb(0 0 0 / 24%);
//   ::v-deep .popper__arrow{
//     border-bottom-color:#f9f9f9 !important
//   }
// }
.tags-more-item{
  cursor: pointer;
  height: 36px;
  line-height: 36px;
  color: #333;
  background: #fff;
  padding: 0 30px 0 8px;
  font-size: 12px;
  position: relative;
  .icon-del{
    line-height: 12px;
    font-size: 12px;
    color: #888;
    border-radius: 50%;
    position: absolute;
    right: 8px;
    top:50%;
    transform: translateY(-50%);
    display: none;
  }
  &:hover{
    color: #333;
    background: #f9f9f9;
    .icon-del{
      display: inline-block;
    }
  } 
}
</style>

<style lang="scss" scoped>
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 14px;
      height: 14px;
      vertical-align: 1px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.8);
        display: inline-block;
        vertical-align: -2px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}

</style>
