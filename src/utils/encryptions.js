import md5 from 'js-md5';
function md5_post (str) {
  // console.log(strvalue)
  let strlist = 'timestamp=' + str + '&token='

  // var keyvalue = md5(strlist).toUpperCase()
  var keyvalue = md5(strlist)
  // console.log(keyvalue)
  return keyvalue;
}


export {
  md5_post
}