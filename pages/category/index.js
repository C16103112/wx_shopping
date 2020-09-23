
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList:[],
    //右侧的商品数据
    rightContent:[],
    //被点击左侧的菜单
    currentIndex:0,
    //右侧商品滚动条的距离
    scrollTop:0
  },
  //接口的返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //本地存储数据
    const Cates = wx.getStorageSync('cates');
    if(!Cates){
      this.getCates();
    }else{
      // 判断是否过期
      if(Date.now()-Cates.time>10000){
        this.getCates();
      }else{
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children; 
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
    
  },

  //获取分类数据
  async getCates(){
    
    const res = await request({url:"/categories"});
      
      this.Cates = res;

      //把接口数据存入到本地存储中
      wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})

      //左侧数据
      let leftMenuList = this.Cates.map(v => v.cat_name);
      let rightContent = this.Cates[0].children;

      this.setData({
        leftMenuList,
        rightContent
      })
    },
  //左侧菜单的点击事件
  handleItemtemTap(e){
    const {index} = e.currentTarget.dataset;

    let rightContent = this.Cates[index].children;

    this.setData({
      currentIndex:index,
      rightContent,
      //重新设置右侧内容距离顶部的距离
      scrollTop:0

    })
  }
})