/* 
 * weapp-navvis-support
 * Author: YUAN GAO
 * Organization: NavVis GmbH
 * Wechat ID: gaoyuanhot
 * Copyright (c) 2017 https://www.navvis.com All rights reserved.
 * 
 * setting.js
 * 
 * setting page
 */

import event from '../../utils/event.js'
import freshdesk from '../../utils/api.js'

Page({

  //-------------------------------------------------------------------------------------
  // data for the label and text fields
  //-------------------------------------------------------------------------------------

  data: {
    array: ['中文', 'English'],

    objectArray: [
      {
        id: 0,
        name: '中文'
      },
      {
        id: 1,
        name: 'English'
      }
    ],

    index: 0,
    lang: freshdesk.lang
  },

  onLoad() {
    event.on("LangChanged", this, this.setLang)

    if (wx.T.locale == 'zh') {
      this.setData({ index: 0 })
    }
    else {
      this.setData({ index: 1 })
    }
  },

  setLang() {
    this.setData({
      lang: freshdesk.lang
    })
  },

  languageBindPickerChange: function (e) {

    this.setData({
      index: e.detail.value
    })

    var lang = 'zh';

    if (e.detail.value == 0) {
      lang = 'zh'
    }
    else if (e.detail.value == 1) {
      lang = 'en'
    }
    else {
      throw('something went wrong, please contact NavVis support')
    }

    // load language js
    const _ = wx.T._
    wx.T.setLocale(lang)

    freshdesk.reloadLang();

    event.emit('LangChanged', lang)
  }
})