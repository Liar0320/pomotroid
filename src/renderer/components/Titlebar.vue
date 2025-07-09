<template>
  <nav class="Titlebar">
    <!-- menu -->
    <div class="Icon-wrapper Icon-wrapper--titlebar Icon-wrapper--single" style="position: absolute;" title="Settings"
      @click="toggleDrawer">
      <div class="Menu-wrapper" :class="drawerOpen ? 'is-collapsed' : ''">
        <!-- 默认状态的svg图标 -->
        <svg class="default-icon" width="24" height="24" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M4 18L14 18" stroke="#6170A3" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M4 12L20 12" stroke="#6170A3" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M4 6L10 6" stroke="#6170A3" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <!-- 切换后的svg图标 -->
        <svg class="collapsed-icon" width="24" height="24" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="#6170A3" stroke-width="1.4" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </div>
    </div>

    <h1 class="Title">Pomotroid</h1>

    <div class="Icon-group" style="position: absolute; top: 0; right: 0;">
      <div class="Icon-wrapper Icon-wrapper--titlebar Icon-wrapper--double--left" style="padding-left: 18px"
        @click="winMinimize">
        <!-- minimize -->
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19" stroke="#6170A3" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <div class="Icon-wrapper Icon-wrapper--titlebar Icon-wrapper--double--right" style="padding-right: 18px"
        @click="winClose">
        <!-- close -->
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="#6170A3" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M6 6L18 18" stroke="#6170A3" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
  </nav>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  computed: {
    drawerOpen() {
      return this.$store.getters.drawerOpen
    },

    minToTray() {
      return this.$store.getters.minToTray
    },

    minToTrayOnClose() {
      return this.$store.getters.minToTrayOnClose
    }
  },

  methods: {
    toggleDrawer() {
      this.$store.dispatch('toggleDrawer')
    },

    winClose() {
      this.minToTrayOnClose
        ? this.winMinimize()
        : ipcRenderer.send('window-close')
    },

    winMinimize() {
      ipcRenderer.send('window-minimize', this.minToTray)
    }
  }
}
</script>

<style lang="scss" scoped>
.Icon--close,
.Icon--minimize {
  & line {
    stroke: var(--color-background-lightest);
    transition: $transitionDefault;
  }
}

.Menu-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 150%;
}
/* 默认状态 */
.default-icon {
  display: block;
}

/* 收起状态 */
.collapsed-icon {
  display: none;
}

/* 当 .Menu-wrapper 添加 is-collapsed 类时 */
.Menu-wrapper.is-collapsed .default-icon {
  display: none;
}

.Menu-wrapper.is-collapsed .collapsed-icon {
  display: block;
}

.Title {
  color: var(--color-short-round);
  font-size: 1rem;
  font-weight: 200;
  padding-top: 18px;
}

.Titlebar {
  letter-spacing: 0.05em;
  margin-bottom: 18px;
  position: relative;
  text-align: center;
  height: 50px;
  -webkit-app-region: drag;
}

.Icon-wrapper--titlebar {
  -webkit-app-region: no-drag;
  &:hover .Menu-line {
    background-color: var(--color-accent);
  }
  &:hover .Icon--close line {
    stroke: var(--color-focus-round);
  }
  &:hover .Icon--minimize line {
    stroke: var(--color-accent);
  }
}

.Icon-wrapper--titlebar svg {
  width: 24px !important;
  height: 24px !important;
  min-width: 24px;
  min-height: 24px;
  max-width: 24px;
  max-height: 24px;
}
</style>
