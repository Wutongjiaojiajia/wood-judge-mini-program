const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 校验金额正则表达式
const validateCorrectMoney = (num) => {
  let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
  return reg.test(num);
}

export default {
  formatTime,
  validateCorrectMoney
}
