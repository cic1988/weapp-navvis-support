//app.js

import locales from './utils/locales'
import T from './utils/wxapp-i18n'

T.registerLocale(locales)
T.setLocale('zh')
wx.T = T

App({
  onLaunch: function () {
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    }
    else {
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null
  }
})
