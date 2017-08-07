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
    value_email: wx.getStorageSync('userEmail'),
    addImageHidden: false,
    previewHidden: true
  },

  setLang: function() {
    this.setData({
      lang: freshdesk.lang
    })
  },

  onLoad() {
    event.on("LangChanged", this, this.setLang)

    var that = this;

    // get screen width
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ imageWidth: res.windowWidth / 3 + 20 })
      }
    });
  },

  // choose image
  // only one image can be uploaded at once see: https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-file.html#wxuploadfileobject
  chooseImage: function() {
      var that = this;

      wx.chooseImage({
        count: 1, // can choose only one image
        sizeType: ['original', 'compressed'], // either submit with original or compressed size
        sourceType: ['album', 'camera'], // choose available from album and camera

        success: function (res) {
          // TODO: it could happen that the user chose one image and before submitting ticket
          // he deletes the image. A file-check should be done before submitting.
          that.setData( {
            attachment: res.tempFilePaths[0],

            // hide add image icon and show image preview
            addImageHidden: true,
            previewHidden: false
          });
        }
      })
  },

  // remove image
  removeImage: function() {
    this.setData({
      attachment: null,

      // hide image preview and show image add
      addImageHidden: false,
      previewHidden: true
    })
  },

  // submit

  formSubmit: function (e) {
    var value = e.detail.value;
    value.attachment = this.data.attachment;

    freshdesk.checkContact(value.email, freshdesk.createTicket(value, '../submitconfirm/submitconfirm'))
  }
})
