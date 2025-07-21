<template>
  <div class="exercise-reminder">
    <div class="reminder-content">
      <h2>{{ randomTip }}</h2>
      <div class="progress-bar-bg">
        <div class="progress-bar" :style="{ width: percent + '%' }"></div>
      </div>
      <div class="countdown">{{ $t('exerciseReminder.countdown', { seconds: seconds }) }}</div>
      <button class="skip-btn" @click="skip">
        {{ $t('exerciseReminder.skip') }}
        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.16663 10.5H15.8333" stroke="white" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M10 4.9097L15.8333 10.5L10 16.0903" stroke="white" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      seconds: 30,
      total: 30,
      timer: null,
      bgColor: '',
      breakType: 'short',
      randomTip: ''
    }
  },
  computed: {
    percent() {
      return ((this.total - this.seconds) / this.total) * 100
    }
  },
  methods: {
    skip() {
      if (window.require) {
        const { ipcRenderer } = window.require('electron')
        ipcRenderer.send('skip-exercise-and-close')
      } else {
        window.close()
      }
    },
    parseQuery() {
      const params = new URLSearchParams(window.location.search)
      if (params.get('msg')) this.message = params.get('msg')
      if (params.get('duration')) {
        this.seconds = this.total = parseInt(params.get('duration'))
      }
      if (params.get('color')) {
        this.bgColor = params.get('color')
      }
      if (params.get('breakType')) {
        this.breakType = params.get('breakType')
      }
    },
    getRandomTip() {
      try {
        const ideasKey = this.breakType === 'long' ? 'longBreakIdeas' : 'miniBreakIdeas'
        const ideas = this.$i18n.messages[this.$i18n.locale][ideasKey]
        if (!ideas) {
          console.warn(`未找到 ${ideasKey} 翻译内容`)
          return this.message || this.$t('exerciseReminder.message')
        }
        const keys = Object.keys(ideas)
        if (keys.length === 0) {
          console.warn(`${ideasKey} 为空`)
          return this.message || this.$t('exerciseReminder.message')
        }
        const randomKey = keys[Math.floor(Math.random() * keys.length)]
        const randomIdea = ideas[randomKey]
        if (randomIdea && randomIdea.text) {
          return randomIdea.text
        } else {
          console.warn(`随机选择的 ${randomKey} 没有text属性`)
          return this.message || this.$t('exerciseReminder.message')
        }
      } catch (error) {
        console.error('获取随机提示语时出错:', error)
        return this.message || this.$t('exerciseReminder.message')
      }
    }
  },
  mounted() {
    this.parseQuery()
    // 生成随机提示语
    this.randomTip = this.getRandomTip()
    if (window.require) {
      const { ipcRenderer } = window.require('electron')
      ipcRenderer.on('exercise-remaining-update', (event, seconds) => {
        this.seconds = seconds
      })
      ipcRenderer.on('close-exercise-window', () => {
        window.close()
      })
    }
    // 动态设置背景色
    if (this.bgColor) {
      this.$el.style.background = this.bgColor
    }
  },
  beforeDestroy() {
    // 不再需要清理定时器
  }
}
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: transparent !important;
}
</style>

<style scoped>
.exercise-reminder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}
.reminder-content {
  width: 100%;
  max-width: 100%;
  text-align: center;
  color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}
h2 {
  font-size: 28px;
  margin-bottom: clamp(20px, 3vh, 40px);
  line-height: 1.2;
}
.progress-bar-bg {
  width: 100%;
  max-width: 600px;
  height: 10px;
  background: transparent;
  border-radius: 12px;
  margin: 0 auto clamp(12px, 2vh, 24px) auto;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.5);
}
.progress-bar {
  height: 100%;
  background: #fff;
  border-radius: 12px;
  transition: width 0.3s;
}
.countdown {
  margin-bottom: clamp(20px, 4vh, 50px);
  font-size: 20px;
}
.skip-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  text-decoration: none;
  cursor: pointer;
  padding: clamp(8px, 1vh, 16px) clamp(12px, 2vw, 24px);
  display: inline-flex;
  align-items: center;
  gap: clamp(6px, 1vw, 12px);
  transition: all 0.2s ease;
  position: absolute;
  bottom: clamp(40px, 0vh, 80px);
  left: 50%;
  transform: translateX(-50%);
}
.skip-btn:hover {
  transform: translateX(-50%) translateY(-2px);
}
.skip-btn svg {
  width: clamp(16px, 2vw, 20px);
  height: clamp(16px, 2vw, 20px);
}
.skip-arrow {
  width: 1.2em;
  height: 1.2em;
  stroke: #fff;
}
</style>
