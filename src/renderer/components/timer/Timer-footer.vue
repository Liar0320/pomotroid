<template>
  <section class="Container Footer">
    <div class="Round-wrapper">
      <div class="Round-reset-row-strict">
        <span class="Round-main">
          {{ round + '/' + workRounds }}
          <span v-if="totalWorkRounds > 0" class="Total-rounds" :title="$t('footer.focusRoundsCompleted')">({{ totalWorkRounds
            }})</span>
        </span>
        <span class="TextButton Reset-orange" :title="$t('footer.resetCurrentRound')" @click="callForReset">
          {{ $t('footer.reset') }}
        </span>
      </div>
    </div>
    <div class="Icon-group">
      <!-- skip -->
      <div class="Icon-wrapper Icon-wrapper--double--left" :title="$t('footer.skipRound')" @click="skipRound">
        <!-- 跳过按钮的SVG 图标 -->
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Icon--skip">
          <path d="M6 4.80005L14.4 12L6 19.2V4.80005Z" stroke="white" stroke-width="1.66667" stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M18 6V18" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <!-- mute -->
      <div class="Icon-wrapper Icon-wrapper--double--right" :title="volume > 0 ? $t('footer.mute') : $t('footer.unmute')" @click="toggleMute"
        @mouseenter="volumeSliderHidden = false">
        <transition name="fade" mode="out-in">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Icon--mute" v-if="localVolume > 0">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.54 8.45996C16.4773 9.3976 17.0039 10.6691 17.0039 11.995C17.0039 13.3208 16.4773 14.5923 15.54 15.53" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px" y="0px" viewBox="-467 269 24 24" style="enable-background:new -467 269 24 24;" xml:space="preserve"
            height="20px" class="Icon--muted" v-else>
            <path fill="var(--color-background-lightest)"
              d="M-450.5,281c0-1.8-1-3.3-2.5-4v2.2l2.5,2.5C-450.5,281.4-450.5,281.2-450.5,281z M-448,281c0,0.9-0.2,1.8-0.5,2.6l1.5,1.5
              c0.7-1.2,1-2.6,1-4.1c0-4.3-3-7.9-7-8.8v2.1C-450.1,275.1-448,277.8-448,281z M-462.7,272l-1.3,1.3l4.7,4.7h-4.7v6h4l5,5v-6.7
              l4.3,4.3c-0.7,0.5-1.4,0.9-2.3,1.2v2.1c1.4-0.3,2.6-1,3.7-1.8l2,2l1.3-1.3l-9-9L-462.7,272z M-455,273l-2.1,2.1l2.1,2.1V273z" />
            <path fill="none" d="M-467,269h24v24h-24V269z" />
          </svg>
        </transition>
      </div>
      <!-- volume slider -->
      <transition name="fade">
        <div class="Slider-wrapper Slider-wrapper--vert" v-show="!volumeSliderHidden">
          <input type="range" min="0" max="100" class="Slider" v-model="localVolume" @change="setVolume" />
          <div class="Slider-bar Slider-bar--blueGrey"></div>
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
import { EventBus } from '@/utils/EventBus'

export default {
  name: 'TimerFooter',
  data() {
    return {
      currentMousePosition: {
        x: null,
        y: null
      },
      localVolume: 0,
      volumeSliderHidden: true
    }
  },
  computed: {
    // store getters
    currentRound() {
      return this.$store.getters.currentRound
    },

    round() {
      return this.$store.getters.round
    },

    workRounds() {
      return this.$store.getters.workRounds
    },

    totalWorkRounds() {
      return this.$store.getters.totalWorkRounds
    },

    volume() {
      return this.$store.getters.volume
    }
  },

  methods: {
    callForReset() {
      EventBus.$emit('call-timer-reset')
    },

    /**
     * Hides the volume slider unless the last recorded mouse position
     * falls within a range containing the volume slider.
     */
    volumeSliderTimeout() {
      setInterval(() => {
        if (
          this.currentMousePosition.x >= 305 &&
          this.currentMousePosition.x <= 355 &&
          this.currentMousePosition.y >= 305 &&
          this.currentMousePosition.y <= 455
        ) {
        } else {
          this.volumeSliderHidden = true
        }
      }, 6000)
    },

    skipRound() {
      EventBus.$emit('timer-completed')
    },

    toggleMute() {
      // set volume to zero if not muted
      // otherwise set to 100 (default)
      if (this.localVolume === '0') {
        this.localVolume = '100'
        this.$store.dispatch('setVolume', 100)
      } else {
        this.localVolume = '0'
        this.$store.dispatch('setVolume', 0)
      }
    },

    setVolume(e) {
      this.$store.dispatch('setVolume', parseInt(e.target.value))
    }
  },

  mounted() {
    this.localVolume = this.volume
    this.volumeSliderTimeout()

    // record last mouse position for volume slider timeout
    window.addEventListener('mousemove', e => {
      this.currentMousePosition.x = e.clientX
      this.currentMousePosition.y = e.clientY
    })
  }
}
</script>

<style lang="scss" scoped>
.Footer {
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  padding-bottom: 0;
  position: relative;
  height: 56px; // 调整高度更贴合UI
}
.Round-wrapper {
  width: 100%;
  text-align: left;
  margin-bottom: 0;
  position: absolute;
  left: 0;
  bottom: 0;
  height: 48px; // 保证与右侧高度一致
  display: flex;
  align-items: flex-end;
}
.Round-reset-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}
.Round-main {
  color: var(--color-foreground-lightest);
  font-size: 1.25rem;  // 这里调整2/3的字体大小
  font-weight: 400;   // 可选，调整粗细
}
.Total-rounds {
  color: var(--color-accent);   // 颜色
  font-size: 1rem;             // 这里调整(内)的字体大小
  margin-left: 2px;
  font-weight: 400;             // 调整粗细
}
.Reset-orange {
  color: var(--color-accent);   // 颜色
  font-size: 0.875rem;            // 这里调整Reset的字体大小
  cursor: pointer;
  font-weight: 400;             // 调整粗细
}

.Slider-wrapper {
  padding: 8px;
  position: absolute;
  top: -61px;
  right: -29px;
}

.Slider {
  &::-webkit-slider-runnable-track {
    background-color: var(--color-background-lightest);
  }
  &::-webkit-slider-thumb {
    margin-top: -7px;
    transition: $transitionDefault;
    &:hover {
      background-color: var(--color-accent);
      border-color: var(--color-accent);
    }
  }
}
.Round-reset-row-strict {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 12px;
  width: 100%;
  margin-bottom: 0;
  padding-bottom: 0;
  padding-left: 16px;
  height: 48px;
}
.Icon-group {
  position: absolute;
  right: 0;
  bottom:-20px; // 原为0，整体下移8px
  height: 48px;
  display: flex;
  align-items: flex-end;
}
.Icon--skip {
  width: 24px !important;
  height: 24px !important;
  min-width: 24px;
  min-height: 24px;
  max-width: 24px;
  max-height: 24px;
  display: inline-block;
}
.Icon-wrapper--double--left {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.Icon--mute {
  width: 24px !important;
  height: 24px !important;
  min-width: 24px;
  min-height: 24px;
  max-width: 24px;
  max-height: 24px;
  display: inline-block;
}
.Icon-wrapper--double--right {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
