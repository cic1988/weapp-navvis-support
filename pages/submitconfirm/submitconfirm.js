/* 
 * weapp-navvis-support
 * Author: YUAN GAO
 * Organization: NavVis GmbH
 * Wechat ID: gaoyuanhot
 * Copyright (c) 2017 https://www.navvis.com All rights reserved.
 * 
 * submitconfirm.js
 * 
 * confirmation after submitting
 */

import event from '../../utils/event.js'
import freshdesk from '../../utils/api'

Page({

  //-------------------------------------------------------------------------------------
  // data for the label and text fields
  //-------------------------------------------------------------------------------------

  data: {
    lang: freshdesk.lang
  },

  setLang: function () {
    this.setData({
      lang: freshdesk.lang
    })
  },

  onLoad() {
    event.on("LangChanged", this, this.setLang)
  },

  onShow() {
    // tabbar and tab titles are currently not able to modify
    // need to hard-code them
    const _ = wx.T._;
    wx.setNavigationBarTitle({
      title: _('NavVis Support System')
    })
  }
})