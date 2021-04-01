import toast from './toast';
let prefix = "zck_";

let handleArr = function(arr) {
	if(Array.isArray(arr)) {
		return arr.map((obj) => {
			if(obj instanceof Object) return JSON.parse(JSON.stringify(obj));
		});
	} else {
		return arr;
	}
}

let removeDuplicatedItem = function(newArr,oldArr) {
    var result = [];
    var src = (newArr || []).concat(oldArr || []);
    for (let i = 0; i < src.length; i++) {
      if (result.indexOf(src[i]) == -1){
        result.push(src[i]);
      }
    }
    return result;
};

let cache = {
	/**
	 * keys 的格式可以为  key1.key2.key3
	 * 假设有 key1:{key2:{key3:"out"}}
	 * 则get("key1.key2.key3") 输出 out
	 * */
	get:function(keys,def){
	    let self = this;
	    keys = prefix+keys;
	    let arrKey = keys.split(".");
	    let values = "";
	    if(arrKey.length == 1){
	    	try {
	    		values = uni.getStorageSync(keys);
	    	} catch (e) {
				console.error('local.js cache.get 获取缓存出错了 ', e);
				toast('服务异常，请重试，状态2');
	    	}
	        if(values == "undefined" || values == null || values == ""){
	        	return handleArr(def);
	        }
	        return JSON.parse(values);
	    }
	    for(var i=0;i<arrKey.length;i++){
	        var key = arrKey[i];
	        if(i==0){
	        	try {
	        		values = uni.getStorageSync(key) || "{}";
	        		values = JSON.parse(values);
	        	} catch (e) {
					console.error('local.js cache.get 获取缓存出错了 ', e);
					toast('服务异常，请重试，状态2');
	        	}
	            
	        }else if(i==arrKey.length-1){
	            if(typeof values[key] == "undefined" || values[key] == null){
	            	return handleArr(def);
	            }
	            return values[key];
	        }else{
	            values = values[key] || {};
	        }
	    }
	},
	set:function(keys,value){
	    let self = this;
	    keys = prefix+keys;
	    let arrKey = keys.split(".");
	    if(arrKey.length == 1){
	    	try{
	    		// 先删除再赋值
	    		uni.removeStorageSync(keys);
	    		return uni.setStorageSync(keys, JSON.stringify(value));
	    	} catch (e) {
				console.error('local.js cache.set 设置缓存出错了 ', e);
				toast('服务异常，请重试，状态1');
	    	}
	    }
	    let values = "";
	    let nextValue = {};
	    let firstKey = "";
	    for(let i=0;i<arrKey.length;i++){
	        let key = arrKey[i];
	        if(i==0){
	            firstKey = key;
	            try{
	            	values = uni.getStorageSync(key) || "{}";
	            	values = JSON.parse(values);
	            } catch (e) {
					console.error('local.js cache.set 设置缓存出错了 ', e);
					toast('服务异常，请重试，状态1');
	            }
	            nextValue = values;
	        }else if(i==arrKey.length-1){
	            nextValue[key] = value;
	            try{
	            	// 先删除再赋值
	            	uni.removeStorageSync(firstKey);
	            	uni.setStorageSync(firstKey, JSON.stringify(values));
	            } catch (e) {
					console.error('local.js cache.set 设置缓存出错了 ', e);
					toast('服务异常，请重试，状态1');
	            }
	        }else{
	            nextValue[key] || (nextValue[key] = {});
	            nextValue = nextValue[key];
	        }
	    }
	},
	remove:function(keys){
	    let self = this;
	    if(!keys){
	        return;
	    }
	    let arrKey = keys.split(".");
	    if(arrKey.length == 1){
	    	try{
	    		uni.removeStorageSync(prefix+keys);
	    	} catch(e) {
				console.error('local.js cache.remove 删除缓存出错了 ', e);
				toast('服务异常，请重试，状态3');
	    	}
	        return true;
	    }
	    let values = "";
	    let nextValue = {};
	    let firstKey = "";
	    for(let i=0;i<arrKey.length;i++){
	        let key = arrKey[i];
	        if(i==0){
	            firstKey = prefix+key;
	            try{
	            	values = uni.getStorageSync(key) || "{}";
	            	values = JSON.parse(values);
	            } catch(e) {
					console.error('local.js cache.remove 删除缓存出错了 ', e);
					toast('服务异常，请重试，状态3');
	            }
	            nextValue = values;
	        }else if(i==arrKey.length-1){
	            delete nextValue[key];
	            try{
	            	// 先删除再赋值
	            	uni.removeStorageSync(firstKey);
	            	uni.setStorageSync(firstKey, JSON.stringify(values));
	            } catch(e) {
					console.error('local.js cache.remove 删除缓存出错了 ', e);
					toast('服务异常，请重试，状态3');
	            }
	        }else{
	            nextValue[key] || (nextValue[key] = {});
	            nextValue = nextValue[key];
	        }
	    }
	}
}

let local = {
	get:function(keys,def){
	    if(Object.prototype.toString.call(keys) == "[object Array]"){
	        keys = keys.join(".");
	    }
	    return cache.get(keys,def);
	},
	set:function(keys,value){
	    let self = this;
	    if(Object.prototype.toString.call(keys) == "[object Array]"){
	        keys = keys.join(".");
	    }
	    cache.set(keys,value);
	    return self;
	},
	remove:function(keys){
	    let self = this;
	    if(Object.prototype.toString.call(keys) == "[object Array]"){
	        keys = keys.join(".");
	    }
	    cache.remove(keys);
	    return self;
	},
	push: function(key, value) {
		let list = this.get(key) || [];
		if(Object.prototype.toString.call(list) !== "[object Array]"){
			return list;
		}
		if(Object.prototype.toString.call(value) !== "[object Array]"){
			value = [value];
		}
		list = removeDuplicatedItem(value, list);

		this.set(key, list.slice(0, 10));
		
	}
}
export default local;