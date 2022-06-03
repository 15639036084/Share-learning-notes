// pages/publish/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrls: [],
    title: '',
    opacity: '0.4',
    width: '85',
    position: 'center',
    categoryList: [],
    categoryIndex: 0,
    categoryNames: [],
    videoUrl: '',
    anonymous: 0
  },

  anonymousChange(e){
    this.setData({
      anonymous: e.detail.value
    })
  },

  getCategoryList: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/category/list',
      data: {
        token: app.globalData.token
      },
      success: (res) => {
        if (res.data.code == 0) {
          var categoryNames = [];
          for (var i = 0; i < res.data.categoryList.length; i++) {
            categoryNames.push(res.data.categoryList[i].categoryName);
          }

          that.setData({
            categoryList: res.data.categoryList,
            categoryNames: categoryNames
          });
        } else {

        }
      }
    })
  },

  bindCategoryChange: function (e) {
    this.setData({
      categoryIndex: e.detail.value
    })
  },

  saveArticle: function(e) {
    var that = this;
    var title = e.detail.value.title;
    if (title == '') {
      wx.showToast({
        title: '请填写笔记',
        icon: 'none'
      })
      return;
    }

    if (that.data.picUrls.length == 0) {
      wx.showToast({
        title: '请上传图片',
        icon: 'none'
      })
      return;
    }

    
    var topic = {
      title: title,
      picUrls: that.data.picUrls,
      content: e.detail.value.content,
      categoryId: that.data.categoryList[that.data.categoryIndex].id,
      videoUrl: that.data.videoUrl,
      anonymous: that.data.anonymous
    };

    var action = "save";
    wx.showLoading({
      title: '正在提交',
    })
    wx.request({
      url: app.globalData.domain + '/api/topic/' + action,
      header: {
        token: app.globalData.token
      },
      method: "POST",
      data: topic,
      success: (res) => {
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            content: "发布成功",
            showCancel: false,
            success: function(res){
              that.setData({
                picUrls: []
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          })
        }

      },
      complete: function(res) {
        wx.hideLoading();
      }
    })
  },

  chooseVideo: function(e) {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: 'true',
      maxDuration: 60,
      success: function(res) {
        console.log(res)

        wx.uploadFile({
          url: app.globalData.domain + '/api/fileupload/upload',
          filePath: res.tempFilePath,
          name: 'file',
          formData: {
            imageType: "goodsVideo"
          },
          success: function(res) {
            var data = JSON.parse(res.data);
            if (data.code == 0) {
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                videoUrl: data.url
              })
            }
          }
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

        wx.uploadFile({
          url: app.globalData.domain + '/api/fileupload/upload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            imageType: "goodsImage"
          },
          success: function(res) {
            var data = JSON.parse(res.data);
            if (data.code == 0) {
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })
              var picUrls = that.data.picUrls;
              picUrls.push(data.url);

              that.setData({
                picUrls: picUrls
              })
            }
          },
          fail: function(res) {
            wx.showToast({
              title: '上传失败',
              duration: 2000
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCategoryList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!app.globalData.token) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
      return;
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getUserInfo: function(res) {
    var that = this;
    if (res.detail.errMsg == "getUserInfo:ok") {
      app.login(function(res) {
        console.log(res)
        that.setData({
          dialogvisible: false
        })
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }
})