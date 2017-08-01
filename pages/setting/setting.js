import event from '../../utils/event.js'

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

  onLoad() {
    event.on("LangChanged", this, this.setLang)
    this.setLang()
  },

  setLang() {
    const _ = wx.T._
    this.setData({
      lang_picker: _('Choose Your Language:'),
      lang_picker_placeholder: _('Language:')
    })

    // tabbar and tab titles are currently not able to modify
    // need to hard-code them
    wx.setNavigationBarTitle({
      title: _('NavVis Support System')
    })
  },

  languageBindPickerChange: function (e) {

    console.log('picker changed with value:', e.detail.value)

    this.setData({
      index: e.detail.value
    })

    var lang = 'zh';

    if (e.detail.value == 0) {
      lang = 'zh'
    }
    else if (e.detail.value == 1) {
      lang = 'en'
    }
    else {
      throw('something went wrong, please contact NavVis support')
    }

    // load language js
    const _ = wx.T._
    wx.T.setLocale(lang)
    event.emit('LangChanged', lang)
  }
})