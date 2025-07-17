import Vue from 'vue'
import App from './App'
import store from './store'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

// 自动导入 locales 目录下所有 json 文件
function loadLocaleMessages() {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\.json$/i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

const savedLang = localStorage.getItem('lang') || 'en'

const i18n = new VueI18n({
  locale: savedLang,
  fallbackLocale: 'en',
  messages: loadLocaleMessages()
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  i18n,
  template: '<App/>'
}).$mount('#app')
