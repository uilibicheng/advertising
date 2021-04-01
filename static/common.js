import constants from '../config/constants'
let appid = constants.APPID;
let rootUrl = constants.ROOT_URL;
export default{

    getUrlKey: function (name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
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
   
    
	toManage:function(redirect_uri){
	    location.href="https:/\/open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&response_type=code&scope=snsapi_userinfo&redirect_uri="+rootUrl+redirect_uri+"&state=STATE#wechat_redirect";
	},

    formatDate: function (value) {
      console.log("value="+value);
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

    dateFormat:function(val,fm){//val时间戳 fm时间格式如yyyy-MM-dd hh:mm:ss
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
    selectPng:function(value){
      if(value==1){//未选中
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJCMjZEQTQ1QURGMTExRTlCMkZFRDkzMkU5MUI4MTY4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJCMjZEQTQ2QURGMTExRTlCMkZFRDkzMkU5MUI4MTY4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkIyNkRBNDNBREYxMTFFOUIyRkVEOTMyRTkxQjgxNjgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkIyNkRBNDRBREYxMTFFOUIyRkVEOTMyRTkxQjgxNjgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4QyWDCAAAB30lEQVR42uzZP0vDQBQA8HeX2Bak/qtu1kWH0g9Q1EVpEezgJvUjFD+Ruusibg6CoiiiiB/Aduhki4tUaovQP2nie9ckTSOiS8wJ9+D1uGuGX14uGd4xy7LAH93yQRaHHUwaFzAjEGx0MZ8xrzCPI6nipf8C5oUiMIXDHuY6hBvXmLsILn+BInINh1PMOMgRLcwtxN64ULuSD5iTAz4HbSoNfGIJWHQGgI8FSzJ7YHXewGxWoN94ArBM5593zGWqLOuU9hlO7mlBGPVx0Oc3gcVmQymj1a6DUTsDy/hwlqiAqxx/cg4SmIbIfGhIQYglQE/mhcUOsuUIWnBWtOm0uDDsYNGEsHiiwO1PkAgeXwRZwmfJEjQ5LPucNFDf9kvykY854yCPVPPOIhLJftgKCqqgCqqgCqqgCqqgCqqgCqqgCqqgfwptubNhFy38MHveWZegL66z/SqNk9qQnqgR9NG9iWZFnoKOWu4IeuTM+o0S3kldgmrWhcUThwQ9h0GzFK/og1E9E83U0JDUyEUDWewg28UvWuMJfOX0gJ+zIar4TWt8JZIqlv7NYYP7HbUXMu42CDfIkHGQ4iH7D8SwsnT4sIG5DYP+PjV6Az4WATpZqGLeYp7QnkTkCOxTgAEAvhGoSo77hGsAAAAASUVORK5CYII=';
      }else if(value==2){//选中
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkMzQTM4RDM1QURGMTExRTlCQjk0RDhFQTNFODU0NEI5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkMzQTM4RDM2QURGMTExRTlCQjk0RDhFQTNFODU0NEI5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzNBMzhEMzNBREYxMTFFOUJCOTREOEVBM0U4NTQ0QjkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzNBMzhEMzRBREYxMTFFOUJCOTREOEVBM0U4NTQ0QjkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7NLcSVAAACOUlEQVR42tTZO0vDUBQH8JPbJj6gih0Uhyri0kFwE3GptDhKF6mzLuInUicXRRAXcVMUHwjSTRCqgouKOilVFNumiefERGpsYlJz7c2BPw1t2vzIfSWpVCosQp1KY6bN1z6MAnyrjLnG7GHWleTcrn0HyQZNYhYw49Dc2sfMI/jceoPVfJjC5AVAgmnIl8+XUnYonclNTAzEKbJsIjZpQSXMMqYTxCsyLSNWImgGMwriFtkyBM2B+JVj5hQkeqUJmggBNMH+YTIPohQGIaloMw8uRduBxYdBYjJUn85ALz2KB5XkGET7Jo1XY0LvGITy1RpA9b3u/kwE5KdEAdbW7fgdJgTSKB2b/kkMqBtSvT8AvfLSfOhvSK140fiol1riEOkaAl2rgPZ4Crr61hSkOzTSCnJ/1ujkxqmPDYB6veXaPP6R+4i89PQ7jk3P2nq+kO4H5I90hRojUNc8Hpgv0h1aeQb14dD4Yb/YoJG/jnrq5NTZ/WB5ID1NT36wvJCe51EvWJ5IXxclBpa+0Jsy7we/Y61tHkjfV09u2DrDMTBkQ0uoUzfgiWx4rXfHWsticMg/XZTUx3pfu/8N+hPLDxnIrYg1wKxtoW/ueAJrm/4FxK8yQe9CAL0laD4E0GOCroYAukLQbcyJwEiy7TBzEpzBFAVEkmlWSc7p1oRP/z5kBZsByJJFZMG+MtESMyJINyDDCCIPnCZ8OrNjmAnMFHw+36cHvTJn2CvmBnOE2aA+Sc1du8OHAAMAhzsXvEuTNikAAAAASUVORK5CYII=';
      }
    },
    digitLength: function(num) {
        // Get digit length of e
        var eSplit = num.toString().split(/[eE]/);
        var len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0));
        return len > 0 ? len : 0;
    },
    /**
     * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
     * @param {*number} num 输入数
     */
    float2Fixed: function(num) {
        if (num.toString().indexOf('e') === -1) {
            return Number(num.toString().replace('.', ''));
        }
        var dLen = this.digitLength(num);
        return dLen > 0 ? num * Math.pow(10, dLen) : num;
    },
    /**
     * 检测数字是否越界，如果越界给出提示
     * @param {*number} num 输入数
     */
    checkBoundary: function(num) {
        if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
            console.warn(num + " is beyond boundary when transfer to integer, the results may not be accurate");
        }
    },
    /**
     * 精确乘法
     */
    times: function(num1, num2) {
        var others = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            others[_i - 2] = arguments[_i];
        }
        if (others.length > 0) {
            return times.apply(void 0, [this.times(num1, num2), others[0]].concat(others.slice(1)));
        }
        var num1Changed = this.float2Fixed(num1);
        var num2Changed = this.float2Fixed(num2);
        var baseNum = this.digitLength(num1) + this.digitLength(num2);
        var leftValue = num1Changed * num2Changed;
        this.checkBoundary(leftValue);
        return leftValue / Math.pow(10, baseNum);
    },
    /**
     * 精确加法
     */
    plus: function(num1, num2) {
        var others = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            others[_i - 2] = arguments[_i];
        }
        if (others.length > 0) {
            return plus.apply(void 0, [plus(num1, num2), others[0]].concat(others.slice(1)));
        }
        var baseNum = Math.pow(10, Math.max(this.digitLength(num1), this.digitLength(num2)));
        return (this.times(num1, baseNum) + this.times(num2, baseNum)) / baseNum;
    },
    /**
     * 精确减法
     */
    minus: function(num1, num2) {
        var others = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            others[_i - 2] = arguments[_i];
        }
        if (others.length > 0) {
            return minus.apply(void 0, [this.minus(num1, num2), others[0]].concat(others.slice(1)));
        }
        var baseNum = Math.pow(10, Math.max(this.digitLength(num1), this.digitLength(num2)));
        return (this.times(num1, baseNum) - this.times(num2, baseNum)) / baseNum;
    },
    /**
     * 精确除法
     */
    divide: function(num1, num2) {
        var others = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            others[_i - 2] = arguments[_i];
        }
        if (others.length > 0) {
            return divide.apply(void 0, [this.divide(num1, num2), others[0]].concat(others.slice(1)));
        }
        var num1Changed = this.float2Fixed(num1);
        var num2Changed = this.float2Fixed(num2);
        this.checkBoundary(num1Changed);
        this.checkBoundary(num2Changed);
        return this.times((num1Changed / num2Changed), Math.pow(10, this.digitLength(num2) - this.digitLength(num1)));
    },
}
