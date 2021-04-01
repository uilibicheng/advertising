import constants from '../../config/constants'

let appid = constants.APPID;
let rootUrl = constants.ROOT_URL;

export default {
  toManage:function(redirect_uri){
    let url = encodeURIComponent(rootUrl+redirect_uri)
    location.href="https:/\/open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&response_type=code&scope=snsapi_userinfo&redirect_uri="+url+"&state=STATE#wechat_redirect"
  },

  formatDate: function (value) {
    var dataValue = JSON.parse(value);
    var date = new Date(dataValue*1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
     return Y+M+D+h+m+s;
  },

  floatNumber: function(val) {
    if (!val) val = 0
    var value = Math.floor(parseFloat(val) * 100) / 100;
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
      value = value.toString() + ".00";
      return value;
    }
    if (xsd.length > 1) {
      if (xsd[1].length < 2) {
        value = value.toString() + "0";
      }
      return value;
    }
  },

  dateFormat: function(val,fm) {//val时间戳 fm时间格式如yyyy-MM-dd hh:mm:ss
    if(!val) return;
    if(String(val).length<13) val=val*1000;
    var date = new Date(val),
      o = {
        "M+" : date.getMonth()+1, //month
        "d+" : date.getDate(), //day
        "h+" : date.getHours(), //hour
        "m+" : date.getMinutes(), //minute
        "s+" : date.getSeconds(), //second
        "q+" : Math.floor((date.getMonth()+3)/3), //quarter
        "S" : date.getMilliseconds() //millisecond
      },
      format = fm || 'yyyy-MM-dd';
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
    (date.getFullYear()+"").substr(4- RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
    format = format.replace(RegExp.$1,
    RegExp.$1.length==1? o[k] :
    ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
  },
}
