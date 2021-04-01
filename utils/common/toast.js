let showToast = function(res) {
  if (!res || typeof res !== 'object') {
    res = {message: res}
  }
  uni.showToast({
    title: res.message || '网络出小差了',
    duration: res.duration || 2000,
    icon: res.icon || 'none',
    mask: res.mask || false,
    position: res.position || 'center'
  });
}

export default showToast;