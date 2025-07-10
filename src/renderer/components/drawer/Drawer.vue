<template>
  <div class="Drawer">
    <transition name="fade" mode="out-in">
      <component :is="currentDrawer" />
    </transition>
    <app-drawer-menu />
  </div>
</template>

<script>
import appDrawerMenu from '@/components/drawer/Drawer-menu'
import appDrawerAbout from '@/components/drawer/Drawer-about'
import appDrawerSettings from '@/components/drawer/Drawer-settings'
import appDrawerTheme from '@/components/drawer/Drawer-theme'
import appDrawerTimer from '@/components/drawer/Drawer-timer'
import appTitlebar from '@/components/Titlebar'

export default {
  name: 'Drawer',

  components: {
    appDrawerMenu,
    appDrawerAbout,
    appDrawerSettings,
    appDrawerTheme,
    appDrawerTimer,
    appTitlebar
  },

  computed: {
    currentDrawer() {
      return this.$store.getters.currentDrawer
    }
  }
}
</script>

<style lang="scss" scoped>
.Drawer {
  background-color: var(--color-background-light);
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: auto;
  z-index: 10;
  -webkit-app-region: no-drag;
}
</style>
