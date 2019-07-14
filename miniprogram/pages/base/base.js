//初始化数据库
const db = wx.cloud.database();

// pages/base/base.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:0,
    images: []
  },

  add: function(){
    this.setData({
      count: this.data.count+1
    })
  },

  insert: function(){
    db.collection('user').add({
      data: {
        name:'john',
        age: 10
      }
    }).then(res => {
      console.log(res)
     }).catch(err => {
       console.log(err)
      })
  },

  update: function(){
    db.collection('user').doc   ('3e1ef27b5d2b628f079a063b62b843f9').update({
      data: {
        age: 18
      }
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },

  remove: function(){
    db.collection('user').doc('f1006ad85d2b64e9079b40fb75a0fbdc').remove().then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },

  search: function(){
    db.collection('user').where({
      name:'jerry'
    }).get().then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },

// 云函数调用

sum: function(){
  wx.cloud.callFunction({
    name: 'sum',
    data: {
      a: 2,
      b: 3
    }
  }).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  })
},


getId: function(){
  wx.cloud.callFunction({
    name: 'login'
  }).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  })
},


batchDelete: function(){
  wx.cloud.callFunction({
    name: 'batchDelete'
  }).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  })
},

//云储存函数

//上传文件
upload: function(){
  wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      // tempFilePath可以作为img标签的src属性显示图片
      const tempFilePaths = res.tempFilePaths;
      console.log(tempFilePaths);
      wx.cloud.uploadFile({
        cloudPath: new Date().getTime() + '.png',
        filePath: tempFilePaths[0], // 文件路径
      }).then(res => {
        // get resource ID
        console.log(res.fileID);
        db.collection('images').add({
          data: {
            fileID: res.fileID
          }
        }).then(res => {
          console.log(res)
          wx.showToast({
            title: '上传成功',
          })
        }).catch(err => {
          console.log(err)
        })
      }).catch(error => {
        // handle error
      })
    }
  })
},

  //图片展示
  getFile: function () {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      // console.log(res)
      db.collection('images').where({
        _openid: res.result.openid
      }).get().then(res2 => {
        console.log(res2)
        this.setData({
          images: res2.data
        })
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
  },



//下载文件

download: function(event){
  wx.cloud.downloadFile({
    fileID: event.target.dataset.fileid
  }).then(res => {
    // get temp file path
    console.log(res.tempFilePath)
    wx.saveImageToPhotosAlbum({
      filePath: res.tempFilePath,
      success(res) {
        wx.showToast({
          title: '保存成功',
        })
       }
    })
  }).catch(error => {
    // handle error
  })
},





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})