
import{getSetting,chooseAddress,openSetting,showModal,showToast } from "../../utils/axyncWx.js";
import { request } from "../../request/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
    
  },
  onShow(){
    //获取缓存的收获地址信息
    const address = wx.getStorageSync('address');
    
    //获取缓存中购物车的数据
    let cart = wx.getStorageSync('cart')||[];
    //过滤后的购物车信息
    cart = cart.filter(v=>v.checked);
    
    this.setData({address});
   
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{    
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
    })
    
    this.setData({
      cart,
      totalPrice,totalNum,
      address
    });
    
 },
 //点击支付
 async handleOrderPay(){
  let newCart = wx.getStorageSync('cart');
  

  const order =newCart.filter(v=>v.checked);
  const y = new Date().getFullYear();
  const M = new Date().getMonth()+1;
  const d = new Date().getDate();
  const h = new Date().getHours();
  const m = new Date().getMinutes();
  const s = new Date().getSeconds();
  const myDate = y + "-" + M + "-" + d + " " + h + ":" +m+ ":"+ s;
  const time = "time";
  order[0][time]=myDate;
  wx.setStorageSync('order', order);
  newCart=newCart.filter(v=>!v.checked);
  wx.setStorageSync('cart', newCart);
  wx.navigateTo({
    url: '/pages/order/index?type=1',
  })

 }
})
