// pages/goods_list/index.js
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]
  },
  //接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  //总页数
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid||"";
    this.QueryParams.query = options.query||"";
    
    this.getGoodsList();

  },

  //获取商品列表数据
  async getGoodsList(){
    const res = await request({url:"/goods/search",data:this.QueryParams});
    
    //获取总条数
    const total = res.total;
    //计算总页数
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize);
    console.log(this.totalPages);
    this.setData({
      //拼接数组
      goodsList:[...this.data.goodsList,...res.goods]
    })

    //关闭下拉刷新的窗口
    wx.stopPullDownRefresh();
  },


  //标题点击事件
  handleTabsItemChange(e){
    
    const {index}  = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);

    this.setData({
      tabs
    })
  },

  
  onPullDownRefresh: function () {
    this.setData({
      goodsList:[],    
    })

    this.QueryParams.pagenum=1;

    this.getGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.QueryParams.pagenum>=this.totalPages){
      wx.showToast({
        title: '没有下一页数据'
      })
    }else{ 
      this.QueryParams.pagenum++;
      this.getGoodsList();

    }
  },

})