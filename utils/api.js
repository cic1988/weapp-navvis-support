/* 
 * weapp-navvis-support
 * Author: YUAN GAO
 * Organization: NavVis GmbH
 * Wechat ID: gaoyuanhot
 * Copyright (c) 2017 https://www.navvis.com All rights reserved.
 * 
 * api.js
 * 
 * wrapper for using freshdesk API to connect weapp and freshdesk
 */

import base64 from 'base64.js'


//---------------------------------------------------------------------------------------
// general NavVis color scheme
//---------------------------------------------------------------------------------------

const navvisblue = '#2A85BB'

const _ = wx.T._;

var lang = {};


//---------------------------------------------------------------------------------------
// wrapper for freshdesk protocol, see freshdesk docs: https://developer.freshdesk.com/api/
//---------------------------------------------------------------------------------------

function showWarning(text) {
  wx.showModal({
    title: lang.warning_box_title,
    content: text,
    showCancel: false,
    confirmText: lang.warning_box_confirm,
    confirmColor: navvisblue
  })
}

var HOST_URI = 'https://solutionbuilder.freshdesk.com/api/v2/';
var API_KEY = base64.encode('VntpYvY02xmQ08vzoOF');

// send request to verify the given email whether:
// 1) the contact is registered in freshdesk but without valid company id OR
// 2) not found in freshdesk
//
// contact only registered in freshdesk and has valid company id is allowed to submit ticket
//
// email: contact email as input string

function checkContact(email, callback) {

  wx.request({
    url: HOST_URI + 'contacts/?email=' + email,
    method: 'GET',

    header: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + API_KEY
    },

    success: function (res) {
      // nevertherless hide the loading toast first
      wx.hideToast();

      // 200 - 1) email exists 2) format correct but not exists
      if (res.statusCode == 200) {

        if (res.data.length == 0) {
          showWarning(lang.warning_email_nofound)
        }
        else if (res.data.length == 1) {
          // check this contact whether he is related to a valid company
          // we only accept request from our registered clients to avoid spam
          var contact = res.data[0];

          if (!contact.company_id) {
            showWarning(lang.warning_email_noregistered)
          }
          else {
            if (callback && typeof (callback) === "function") {
              callback();
            }
          }
        }
      }
      else if (res.statusCode == 400) {
        showWarning(lang.warning_email_format)
      }
    }
  })
}

// create ticket with given information
// extent the value via giving it more freshdesk resources
//
// value: pack the given information for a ticket
// redirectPage: which page to redirect to after submitting
function createTicket(value, redirectPage) {

  wx.request({
    url: HOST_URI + 'tickets',
    method: 'POST',

    data: {
      'subject': value.subject,
      'description': value.description,
      'email': value.email,
      'priority': 1,
      'status': 2,
      // attachment currently available, why? - with curl is ok
      //'attachments[0]': that.data.attachments
    },

    header: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + API_KEY
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
            wx.redirectTo({ url: redirectPage });
          }
        })
      }
      else if (res.statusCode == 400) {
        showWarning(lang.warning_email_format)
      }
      else {
        showWarning(res.statusCode + ': ' + lang.warning_unknown)
      }
    },

    fail: function (res) {
      showWarning(res.statusCode + ': ' + lang.warning_unknown)
    }
  });
}

//---------------------------------------------------------------------------------------
// NOTE: weapp does NOT support multi-lingual. This is just a temperily workaround
// 
// fixed translated text
//---------------------------------------------------------------------------------------

function reloadLang() {
  lang.email_label = _('Email:')
  lang.email_placeholder = _('Your personal email or NavVis portal email')

  lang.subject_label = _('Subject:')
  lang.subject_placeholder = _('Brief summary')

  lang.description_label = _('Description:')
  lang.description_placeholder = _('Issue description in detail')

  lang.submitbtn_text = _('Submit')

  lang.warning_box_title = _('Warning')
  lang.warning_box_confirm = _('OK')

  lang.warning_email_nofound = _('Sorry, but we did not find your email in our system, please contact NavVis support')
  lang.warning_email_noregistered = _('Your are not yet registered in our system, please contact NavVis support')
  lang.warning_email_format = _('Email format is wrong, would you like to check it again?')
  lang.warning_unknown = _('Unknown error, please contact NavVis support')

  lang.submit_waiting = _('Submitting...')

  lang.lang_picker = _('Choose Your Language:')
  lang.lang_picker_placeholder = _('Language:')

  lang.submit_success = _('Your request is successfully submitted! Our support staff would contact you soon!')
}

module.exports = {
  checkContact: checkContact,
  createTicket: createTicket,
  reloadLang: reloadLang,
  lang: lang
}

reloadLang();
