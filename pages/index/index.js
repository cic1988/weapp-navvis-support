//index.js
Page({
  data: {
    //confirmationModalHidden: true,
    email: '',
    subject: '',
    description: ''
  },

  formSubmit: function (e) {
    var value = e.detail.value;

    this.setData({
        //confirmationModalHidden: false,
        email: value.email,
        subject: value.subject,
        description: value.description
      }
    );

    // submit the ticket via freshdesk api
    var base64 = require("../../utils/base64.js");
    var freshdesk = require("../../utils/api.js");

    // verify contact info
    wx.request({
      url: freshdesk.getContactViaEmail(value.email),
      method: 'GET',

      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + base64.encode('VntpYvY02xmQ08vzoOF')
      },

      success: function(res) {
        wx.hideToast();

        // 200 - 1) email exists 2) format correct but not exists
        if (res.statusCode == 200) {
          var data = JSON.parse(res.data);

          if (data.length == 0) {

            wx.showModal({
              title: '提示',
              content: '在系统中找到您的邮箱：' + value.email + ' 请联系NavVis客服获得提问权限。'
            })
          }
          else if (data.length == 1) {
            this.submit(value);
          }
        }
        else if (res.statusCode == 404) {

          wx.showModal({
            title: '提示',
            content: '在系统中未找到您的邮箱：' + value.email + 
            ' 请联系NavVis客服获得提问权限。'
          })         
        }
      }
    }),
  
    // timeout 8s until the submit callback
    wx.showToast({
      title: '提交中，请稍候...',
      icon: 'loading',
      duration: 8000
    });
  },

  alertShow: function (that, iconType, alertlable) {
    that.setData({
      isAlert: true,
      iconType: iconType,
      alertLable: alertlable
    });
    setTimeout(function (e) {
      that.setData({
        isAlert: false
      })
    }, 1500)
  },

  submit: function (value) {
    wx.request({
      url: 'https://solutionbuilder.freshdesk.com/api/v2/tickets',
      method: 'POST',

      data: {
        'subject': value.subject,
        'description': value.description,
        'email': value.email,
        'priority': 1,
        'status': 2
      },

      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + base64.encode('VntpYvY02xmQ08vzoOF')
      },

      success: function (res) {
        // following details see docs: https://developer.freshdesk.com/api/

        if (res.statusCode == 201) {
          console.log('submit successfully!')

          wx.showToast({
            title: '',
            icon: 'success',
            duration: 1000,

            complete: function (res) {
              wx.redirectTo({ url: "../submitconfirm/submitconfirm" });
            }
          })
        }
        else if (res.statusCode == 400) {
          console.log('您的邮箱：' + value.email + ' 格式输入有误')

          wx.showToast({
            title: '您的邮箱：' + value.email + ' 格式输入有误',
            image: '/images/cross.png',
            duration: 1500
          })
        }
        else {
          console.log('错误代码: ' + res.statusCode + ' 请联系客服！')

          wx.showToast({
            title: '错误代码: ' + res.statusCode + ' 请联系客服: support@navvis.com',
            image: '/images/cross.png',
            duration: 1500
          })
        }
      },

      fail: function (res) {
        cconsole.log('错误代码: ' + res.statusCode + ' 请联系客服！')
      }
    });
  }

  //confirmationModalChange: function (e) {
  //  this.setData({
  //    confirmationModalHidden: true
  //  })
  //}
})
