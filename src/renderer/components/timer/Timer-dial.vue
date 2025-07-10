<template>
  <div class="Dial-wrapper">
    <span class="Dial-time-wrapper"><slot></slot></span>
    <svg
      version="1.2"
      baseProfile="tiny"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 230 230"
      xml:space="preserve"
      width="220"
      height="220"
      class="Dial-fill"
      :class="dialClass"
    >
      <path
        fill="none"
        stroke-width="10"
        stroke-linecap="round"
        stroke-miterlimit="10"
        d="M115,5c60.8,0,110,49.2,110,110s-49.2,110-110,110S5,175.8,5,115S54.2,5,115,5"
      />
    </svg>
    <p class="Dial-label">{{ currentRoundDisplay }}</p>
  </div>
</template>

<script>
import anime from 'animejs'
import { EventBus } from '@/utils/EventBus'
import { ipcRenderer } from 'electron'

export default {
  props: {
    currentTime: {
      type: Number,
      required: true
    },
    minutes: {
      type: Number,
      required: true
    },
    timerActive: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      dial: null
    }
  },

  computed: {
    // store getters
    currentRound() {
      return this.$store.getters.currentRound
    },

    timeLongBreak() {
      return this.$store.getters.timeLongBreak * 60 * 1000
    },

    timeShortBreak() {
      return this.$store.getters.timeShortBreak * 60 * 1000
    },

    timeWork() {
      return this.$store.getters.timeWork * 60 * 1000
    },

    currentRoundDisplay() {
      if (this.currentRound === 'work') {
        return 'Focus'
      } else if (this.currentRound === 'short-break') {
        return 'Short Break'
      } else if (this.currentRound === 'long-break') {
        return 'Long Break'
      }
    },

    dialClass() {
      if (this.currentRound === 'work') {
        return 'Dial-fill--work'
      } else if (this.currentRound === 'short-break') {
        return 'Dial-fill--shortBreak'
      } else if (this.currentRound === 'long-break') {
        return 'Dial-fill--longBreak'
      }
    },

    computedTitle() {
      if (this.drawerOpen) {
        switch (this.currentDrawer) {
          case 'appDrawerTimer':
            return 'Timer'
          case 'appDrawerSettings':
            return 'Settings'
          case 'appDrawerTheme':
            return 'Themes'
          case 'appDrawerAbout':
            return 'About'
          default:
            return 'Pomotroid'
        }
      }
      return 'Pomotroid'
    }
  },

  methods: {
    /**
     * Set the time dial animation using a given duration in milliseconds.
     * If a dial animation already exists, removes it and recreates it.
     *
     * @param {number} duration - The current round duration in milliseconds.
     */
    dialAnimation(duration) {
      if (this.dial !== null) {
        this.dial = null
        anime.remove('.Dial-fill path')
        this.dialAnimation(duration)
      }
      this.dial = anime({
        targets: '.Dial-fill path',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: function(el, i, total) {
          return function(t) {
            return t.toFixed(3)
          }
        },
        duration: duration,
        direction: 'reverse',
        autoplay: false
      })
      this.dial.seek(this.dial.duration)
    },

    /**
     * Reset timer animation on window focus.
     * Required due to RequestAnimationFrame not running in blurred windows.
     */
    handleFocus() {
      if (this.timerActive) {
        const duration = this.dial.duration
        const position = this.dial.duration - this.currentTime * 1000
        this.dial.pause()
        this.dialAnimation(duration)
        this.dial.seek(position)
        this.dial.play()
      }
    }
  },

  mounted() {
    // register listener for window-restore events
    ipcRenderer.on('win-restore', (event, arg) => {
      this.handleFocus()
    })
    // register listener for window-show events
    ipcRenderer.on('win-show', (event, arg) => {
      this.handleFocus()
    })

    // set timer to initial work time
    this.dialAnimation(this.timeWork)

    EventBus.$on('timer-started', () => {
      this.dial.play()
    })
    EventBus.$on('timer-paused', () => {
      this.dial.pause()
    })
    EventBus.$on('timer-resumed', () => {
      this.dial.play()
    })
    EventBus.$on('timer-reset', () => {
      this.dial.pause()
      this.dial.seek(this.dial.duration)
    })
    EventBus.$on('timer-init', () => {
      this.dial.pause()
      if (this.currentRound === 'work') {
        this.dialAnimation(this.timeWork)
      } else if (this.currentRound === 'short-break') {
        this.dialAnimation(this.timeShortBreak)
      } else if (this.currentRound === 'long-break') {
        this.dialAnimation(this.timeLongBreak)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.Dial-wrapper {
  position: relative;
  width: 220px;
  height: 220px;
  margin: 35px auto 0 auto;
}

.Dial-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 220px;
  height: 220px;
  z-index: 1;
}
// 调整时间显示位置
.Dial-time-wrapper {
  position: absolute;
  top: 30%;
  left: 73%;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: 100%;
  text-align: center;
  pointer-events: none;
}
// 调整模式显示位置
.Dial-label {
  letter-spacing: 0.1em;
  position: absolute;
  top: 62%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  font-size: 1.2rem;      // 可根据需要调整
  white-space: nowrap;    // 关键：防止自动换行
}

.Dial-fill--work {
  stroke: var(--color-focus-round);
}

.Dial-fill--shortBreak {
  stroke: var(--color-short-round);
}

.Dial-fill--longBreak {
  stroke: var(--color-long-round);
}
</style>
