//index.js

import event from '../../utils/event'
import freshdesk from '../../utils/api'
import base64 from '../../utils/base64.js'

Page({

  data: {
    email: '',
    subject: '',
    description: '',
    attachments: []
  },

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
      email_label: _('Email:'),
      email_placeholder: _('Your personal email or NavVis portal email'),

      subject_label: _('Subject:'),
      subject_placeholder: _('Brief summary'),

      description_label: _('Description:'),
      description_placeholder: _('Issue description in detail'),

      submitbtn_text: _('Submit'),

      warning_box_title: _('Warning'),
      warning_box_confirm: _('OK'),

      warning_email_nofound: _('Sorry, but we did not find your email in our system, please contact NavVis support'),
      warning_email_noregistered: _('Your are not yet registered in our system, please contact NavVis support'),
      warning_email_format: _('Email format is wrong, would you like to check it again?'),
      warning_unknown: _('Unknown error, please contact NavVis support'),

      submit_waiting: _('Submitting...')
    })
  },

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
  },

  // submit

  showWarning: function (text) {
    wx.showModal({
      title: this.data.warning_box_title,
      content: text,
      showCancel: false,
      confirmText: this.data.warning_box_confirm,
      confirmColor: '#2a85bb'
    })
  },

  formSubmit: function (e) {
    var that = this;
    var value = e.detail.value;

    this.setData({
        //confirmationModalHidden: false,
        email: value.email,
        subject: value.subject,
        description: value.description,

      }
    );

    // submit the ticket via freshdesk api
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

        const _ = wx.T._;
        // 200 - 1) email exists 2) format correct but not exists
        if (res.statusCode == 200) {

          if (res.data.length == 0) {
            that.showWarning(that.data.warning_email_nofound)
          }
          else if (res.data.length == 1) {
            // check this contact whether he is related to a valid company
            // we only accept request from our registered clients to avoid spam
            var contact = res.data[0];

            if (! contact.company_id) {
              that.showWarning(that.data.warning_email_noregistered)
            }
            else {
              that.submit(value);
            }
          }
        }
        else if (res.statusCode == 400) {
          that.showWarning(that.data.warning_email_format)
        }
      }
    }),
  
    // timeout 8s until the submit callback
    wx.showToast({
      title: this.data.submit_waiting,
      icon: 'loading',
      duration: 10000
    });
  },

  submit: function (value) {
    var that = this;

    wx.request({
      url: freshdesk.createTicket(),
      method: 'POST',

      data: {
        'subject': value.subject,
        'description': value.description,
        'email': value.email,
        'priority': 1,
        'status': 2,
        'attachments[0]': that.data.attachments
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
          that.showWarning(that.data.warning_email_format)
        }
        else {
          that.showWarning(res.statusCode + ': ' + that.data.warning_unknown)
        }
      },

      fail: function (res) {
        that.showWarning(res.statusCode + ': ' + that.data.warning_unknown)
      }
    });
  }
})
