<template>
  <div>
    <audio
      id="audio-long-break"
      ref="audio-long-break"
      :src="'./static/audio/alert-long-break.mp3'"
    ></audio>
    <audio
      id="audio-short-break"
      ref="audio-short-break"
      :src="'./static/audio/alert-short-break.mp3'"
    ></audio>
    <audio
      id="audio-work"
      ref="audio-work"
      :src="'./static/audio/alert-work.mp3'"
    ></audio>
    <audio
      id="audio-tick"
      ref="audio-tick"
      :src="'./static/audio/tick.mp3'"
    ></audio>
  </div>
</template>

<script>
import { EventBus } from '@/utils/EventBus'

export default {
  data() {
    return {
      audioLongBreak: null,
      audioTick: null,
      audioShortBreak: null,
      audioWork: null
    }
  },

  computed: {
    // store getters
    currentRound() {
      return this.$store.getters.currentRound
    },
    tickSounds() {
      return this.$store.getters.tickSounds
    },
    tickSoundsDuringBreak() {
      return this.$store.getters.tickSoundsDuringBreak
    },
    volume() {
      return this.$store.getters.volume * 0.01
    }
  },

  mounted() {
    // Volume attribute on audio is not supported
    // and must be set programmatically.
    EventBus.$on('ready-long-break', () => {
      const audio = this.$refs['audio-long-break']
      if (audio) {
        audio.volume = this.volume
        audio.play()
      }
    })

    EventBus.$on('ready-short-break', () => {
      const audio = this.$refs['audio-short-break']
      if (audio) {
        audio.volume = this.volume
        audio.play()
      }
    })

    EventBus.$on('timer-tick', () => {
      const audio = this.$refs['audio-tick']
      if (audio) {
        audio.volume = this.volume
        const isBreak = this.currentRound === 'short-break' || this.currentRound === 'long-break'
        if (isBreak && !this.tickSoundsDuringBreak) return
        if (!isBreak && !this.tickSounds) return
        audio.play()
      }
    })

    EventBus.$on('ready-work', () => {
      const audio = this.$refs['audio-work']
      if (audio) {
        audio.volume = this.volume
        audio.play()
      }
    })
  }
}
</script>
