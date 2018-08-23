export const getQueryStr = (name) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  } else {
    return null
  }
}

export const dealVal = (val) => {
  let result = 0
  if (val) {
    val = Math.floor(val / Math.pow(10, 4)) / Math.pow(10,4)
    val = val.toFixed(4)
    if (!isNaN(val)) {
      result = val
    }
  }
  return result
}



