/*
  basic resolve reject then functionality
 */
const STATUS = {
  PENDING: 'pending',
  FULLFILL: 'fullfill',
  REJECT: 'reject'
}
// 无状态判断, 不支持异步，executor 中报错无法 reject 出来
class Promise {
  constructor(executor){
    this.status = STATUS.PENDING
    this.values = undefined // 成功函数的值
    this.reason = undefined // 失败函数的值

    // 调用 resolve 更改 promise 实例状态
    const resolve = (data) => { // 需要用箭头函数或者绑定 this 的 function
      this.status = STATUS.FULLFILL
      this.values = data
    }

    // 调用 reject 更改 promise 实例状态
    const reject = (reason) => {
      this.status = STATUS.REJECT
      this.reason = reason
    }

    // executor 函数可能报错，需要捕获并通过 reject 返回错误
    executor(resolve, reject)
  }

  then(onFullfilled, onRejected){
    if(this.status === STATUS.FULLFILL){
      // 成功态
      onFullfilled(this.values)
    }
    if(this.status === STATUS.REJECT){
      // 失败态
      onRejected(this.reason)
    }
  }
}

module.exports = Promise