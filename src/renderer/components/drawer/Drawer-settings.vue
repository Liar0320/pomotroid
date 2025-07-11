<template>
  <div class="Container">
    <!-- Focus &amp; Break Settings -->
    <div class="Settings-header">
      <!-- SVG 图标 -->
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d="M0 20.4H20V0.400024H0V20.4Z" fill="url(#pattern0_3561_860)" />
        <defs>
          <pattern id="pattern0_3561_860" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_3561_860" transform="scale(0.015625)" />
          </pattern>
          <image id="image0_3561_860" width="64" height="64" preserveAspectRatio="none"
            xlink:href="data:image/png;base64,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" />
        </defs>
      </svg>
      <span class="Settings-header-title">Focus &amp; Break Settings</span>
    </div>
    <!-- Focus &amp; Break Settings -->
    <!-- 未实现-Show Exercise Reminders During Rest（在休息时显示锻炼提醒）-功能未实现 -->
    <div class="Setting-wrapper">
      <p class="Setting-title">Show Exercise Reminders During Rest</p>
      <div class="Checkbox" @click="selectAutoStartBreakTimer"
        :class="autoStartBreakTimer ? 'is-active' : 'is-inactive'"></div>
    </div>
    <!-- Auto-start Work Timer -->
    <div class="Setting-wrapper">
      <p class="Setting-title">Auto-start Work Timer</p>
      <div class="Checkbox" @click="selectAutoStartWorkTimer" :class="autoStartWorkTimer ? 'is-active' : 'is-inactive'">
      </div>
    </div>
    <!-- Auto-start Break Timer -->
    <div class="Setting-wrapper">
      <p class="Setting-title">Auto-start Break Timer</p>
      <div class="Checkbox" @click="selectAutoStartBreakTimer"
        :class="autoStartBreakTimer ? 'is-active' : 'is-inactive'"></div>
    </div>
    <!-- ALways On Top During Focus-->
    <div class="Setting-wrapper">
      <p class="Setting-title">Always on Top During Focus</p>
      <div class="Checkbox" @click="selectAlwaysOnTop" :class="alwaysOnTop ? 'is-active' : 'is-inactive'"></div>
    </div>
    <transition name="slide-left" mode="in-out">
      <div class="Setting-wrapper" v-show="alwaysOnTop">
        <p class="Setting-title">Deactivate Always On Top on Breaks</p>
        <div class="Checkbox" @click="selectBreakAlwaysOnTop" :class="breakAlwaysOnTop ? 'is-active' : 'is-inactive'"
          ref="breakAlwaysOnTopCheckbox"></div>
      </div>
    </transition>
    <!--未实现- Pause Timer When Idle（当用户离席或者系统空闲时，暂定计时）--功能未实现 -->
    <div class="Setting-wrapper">
      <p class="Setting-title">Pause Timer When Idle</p>
      <div class="Checkbox" @click="selectAutoStartBreakTimer"
        :class="autoStartBreakTimer ? 'is-active' : 'is-inactive'"></div>
    </div>

    <!-- Notifications & Display -->
    <div class="Settings-header">
      <!-- SVG 图标 -->
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d="M0 20H20V0H0V20Z" fill="url(#pattern0_3561_861)" />
        <defs>
          <pattern id="pattern0_3561_861" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_3561_861" transform="scale(0.015625)" />
          </pattern>
          <image id="image0_3561_861" width="64" height="64" preserveAspectRatio="none"
            xlink:href="data:image/png;base64,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" />
        </defs>
      </svg>
      <span class="Settings-header-title">Notifications & Display</span>
    </div>
    <!-- Notifications & Display -->
    <!-- 未实现-这两个Tick Sounds功能要进行合并 -->
    <!-- Tick Sounds - Work -->
    <div class="Setting-wrapper">
      <p class="Setting-title">Tick Sounds - Work</p>
      <div class="Checkbox" @click="selectTickSounds" :class="tickSounds ? 'is-active' : 'is-inactive'"></div>
    </div>
    <!-- Tick Sounds - Break -->
    <div class="Setting-wrapper">
      <p class="Setting-title">Tick Sounds - Break</p>
      <div class="Checkbox" @click="selectTickSoundsDuringBreak"
        :class="tickSoundsDuringBreak ? 'is-active' : 'is-inactive'"></div>
    </div>
    <!--未实现 Show Break Screen on All Displays（多屏用户在所有应用上收到桌面通知不遗漏） --功能未实现-->
    <div class="Setting-wrapper">
      <p class="Setting-title">Show Break Screen on All Displays</p>
      <div class="Checkbox" @click="selectAutoStartBreakTimer"
        :class="autoStartBreakTimer ? 'is-active' : 'is-inactive'"></div>
    </div>
    <!--未实现 Show Reminder in Do Not Disturb Mode（在勿扰模式下显示提醒） --功能未实现-->
    <div class="Setting-wrapper">
      <p class="Setting-title">Show Reminder in Do Not Disturb Mode</p>
      <div class="Checkbox" @click="selectAutoStartBreakTimer"
        :class="autoStartBreakTimer ? 'is-active' : 'is-inactive'"></div>
    </div>
    <!-- Desktop Notifications -->
    <div class="Setting-wrapper">
      <p class="Setting-title">Desktop Notifications</p>
      <div class="Checkbox" @click="selectNotifications" :class="notifications ? 'is-active' : 'is-inactive'"></div>
    </div>
    <!-- Basic Settings -->
    <div class="Settings-header">
      <!-- SVG 图标 -->
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d="M0 20.4H20V0.400024H0V20.4Z" fill="url(#pattern0_3561_862)" />
        <defs>
          <pattern id="pattern0_3561_862" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_3561_862" transform="scale(0.015625)" />
          </pattern>
          <image id="image0_3561_862" width="64" height="64" preserveAspectRatio="none"
            xlink:href="data:image/png;base64,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" />
        </defs>
      </svg>
      <span class="Settings-header-title">Basic Settings</span>
    </div>
    <!-- Basic Settings -->
    <!-- 最小化到托盘未实现 -->
    <!-- Minimize to Tray -->
    <div class="Setting-wrapper">
      <p class="Setting-title">Minimize to Tray</p>
      <div class="Checkbox" @click="selectMinToTray" :class="minToTray ? 'is-active' : 'is-inactive'"></div>
    </div>
    <!-- Minimize to Tray on Close -->
    <div class="Setting-wrapper">
      <p class="Setting-title">Minimize to Tray on Close</p>
      <div class="Checkbox" @click="selectMinToTrayOnClose" :class="minToTrayOnClose ? 'is-active' : 'is-inactive'">
      </div>
    </div>
    <!-- 未实现-Auto-launch on Login（登录时自启动） -->
    <div class="Setting-wrapper">
      <p class="Setting-title">Auto-launch on Login</p>
      <div class="Checkbox" @click="selectAutoStartBreakTimer"
        :class="autoStartBreakTimer ? 'is-active' : 'is-inactive'"></div>
    </div>
    <!-- 未实现-Language（语言切换功能） -->
    <div class="Setting-wrapper">
      <p class="Setting-title">Language</p>
      <div class="Checkbox" @click="selectAutoStartBreakTimer"
        :class="autoStartBreakTimer ? 'is-active' : 'is-inactive'"></div>
    </div>
    <!-- 三个快捷键 -逻辑为删除，只是把UI进行了隐藏-->
    <!-- <div class="Setting-wrapper">
      <p class="Setting-title">Toggle Timer</p>
      <shortcut-input :value="globalShortcuts['call-timer-toggle']"
        @input="shortcut => setGlobalShortcut('call-timer-toggle', shortcut)" />
    </div>
    <div class="Setting-wrapper">
      <p class="Setting-title">Reset Timer</p>
      <shortcut-input :value="globalShortcuts['call-timer-reset']"
        @input="shortcut => setGlobalShortcut('call-timer-reset', shortcut)" />
    </div>
    <div class="Setting-wrapper">
      <p class="Setting-title">Skip Round</p>
      <shortcut-input :value="globalShortcuts['call-timer-skip']"
        @input="shortcut => setGlobalShortcut('call-timer-skip', shortcut)" />
    </div> -->
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import ShortcutInput from '../ShortcutInput'

export default {
  name: 'Drawer-settings',

  computed: {
    alwaysOnTop() {
      return this.$store.getters.alwaysOnTop
    },

    breakAlwaysOnTop() {
      return this.$store.getters.breakAlwaysOnTop
    },

    autoStartWorkTimer() {
      return this.$store.getters.autoStartWorkTimer
    },

    autoStartBreakTimer() {
      return this.$store.getters.autoStartBreakTimer
    },

    minToTray() {
      return this.$store.getters.minToTray
    },

    minToTrayOnClose() {
      return this.$store.getters.minToTrayOnClose
    },

    notifications() {
      return this.$store.getters.notifications
    },

    os() {
      return this.$store.getters.os
    },

    tickSounds() {
      return this.$store.getters.tickSounds
    },

    tickSoundsDuringBreak() {
      return this.$store.getters.tickSoundsDuringBreak
    },

    globalShortcuts() {
      return this.$store.getters.globalShortcuts
    }
  },

  methods: {
    selectAlwaysOnTop() {
      const payload = {
        key: 'alwaysOnTop',
        val: !this.alwaysOnTop
      }
      ipcRenderer.send('toggle-alwaysOnTop', !this.alwaysOnTop)
      this.$store.dispatch('setSetting', payload)
      this.$store.dispatch('setViewState', payload)

      if (this.alwaysOnTop === false && this.breakAlwaysOnTop === true) {
        this.$refs.breakAlwaysOnTopCheckbox.click()
      }
    },

    selectBreakAlwaysOnTop() {
      const payload = {
        key: 'breakAlwaysOnTop',
        val: !this.breakAlwaysOnTop
      }

      ipcRenderer.send('toggle-breakAlwaysOnTop', !this.breakAlwaysOnTop)
      this.$store.dispatch('setSetting', payload)
      this.$store.dispatch('setViewState', payload)
    },

    selectAutoStartWorkTimer() {
      const payload = {
        key: 'autoStartWorkTimer',
        val: !this.autoStartWorkTimer
      }
      this.$store.dispatch('setSetting', payload)
      this.$store.dispatch('setViewState', payload)
    },

    selectAutoStartBreakTimer() {
      const payload = {
        key: 'autoStartBreakTimer',
        val: !this.autoStartBreakTimer
      }
      this.$store.dispatch('setSetting', payload)
      this.$store.dispatch('setViewState', payload)
    },

    selectMinToTray() {
      const payload = {
        key: 'minToTray',
        val: !this.minToTray
      }
      ipcRenderer.send('toggle-minToTray', !this.minToTray)
      this.$store.dispatch('setSetting', payload)
      this.$store.dispatch('setViewState', payload)
    },

    selectMinToTrayOnClose() {
      const payload = {
        key: 'minToTrayOnClose',
        val: !this.minToTrayOnClose
      }
      this.$store.dispatch('setSetting', payload)
      this.$store.dispatch('setViewState', payload)
    },

    selectNotifications() {
      const payload = {
        key: 'notifications',
        val: !this.notifications
      }
      this.$store.dispatch('setSetting', payload)
      this.$store.dispatch('setViewState', payload)
    },

    selectTickSounds() {
      this.$store.dispatch('setTickSounds', !this.tickSounds)
    },

    selectTickSoundsDuringBreak() {
      this.$store.dispatch(
        'setTickSoundsDuringBreak',
        !this.tickSoundsDuringBreak
      )
    },

    setGlobalShortcut(event, shortcut) {
      const newShortcut = JSON.parse(JSON.stringify(this.globalShortcuts))
      newShortcut[event] = shortcut
      this.$store.dispatch('setGlobalShortcuts', newShortcut)
      ipcRenderer.send('reload-global-shortcuts', newShortcut)
    }
  },
  components: {
    ShortcutInput
  }
}
</script>

<style lang="scss" scoped>
// 分类导航栏样式
.Settings-header {
  display: flex;
  align-items: center;
  margin-bottom: 13.6px;
  margin-top: 22.4px;
}

.Settings-header-icon {
  margin-right: 8px;
  vertical-align: middle;
}

.Settings-header-title {
  color: #6170A3; /* 或根据你的主题色调整 */
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.02em;
  vertical-align: bottom;
  margin-left: 10px;
}
// 分类导航栏样式
.Checkbox {
  background-color: var(--color-background);
  border: 2px solid var(--color-background-lightest);
  border-radius: 100%;
  display: inline-block;
  transition: $transitionDefault;
  width: 16px;
  height: 16px;
  &:hover {
    border-color: var(--color-accent);
  }
  &.is-active {
    background-color: var(--color-accent);
    border-color: var(--color-background);
    &:hover {
      background-color: var(--color-accent);
      border-color: var(--color-background-lightest);
    }
  }
}

.Container {
  max-height: calc(100% - 36px);
  overflow-y: auto;
}

.Setting-wrapper {
  background-color: var(--color-background);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  padding: 12px;
}

.Setting-title {
  color: var(--color-foreground-darker);
  font-size: 14px;
  letter-spacing: 0.02em;
}
</style>
