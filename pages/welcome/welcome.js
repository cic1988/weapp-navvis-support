/* 
 * weapp-navvis-support
 * Author: YUAN GAO
 * Organization: NavVis GmbH
 * Wechat ID: gaoyuanhot
 * Copyright (c) 2017 https://www.navvis.com All rights reserved.
 * 
 * welcome.js
 * 
 * welcome page
 */

var app = getApp()

const _ = wx.T._;

Page({
  data: {
    motto: _('welcome_info'),
    confirm: _("Yes, I've got it"),
    userInfo: {}
  },

  jumpToIndex: function() {
    wx.setStorageSync('userInitialized', true);
    wx.switchTab({ url: '../index/index' });
  },

  onLoad: function () {

    if (wx.getStorageSync('userInitialized')) {
      wx.switchTab({ url: '../index/index' });
      return;
    }
    var that = this

    app.getUserInfo(function(userInfo){

      that.setData({
        userInfo:userInfo
      })
    })
  }
})
