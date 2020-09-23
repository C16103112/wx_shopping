// pages/goos_detail/index.js
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    //商品是否被收藏
    isCollect:false
  },
  GoodsInfo:{},
 

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {

    let pages = getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;

    const {goods_id} = options;
    // console.log(goods_id);
    this.getGoodsDetail(goods_id);

  },
  //获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj=await request({url:"/goods/detail",data:{goods_id}});
    
    this.GoodsInfo = goodsObj;
    //获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync('collect')||[];
    //判断是否被收藏了
    let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        goods_introduce:goodsObj.goods_introduce,
        pics:goodsObj.pics
      },
      isCollect
    })
    // console.log(goodsObj);
  },

  //点击查看轮播图大图
  handlePrevewImage(e){
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      urls,
      current
    })
  },
  //点击加入购物车
  handleCartAdd(){
    let cart = wx.getStorageSync("cart")||[];

    let index = cart.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id);
    if(index===-1){
      //不存在第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    }else{
      //已经存在购物车数据 执行 num++
      cart[index].num++;
    }
    //将购物车重新添加回缓存中
    wx.setStorageSync('cart', cart);
    //弹窗提示
    wx.showToast({
      title: '加入成功',
      icon:'success',
      mask:true
    })
  },
  //点击收藏
  handleCollect(){
    const userinfo = wx.getStorageSync('userinfo');
    if(!userinfo){
      wx.showToast({
        title:"请先登录",
        icon:"none"
      });
      return;
    }
    let isCollect =false;
    let collect = wx.getStorageSync('collect')||[];
    //判断是否被收藏过
    let index =collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index!==-1){
      //存在数组中删除该商品
      collect.splice(index,1);
      isCollect =false;
      wx.showToast({
        title: '取消成功',
        icon:"success",
        mask:true
      })
    }else{
      //没有收藏过
      collect.push(this.GoodsInfo);
      isCollect =true;
      wx.showToast({
        title: '收藏成功',
        icon:"success",
        mask:true
      })
    }
    //把数组存入到缓存中
    wx.setStorageSync('collect', collect);
    //修改data中属性的值
    this.setData({
      isCollect
    })
  },
  //立即购买
  handleBuyGoods(){
    let cart = wx.getStorageSync("cart")||[];

    let index = cart.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id);
    if(index===-1){
      //不存在第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    }else{
      //已经存在购物车数据 执行 num++
      cart[index].num++;
    }
    //将购物车重新添加回缓存中
    wx.setStorageSync('cart', cart);
  }
})