// pages/search/index.js
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    //按钮是否隐藏
    isButton:false,
    //接收value值
    value:""
  },
  TimeId:-1,
  //input事件
  handleinput(e){
    const {value} = e.detail;
    console.log(value);
    if(!value.trim()){
      //值不合法
      this.setData({
        goods:[],
        isButton:false
      })
      return;
      
    }
    this.setData({
      isButton:true
    })
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(()=>{
      this.qsearch(value);
    },1000);
    
  },
  //发送请求
  async qsearch(query){
    const res=await request({url:"/goods/qsearch",data:{query}});
    // console.log(res);
    this.setData({
      goods:res
    })
  },
  //点击取消
  handlebtn(){
    this.setData({
      isButton:false,
      value:"",
      goods:[],
    })
  }

})