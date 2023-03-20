<template>
  <section class="app-main">
    <!-- 动态组件 -->
    <transition name="fade-transform" mode="out-in">
        <!-- include: 只有名称匹配的组件会被缓存 -->
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    // 给router-view设置key为this.$route.path：避免了组件复用，子路由间来回切换时，页面都会重新加载
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 150 = navbar + tags-view = 50 + 100 */
    min-height: calc(100vh - 100px);
  }

  .fixed-header+.app-main {
    padding-top: 100px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
