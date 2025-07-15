<template>
  <div class="exercise-reminder">
    <div class="reminder-content">
      <h2>{{ message }}</h2>
      <div class="progress-bar-bg">
        <div class="progress-bar" :style="{ width: percent + '%' }"></div>
      </div>
      <div class="countdown">Countdown: {{ seconds }} seconds</div>
      <button class="skip-btn" @click="skip">
        Skip this break
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
      message: '请休息一下，做几次深呼吸。',
      seconds: 30,
      total: 30,
      timer: null,
      bgColor: ''
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
    startCountdown() {
      this.timer = setInterval(() => {
        if (this.seconds > 0) {
          this.seconds--
        } else {
          clearInterval(this.timer)
          // 通过IPC通知主进程关闭弹窗
          if (window.require) {
            const { ipcRenderer } = window.require('electron')
            ipcRenderer.send('close-exercise-window')
          } else {
            window.close()
          }
        }
      }, 1000)
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
    }
  },
  mounted() {
    this.parseQuery()
    this.startCountdown()
    // 动态设置背景色
    if (this.bgColor) {
      this.$el.style.background = this.bgColor
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
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
}
.reminder-content {
  width: 80%;
  text-align: center;
  color: #fff;
  position: relative;
}
h2 {
  font-size: 2rem;
  margin-bottom: 32px;
}
.progress-bar-bg {
  width: 588px;
  height: 10px;
  background: transparent; /* 与弹窗背景色一致 */
  border-radius: 12px;
  margin: 0 auto 16px auto;
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
  margin-bottom: 40px;
  font-size: 1.25rem;
}
.skip-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  text-decoration: none;
  cursor: pointer;
  padding: 0;
  border-radius: 0;
  display: inline-flex;
  align-items: center;
  transition: none;
  position: absolute;
  top: 405px;
  left: 50%;
  transform: translateX(-50%);
}
.skip-btn:hover {
  background: none;
  color: #fff;
}
.skip-arrow {
  width: 1.2em;
  height: 1.2em;
  stroke: #fff;
}
</style>
