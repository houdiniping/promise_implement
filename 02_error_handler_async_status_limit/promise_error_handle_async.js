/*
1. error handler
2. async
3. status limit
 */
const STATUS = {
  PENDING: 'pending',
  FULLFILL: 'fullfill',
  REJECT: 'reject'
}
class Promise {
  constructor(executor){
    this.status = STATUS.PENDING
    this.values = undefined // 成功函数的值
    this.reason = undefined // 失败函数的值
    this.onFullfilledCallbacks = [] // 保存成功回调
    this.onRejectedCallbacks = [] // 保存失败回调

    const resolve = (data) => { // 需要用箭头函数或者绑定 this 的 function
      if(this.status === STATUS.PENDING){
        // case1: 保证状态只能发生一次变更, 不能先调用 resolve, 后调用 reject
        this.status = STATUS.FULLFILL
        this.values = data
        this.onFullfilledCallbacks.forEach(fn => fn())
      }
    }

    const reject = (reason) => {
      if(this.status === STATUS.PENDING){
        this.status = STATUS.REJECT
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFullfilled, onRejected){
    if(this.status === STATUS.FULLFILL){
      onFullfilled(this.values)
    }

    if(this.status === STATUS.REJECT){
      onRejected(this.reason)
    }

    if(this.status === STATUS.PENDING){
      this.onFullfilledCallbacks.push(() => {
        onFullfilled(this.values)
      })

      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}

module.exports = Promise