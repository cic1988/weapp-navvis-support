/* 
 * weapp-navvis-support
 * Author: YUAN GAO
 * Organization: NavVis GmbH
 * Wechat ID: gaoyuanhot
 * Copyright (c) 2017 https://www.navvis.com All rights reserved.
 * 
 * index.js
 * 
 * input page
 */

import event from '../../utils/event'
import freshdesk from '../../utils/api'

Page({

  //-------------------------------------------------------------------------------------
  // data for the label and text fields
  //-------------------------------------------------------------------------------------

  data: {
    lang: freshdesk.lang,
    value_email: wx.getStorageSync('userEmail') 
  },

  setLang: function() {
    this.setData({
      lang: freshdesk.lang
    })
  },

  onLoad() {
    event.on("LangChanged", this, this.setLang)
  },

/*
  // choose image

  chooseImg: function () {
    var that = this;

    wx.chooseImage({
      count: 5, // max 5 photos
      sizeType: ['original', 'compressed'], // choose defaul size or conpressed size
      sourceType: ['album', 'camera'], // choose the source of photos

      success: function (res) {
        that.data.attachments = res.tempFilePaths
      }
    })
  },*/

  // submit

  formSubmit: function (e) {
    var value = e.detail.value;
    freshdesk.checkContact(value.email, freshdesk.createTicket(value, '../submitconfirm/submitconfirm'))
  }
})
