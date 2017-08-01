// submitconfirm.js

import event from '../../utils/event.js'

Page({

  onLoad() {
    event.on("LangChanged", this, this.setLang)
    this.setLang()
  },

  onShow() {
    // tabbar and tab titles are currently not able to modify
    // need to hard-code them
    const _ = wx.T._;
    wx.setNavigationBarTitle({
      title: _('NavVis Support System')
    })
  },

  setLang() {
    const _ = wx.T._;
    this.setData({
      submit_success: _('Your request is successfully submitted! Our support staff would contact you soon!')
    })
  },
})