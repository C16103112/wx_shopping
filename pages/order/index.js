// pages/order/index.js
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:[],
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true,
        
      },
      {
        id:1,
        value:"待付款",
        isActive:false,
        
      },
      {
        id:2,
        value:"待发货",
        isActive:false,
        
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false,
        
      }
    ],
  },
 
  onReady(){
    const order = wx.getStorageSync('order');
    
    
    console.log(order);
    this.setData({
      order
    })
  },
  onShow(options){
    let pages = getCurrentPages();
    
    let currentPage = pages[pages.length-1];
    
    const { type }= currentPage.options;

    this.changeTitleByIndex(type-1);
    this.getOrders(type);
  },
  async getOrders(type){
    let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
    const header={Authorization:token};

    const res=await request({url:"/my/orders/all",data:{type},header});
    
  },

  //根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
    
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);

    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e){ 
    const {index}  = e.detail;


    this.changeTitleByIndex(index);
    this.getOrders(index+1);
  }


})