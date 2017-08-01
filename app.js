//app.js

import locales from './utils/locales'
import T from './utils/wxapp-i18n'

T.registerLocale(locales)
T.setLocale('zh')
wx.T = T

App({})
