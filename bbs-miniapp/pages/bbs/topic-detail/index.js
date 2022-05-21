// pages/topic-detail/index.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic: {},
    isLike: false,
    isFollow: false,
    isCollect: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id: id
    })
    this.getDetail(options.id)
    
    this.isLike(id);
    this.isCollect(id);
  },

  showImg(e){
    var pics = this.data.topic.picUrls;
    var pic = e.currentTarget.dataset.pic;
    wx.previewImage({
      urls: pics,
      current: pic
    })
  },

  isLike: function(id){
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/topic/isLike',
      data: {
        topicId: id,
        token: app.globalData.token
      },
      success: function (res) {
        if(res.data.code == 0){
          that.setData({
            isLike: true
          });
        }
        
      }
    })
  },

  isCollect: function(id){
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/collect/isCollect',
      data: {
        topicId: id,
        token: app.globalData.token
      },
      success: function (res) {
        if(res.data.code == 0){
          that.setData({
            isCollect: true
          });
        }
        
      }
    })
  },

  isFollow: function(memberId){
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/topic/isFollow',
      data: {
        uId: memberId,
        token: app.globalData.token
      },
      success: function (res) {
        if(res.data.code == 0){
          that.setData({
            isFollow: true
          });
        }
        
      }
    })
  },

  getDetail: function(id){
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/topic/detail',
      data: {
        id: id,
        token: app.globalData.token
      },
      success: function (res) {
        that.setData({
          topic: res.data.topic
        });
        that.isFollow(res.data.topic.member.id);
      }
    })
  },

  //关注
  follow: function () {
    var that = this
    var topic = this.data.topic;
    var uId = topic.memberId;
    var url = "/api/topic/follow";
    if(this.data.isFollow){
      url = "/api/topic/unfollow";
    }
    wx.showLoading();
    wx.request({
      url: app.globalData.domain + url,
      data: {
        uId: uId,
        token: app.globalData.token
      },
      success: function (res) {
        if(res.data.code == 0){
          that.setData({
            isFollow: !that.data.isFollow
          })
        }
      },
      complete: function(res){
        wx.hideLoading();
      }
    })
  },

  collect: function () {
    var that = this
    // 判断原来是否收藏，是则删除，否则添加
    var id = this.data.topic.id;
    var url = "/api/collect/save";
    if(this.data.isCollect){
      url = "/api/collect/uncollect";
    }
    wx.showLoading();
    wx.request({
      url: app.globalData.domain + url,
      data: {
        topicId: id,
        token: app.globalData.token
      },
      success: function (res) {
        if(res.data.code == 0){
          that.setData({
            isCollect: !that.data.isCollect
          })
        }
      },
      complete: function(res){
        wx.hideLoading();
      }
    })
  },

  comment: function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/bbs/comment/index?id='+id,
    })
  },

  commentList: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/comment-list/index?id=' + id,
    })
  },

  getCommentList: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/reply/list',
      data: {
        topicId: that.data.id
      },
      success: function (res) {
        that.setData({
          replyList: res.data.replyList
        })
      }
    })
  },

  liked: function(e){
    var topic = this.data.topic;
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showLoading();
    wx.request({
      url: app.globalData.domain + '/api/topic/like',
      data: {
        topicId: id,
        token: app.globalData.token
      },
      success: function (res) {
        if(res.data.code == 0){
          that.setData({
            isLike: true
          })
        }
      },
      complete: function(res){
        wx.hideLoading();
      }
    })
  },

  unliked: function (e) {
    var topic = this.data.topic;
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showLoading();
    wx.request({
      url: app.globalData.domain + '/api/topic/unlike',
      data: {
        topicId: id,
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            isLike: false
          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },

  share: function(){

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCommentList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var path = '/pages/topic-detail/index?id=' + this.data.topic.id;
    return {
      title: this.data.topic.title,
      path: path,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})