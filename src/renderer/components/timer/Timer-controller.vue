<template></template>

<script>
import { EventBus } from '@/utils/EventBus'
import { logger } from '@/utils/logger'
import { ipcRenderer } from 'electron'
export default {
  computed: {
    // store getters
    autoStartWorkTimer() {
      return this.$store.getters.autoStartWorkTimer
    },

    autoStartBreakTimer() {
      return this.$store.getters.autoStartBreakTimer
    },

    currentRound() {
      return this.$store.getters.currentRound
    },

    round() {
      return this.$store.getters.round
    },

    workRounds() {
      return this.$store.getters.workRounds
    }
  },

  methods: {
    checkRound() {
      if (this.currentRound === 'work' && this.round >= this.workRounds) {
        this.$store.dispatch('setCurrentRound', 'long-break')
        this.$store.dispatch('incrementTotalWorkRounds')
        EventBus.$emit('ready-long-break')
        logger.info('focus round completed')
        ipcRenderer.send('onBreak', true)
        // 只在showExerciseReminder为true时弹窗
        if (this.$store.getters.showExerciseReminder) {
          ipcRenderer.send('show-exercise-reminder', {
            message: '长休息时间到，做个拉伸锻炼吧！',
            duration: this.$store.getters.timeLongBreak * 60 // 秒
          })
        }
      } else if (this.currentRound === 'work') {
        this.$store.dispatch('setCurrentRound', 'short-break')
        this.$store.dispatch('incrementTotalWorkRounds')
        EventBus.$emit('ready-short-break')
        logger.info('focus round completed')
        ipcRenderer.send('onBreak', true)
        // 只在showExerciseReminder为true时弹窗
        if (this.$store.getters.showExerciseReminder) {
          ipcRenderer.send('show-exercise-reminder', {
            message: '短休息时间到，起来活动一下！',
            duration: this.$store.getters.timeShortBreak * 60 // 秒
          })
        }
      } else if (this.currentRound === 'short-break') {
        this.$store.dispatch('setCurrentRound', 'work')
        this.$store.dispatch('incrementRound')
        EventBus.$emit('ready-work')
        logger.info('short break completed')
        ipcRenderer.send('onBreak', false)
      } else if (this.currentRound === 'long-break') {
        this.$store.dispatch('setCurrentRound', 'work')
        this.$store.dispatch('resetRound')
        EventBus.$emit('ready-work')
        logger.info('long break completed')
        ipcRenderer.send('onBreak', false)
      }
      this.dispatchTimer()
    },
    dispatchTimer() {
      EventBus.$emit('timer-init', {
        auto:
          this.currentRound === 'work'
            ? this.autoStartWorkTimer
            : this.autoStartBreakTimer
      })
    }
  },

  mounted() {
    // 命名回调，便于解绑
    this._onTimerCompleted = () => {
      this.checkRound()
    }
    EventBus.$on('timer-completed', this._onTimerCompleted)
  },
  beforeDestroy() {
    // 解绑，防止重复注册
    EventBus.$off('timer-completed', this._onTimerCompleted)
  }
}
</script>
