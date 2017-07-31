Page({
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
    index: 0
  },

  languageBindPickerChange: function (e) {

    console.log('picker changed with value:', e.detail.value)

    this.setData({
      index: e.detail.value
    })

    // load language js
    if (e.detail.value == 0) {
      require("../../language/lang.zh.js")
    }
    else if (e.detail.value == 1) {
      require("../../language/lang.en.js")
    }
    //console.log(lang.tabBarTitleText)
    console.log(lang.en.name);
    //wx.setNavigationBarTitle({
    //  title: lang.tabBarTitleText
    //})
  }
})