/*
 * 
 * WeApp NavVis Support
 * Author: YUAN GAO
 * Organization: NavVis GmbH
 * Wechat ID: gaoyuanhot
 * Copyright (c) 2017 https://www.navvis.com All rights reserved.
 */

// see freshdesk docs: https://developer.freshdesk.com/api/
var HOST_URI = 'https://solutionbuilder.freshdesk.com/api/v2/';

module.exports = {

  // find contact
  getContactViaEmail: function (email) {
    return HOST_URI + 'contacts/?email=' + email;
  }
};