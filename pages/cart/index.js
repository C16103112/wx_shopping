
import{getSetting,chooseAddress,openSetting,showModal,showToast } from "../../utils/axyncWx.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //获取缓存的收获地址信息
    const address = wx.getStorageSync('address');
    //获取缓存中购物车的数据
    const cart = wx.getStorageSync('cart')||[];
    // const detail = wx.getStorageSync('detail')||[];
    // cart[cart.length] =  detail;
    
    this.setData({address});
    this.setCart(cart);
  },
  //点击 获取收货地址
  async hangleChooseAdress(){   
      try {  
      //1 获取权限状态
      const res1=await getSetting();
      const scopeAddress= res1.authSetting["scope.address"];
      //2判断权限状态
      if(scopeAddress===false){
        await openSetting();
      }
      let address =await chooseAddress();
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
      //存入缓存
      wx.setStorageSync('address', address);
    }   
   catch (error) {
    console.log(error);
  }
  // 1获取权限状态
  // wx.getSetting({
  //  success: (res) => {
  //     const scopeAddress= res.authSetting["scope.address"];
  //     if(scopeAddress===true||scopeAddress===undefined){
  //       wx.chooseAddress({
  //        success: (res1) => {
  //          console.log(res1);
  //         },
  //       });
  //     }else{
  //      //用户曾经拒绝过授予权限
  //      wx.openSetting({
  //         success: (res2) => {
  //          wx.chooseAddress({
  //             success: (res3) => {
  //              console.log(res3);
  //            },
  //          });
  //         },
  //      })
  //     }
  //   },
  // })
 },
 //商品的选中
 handeItemChange(e){
   //获取被修改的商品ID
   const goods_id = e.currentTarget.dataset.id;
   //获取购物车数组
   let {cart} = this.data;
   //找到被修改的商品对象
   let index=cart.findIndex(v=>v.goods_id===goods_id);
   //选中取反
   cart[index].checked=!cart[index].checked;
   
   this.setCart(cart);
 },
 //设置购物车相关状态 重新计算 全选 等
 setCart(cart){
   let allChecked = true;
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    })
    //判断数组是否为空
    allChecked=cart.length!=0?allChecked:false;
    
    this.setData({
      cart,
      allChecked,totalPrice,totalNum
    });
    //把购物车数据重新设置回data和缓存中
    wx.setStorageSync('cart', cart);
 },
 //商品的权限功能
 handleItemAllCheck(){
   //获取data中的数据
   let {cart}=this.data;
   let {allChecked}=this.data;
   //修改值
   allChecked=!allChecked;
   //循环修改cart数组中商品选中状态
   cart.forEach(v=>v.checked=allChecked);
   //把修改后的值 填充会data 缓存中
   this.setCart(cart);
 },
 //商品数量功能
  async handleItemNumEdit(e){
   //接收数据
  const {operation,id} = e.currentTarget.dataset;
  //获取购物车数组
  let {cart}=this.data;
  //找到需要修改商品的索引
  const index=cart.findIndex(v=>v.goods_id===id);
  //判断是否删除
  if(cart[index].num===1&&operation===-1){

    const res=await showModal({content:"您是否要删除？"});
    if(res.confirm){
      cart.splice(index,1);
      this.setCart(cart);
    }

  }else{
    //进行修改数量
    cart[index].num+=operation;
    //设置回缓存和data中
    this.setCart(cart);
  }

 },

 //点击结算功能
 async handlePay(){
   //判断收获地址
   const {address,totalNum} = this.data;
   if(!address.userName){
    await showToast({title:"您还没选择收货地址"});
    return;
   }
   //判断有没有选购商品
   if(totalNum===0){
     await showToast({title:"您还没选购商品"});
     return;
   }
   //判断是否登录
   const userinfo = wx.getStorageSync('userinfo');

   if(!userinfo){
    
    wx.navigateTo({
      
      url: '/pages/login/index',
    });
    await showToast({title:"您还没登录"});
    return;
   }
   
   //跳转支付页面
   wx.navigateTo({
     url: '/pages/pay/index',
   });

 }
})