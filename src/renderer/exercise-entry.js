import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ExerciseReminder from './components/ExerciseReminder.vue'

Vue.use(VueI18n)

// 自动导入 locales 目录下所有 json 文件
function loadLocaleMessages() {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  console.log('Available locale files:', locales.keys())
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-]+)\.json$/i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
      console.log(`Loaded locale: ${locale}, keys: ${Object.keys(locales(key))}`)
    }
  })
  console.log('Final messages object:', Object.keys(messages))
  return messages
}

// 尝试从主应用获取语言设置，如果没有则使用默认值
let savedLang = 'en'
try {
  savedLang = localStorage.getItem('lang') || 'en'
  // 如果 localStorage 中没有，尝试从 URL 参数获取
  const urlParams = new URLSearchParams(window.location.search)
  const langParam = urlParams.get('lang')
  if (langParam) {
    savedLang = langParam
  }
} catch (error) {
  console.error('Error getting language setting:', error)
  savedLang = 'en'
}

console.log('Exercise reminder language:', savedLang)

const i18n = new VueI18n({
  locale: savedLang,
  fallbackLocale: 'en',
  messages: loadLocaleMessages()
})

new Vue({
  render: h => h(ExerciseReminder),
  i18n
}).$mount('#app')
