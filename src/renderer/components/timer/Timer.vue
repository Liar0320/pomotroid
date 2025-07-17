<template>
  <div class="Timer-wrapper">
    <app-audio />
    <app-tray-icon />
    <app-timer-dial
      :current-time="currentTime"
      :minutes="minutes"
      :timerActive="timerActive"
    >
      <p class="Dial-time" v-if="!timerStarted">{{ prettyMinutes }}</p>
      <p class="Dial-time" v-else>{{ prettyTime }}</p>
    </app-timer-dial>

    <section class="Container Button-wrapper">
      <transition name="fade" mode="out-in">
        <div
          class="Button"
          v-if="!timerStarted"
          @click="startTimer"
          :key="'start'"
        >
          <div class="Button-icon-wrapper">
            <svg
              version="1.2"
              baseProfile="tiny"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 7.6 15"
              xml:space="preserve"
              height="15px"
              class="Icon--start"
            >
              <polygon
                fill="var(--color-foreground)"
                points="0,0 0,15 7.6,7.4 "
              />
            </svg>
          </div>
        </div>
        <div
          class="Button"
          v-if="timerStarted && !timerActive"
          @click="resumeTimer"
          :key="'resume'"
        >
          <div class="Button-icon-wrapper">
            <svg
              version="1.2"
              baseProfile="tiny"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 7.6 15"
              xml:space="preserve"
              height="15px"
            >
              <polygon
                fill="var(--color-foreground)"
                points="0,0 0,15 7.6,7.4 "
              />
            </svg>
          </div>
        </div>
        <div
          class="Button"
          v-else-if="timerStarted && timerActive"
          @click="pauseTimer"
          :key="'pause'"
        >
          <div class="Button-icon-wrapper">
            <svg
              version="1.2"
              baseProfile="tiny"
              id="Layer_2"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 10.9 18"
              xml:space="preserve"
              height="15px"
              class="Icon--pause"
            >
              <line
                fill="none"
                stroke="var(--color-foreground)"
                stroke-width="3"
                stroke-linecap="round"
                stroke-miterlimit="10"
                x1="1.5"
                y1="1.5"
                x2="1.5"
                y2="16.5"
              />
              <line
                fill="none"
                stroke="var(--color-foreground)"
                stroke-width="3"
                stroke-linecap="round"
                stroke-miterlimit="10"
                x1="9.4"
                y1="1.5"
                x2="9.4"
                y2="16.5"
              />
            </svg>
          </div>
        </div>
      </transition>
    </section>

    <app-timer-footer />
    <app-timer-controller />
  </div>
</template>

<script>
import TimerWorker from '@/utils/timer.worker.js'
import appAudio from '@/components/Audio'
import appTrayIcon from '@/components/TrayIcon'
import appTimerController from '@/components/timer/Timer-controller'
import appTimerDial from '@/components/timer/Timer-dial'
import appTimerFooter from '@/components/timer/Timer-footer'
import { EventBus } from '@/utils/EventBus'
import { logger } from '@/utils/logger'
import { ipcRenderer } from 'electron'

export default {
  components: {
    appAudio,
    appTrayIcon,
    appTimerController,
    appTimerDial,
    appTimerFooter
  },

  data() {
    return {
      currentTime: 0,
      minutes: 1,
      timerActive: false,
      timerStarted: false,
      timerWorker: null
    }
  },

  computed: {
    // store getters
    currentRound() {
      return this.$store.getters.currentRound
    },

    currentRoundDisplay() {
      if (this.currentRound === 'work') {
        return this.$t('timer.currentRound.work')
      } else if (this.currentRound === 'short-break') {
        return this.$t('timer.currentRound.shortBreak')
      } else if (this.currentRound === 'long-break') {
        return this.$t('timer.currentRound.longBreak')
      }
    },

    timeLongBreak() {
      return this.$store.getters.timeLongBreak
    },

    timeShortBreak() {
      return this.$store.getters.timeShortBreak
    },

    timeWork() {
      return this.$store.getters.timeWork
    },

    // local
    prettyMinutes() {
      return this.minutes + ':00'
    },

    prettyTime() {
      return `${this.timeRemaining.remainingMinutes}:${this.timeRemaining.remainingSeconds}`
    },

    timeElapsed() {
      const time = this.currentTime
      const minutes = Math.floor(time / 60)
      const seconds = time - minutes * 60
      return {
        minutes,
        seconds
      }
    },

    timeRemaining() {
      const minutes = this.minutes
      const time = this.currentTime
      const elapsedMinutes = Math.floor(time / 60)
      const elapsedSeconds = time - elapsedMinutes * 60
      const remainingSeconds = this.formatTimeDouble(60 - elapsedSeconds)
      let remainingMinutes = minutes - elapsedMinutes

      if (elapsedSeconds > 0) {
        remainingMinutes -= 1
      }

      return {
        remainingMinutes,
        remainingSeconds
      }
    }
  },

  methods: {
    formatTimeDouble(time) {
      if (time === 60) {
        return '00'
      } else if (time < 10) {
        return `0${time}`
      } else {
        return time
      }
    },

    handleMessage(message) {
      switch (message.data.event) {
        case 'complete':
          EventBus.$emit('timer-completed')
          break
        case 'pause':
          EventBus.$emit('timer-paused')
          ipcRenderer.send('roundChange', 'paused')
          break
        case 'reset':
          EventBus.$emit('timer-reset')
          break
        case 'resume':
          EventBus.$emit('timer-started')
          this.currentTime = message.data.elapsed
          ipcRenderer.send('roundChange', this.$store.getters.currentRound)
          break
        case 'start':
          EventBus.$emit('timer-started')
          this.currentTime = message.data.elapsed
          logger.info(`${this.currentRoundDisplay} round started`)
          ipcRenderer.send('roundChange', this.$store.getters.currentRound)
          break
        case 'tick':
          this.currentTime = message.data.elapsed
          EventBus.$emit('timer-tick', {
            elapsed: message.data.elapsed,
            total: message.data.totalSeconds
          })
          // 新增：短休息/长休息时每秒推送剩余时间到主进程
          if (window.require) {
            const { ipcRenderer } = window.require('electron')
            if (this.currentRound === 'short-break' || this.currentRound === 'long-break') {
              const seconds = this.timeRemaining.remainingMinutes * 60 + parseInt(this.timeRemaining.remainingSeconds)
              ipcRenderer.send('exercise-remaining-update', seconds)
            }
          }
          break
        default:
          break
      }
    },

    initTimer() {
      switch (this.currentRound) {
        case 'work':
          this.minutes = this.timeWork
          this.createTimer(this.timeWork)
          break
        case 'short-break':
          this.minutes = this.timeShortBreak
          this.createTimer(this.timeShortBreak)
          break
        case 'long-break':
          this.minutes = this.timeLongBreak
          this.createTimer(this.timeLongBreak)
          break
        default:
          this.createTimer(25)
          break
      }
    },

    createTimer(min) {
      if (!this.timerWorker) return
      this.timerWorker.postMessage({ event: 'create', min })
    },

    pauseTimer() {
      if (!this.timerWorker) return
      this.timerWorker.postMessage({ event: 'pause' })
      this.timerActive = !this.timerActive
      logger.info(`${this.currentRoundDisplay} round paused`)
    },

    resetTimer() {
      if (!this.timerWorker) return
      this.timerWorker.postMessage({ event: 'reset' })
      this.timerActive = !this.timerActive
      this.timerStarted = false
    },

    resumeTimer() {
      if (!this.timerWorker) return
      this.timerWorker.postMessage({ event: 'resume' })
      this.timerActive = true
    },

    startTimer() {
      if (!this.timerWorker) return
      this.timerWorker.postMessage({ event: 'start' })
      this.timerActive = true
      this.timerStarted = true
    },
    toggleTimer() {
      if (this.timerActive) {
        this.pauseTimer()
      } else {
        this.startTimer()
      }
    }
  },

  mounted() {
    this.timerWorker = new TimerWorker()
    this.timerWorker.addEventListener('message', this.handleMessage)

    this.initTimer()

    EventBus.$on('timer-init', opts => {
      // clear previous timers
      this.resetTimer()
      this.initTimer()
      if (opts.auto) {
        setTimeout(() => {
          this.startTimer()
        }, 1500)
      } else {
        this.timerActive = false
      }
    })

    EventBus.$on('call-timer-reset', () => {
      this.resetTimer()
      logger.info(`${this.currentRoundDisplay} round reset`)
    })

    EventBus.$on('call-timer-toggle', () => {
      logger.info(`${this.currentRoundDisplay} toggle`)
      this.toggleTimer()
    })

    EventBus.$on('call-timer-skip', () => {
      EventBus.$emit('timer-completed')
    })

    // 新增：倒计时结束时通知主进程关闭弹窗
    EventBus.$on('timer-completed', () => {
      if (window.require) {
        const { ipcRenderer } = window.require('electron')
        ipcRenderer.send('close-exercise-window')
      }
    })

    ipcRenderer.on('event-bus', (event, arg) => {
      // Event Bus events from main
      logger.info(`event-bus ${arg}`)
      EventBus.$emit(arg)
    })

    if (window.require) {
      const { ipcRenderer } = window.require('electron')
      ipcRenderer.on('skip-break-round', () => {
        // 触发跳过休息轮次，使用EventBus事件而不是$emit
        EventBus.$emit('timer-completed')
      })
    }

    // Bind event listener to Space key
    window.addEventListener(
      'keypress',
      e => {
        if (e.code === 'Space') {
          this.toggleTimer()
        }
      },
      true
    )
  },

  beforeDestroy() {
    // 清理EventBus监听器
    EventBus.$off('timer-init')
    EventBus.$off('call-timer-reset')
    EventBus.$off('call-timer-toggle')
    EventBus.$off('call-timer-skip')

    // 清理IPC监听器
    if (window.require) {
      const { ipcRenderer } = window.require('electron')
      ipcRenderer.removeAllListeners('event-bus')
      ipcRenderer.removeAllListeners('skip-break-round')
    }

    // 清理Worker
    if (this.timerWorker) {
      this.timerWorker.removeEventListener('message', this.handleMessage)
      this.timerWorker.terminate()
    }

    // 清理键盘事件监听器
    window.removeEventListener('keypress', e => {
      if (e.code === 'Space') {
        this.toggleTimer()
      }
    }, true)
  }
}
</script>

<style lang="scss" scoped>

.Button {
  border: 2px solid #6170A3;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  transition: $transitionDefault;
  width: 50px;
  height: 50px;
  -webkit-app-region: no-drag;
  &:hover {
    background-color: var(--color-background-light);
    & .Icon--pause line {
      stroke: var(--color-accent);
    }
    & .Icon--start polygon {
      fill: var(--color-accent);
    }
  }
}

.Button-wrapper {
  display: flex;
  justify-content: center;
  margin: 20px 0 10px 0;
}

.Button-icon-wrapper {
  align-items: center;
  display: flex;
  height: 100%;
}

.Dial-time {
  font-family: 'RobotoMono', monospace;
  font-size: 46px;
  margin: 0;
  position: absolute;
  top: 32%;
}

.Timer-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
  background: none;
}
.Setting-wrapper {
  background: none;
  border-radius: 0;
  margin: 0 0 24px 0;
  padding: 0;
  box-shadow: none;
}
.Setting-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 4px;
}
.Setting-title {
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 500;
  min-width: 90px;
  margin-bottom: 0;
  letter-spacing: 0.05em;
}
.Setting-value {
  background: #23273a;
  border-radius: 6px;
  font-family: 'RobotoMono', monospace;
  font-size: 1rem;
  color: #fff;
  padding: 2px 10px;
  min-width: 40px;
  text-align: center;
  margin: 0 0 0 8px;
}
.Slider-wrapper {
  width: 100%;
  margin-left: 0;
  margin-right: 0;
}
.Slider {
  width: 100%;
  height: 3px;
  margin-top: 0;
  &::-webkit-slider-runnable-track {
    background-color: #44485a;
    height: 3px;
  }
  &::-webkit-slider-thumb {
    background-color: currentColor;
    border: none;
    border-radius: 100%;
    width: 14px;
    height: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    -webkit-appearance: none;
    -webkit-app-region: no-drag;
    transform: translateY(2px);
  }
  &::-moz-range-thumb {
    transform: translateY(2px);
  }
}
.Slider--red {
  color: var(--color-focus-round);
}
.Slider--green {
  color: var(--color-short-round);
}
.Slider--blue {
  color: var(--color-long-round);
}
.Slider-bar--blueGrey,
.Slider--blueGrey {
  color: var(--color-background-lightest);
}
.TextButton {
  margin-top: auto;
  margin-right: 24px;
  margin-bottom: 24px;
  align-self: flex-end;
  color: #ff9800;
  text-align: right;
  font-size: 15px;
  cursor: pointer;
}
</style>
