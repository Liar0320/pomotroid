<template>
  <div class="exercise-reminder">
    <div class="reminder-content">
      <h2>{{ message }}</h2>
      <div class="progress-bar-bg">
        <div class="progress-bar" :style="{ width: percent + '%' }"></div>
      </div>
      <div class="countdown">还剩 {{ seconds }} 秒</div>
      <button class="skip-btn" @click="skip">跳过此次休息</button>
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
      window.close()
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
}
h2 {
  font-size: 2rem;
  margin-bottom: 32px;
}
.progress-bar-bg {
  width: 60%;
  height: 6px;
  background: rgba(255,255,255,0.2);
  border-radius: 3px;
  margin: 0 auto 16px auto;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: #fff;
  border-radius: 3px;
  transition: width 0.3s;
}
.countdown {
  margin-bottom: 40px;
  font-size: 1.1rem;
}
.skip-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1rem;
  text-decoration: underline;
  cursor: pointer;
}
</style>
