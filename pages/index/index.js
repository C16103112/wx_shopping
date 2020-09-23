// 引入Promise方法  
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数组
    swiperList:[],
    //导航数组
    catesList:[],
    //楼层数据
    floorList:[],
    url:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // wx.request({
      //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
      //   success:(r) =>{
      //     console.log(r);
      //     this.setData({
      //       swiperList:r.data.message,          
      //     })         
      //   }
      // })
      this.getSwiperList();
      this.getCateList();
      this.getFloorList();
  },

  //获取轮播图数据
  getSwiperList(){
    request({url:"/home/swiperdata"})
    .then(result=>{
      for(let i=0;i<result.length;i++){
        result[i].navigator_url=result[i].navigator_url.replace("main","index");
      }
      
      

      this.setData({
          swiperList:result,       
        })
    })
  },

  //获取分类导航数组
  getCateList(){
    request({url:"/home/catitems"})
    .then(result=>{       
        this.setData({
          catesList:result,          
        })
    })
  },

  //获取楼层数据
  getFloorList(){
    request({url:"/home/floordata"})
    .then(result=>{
        for(let j=0;j<result.length;j++){
          for(let k=0;k<result[j].product_list.length;k++){
            result[j].product_list[k].navigator_url=result[j].product_list[k].navigator_url.replace("?","/index?");
          }
        }       
        
        this.setData({
          floorList:result,          
        })
    })
  },
})