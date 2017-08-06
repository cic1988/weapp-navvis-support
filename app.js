//app.js

import locales from './utils/locales'
import T from './utils/wxapp-i18n'

T.registerLocale(locales)
T.setLocale('zh')
wx.T = T

App({
  onLaunch: function () {
    //get system language
    wx.getSystemInfo({
      success: function(res) {
        if (res.language == 'zh_CN') {
          T.setLocale('zh')
        }
        else {
          T.setLocale('en')
        }
      }
    })

    var that = this;

    wx.getUserInfo({
      withCredentials: false,
      success: function (res) {
        that.globalData.userInfo = res.userInfo
      }
    });
  },

  globalData: {
    userInfo: null
  }
})
