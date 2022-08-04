function resolvePromise(promise2, x, resolve, reject){
  // 保证所有人的 Promise 都可以互相调用
  // If promise and x refer to the same object, reject promise with a TypeError as the reason.
  // [TypeError: Chain cycle detected for promsie #<Promise>]
  if(promise2 === x) return  reject(new TypeError('Chain cycle detected for promsie #<Promise>'))

  let called = false; // 防止其它人的 Promise 没有做状态屏蔽
  if((typeof x === 'object' && x !== null) || typeof x === 'function'){
    // x 是第二个 promise then 函数里面函数的返回值
    // promise2.then(() => x)
    try {
      let then = x.then // 拿 then 方法可能报错 Object.defineProperty(x, 'then', { get(){ throw new Error}})
      if(typeof then === 'function') { // 是 promise {then: function(){}} 也会被当做 promise
        then.call(x, y => { // 这里为啥不用 x.then 因为可能走到 get 报错
          // y 返回的 promise，promise 的 resolve 值
          if(called) return
          called = true // 防止返回的 Promise 里头又调 resolve 又调 reject
          resolvePromise(promise2, y, resolve, reject) // 递归解析返回的 Promise
        }, r => {
          if(called) return
          called = true
          reject(r)
        })
      } else {
        // 是对象或函数 { a: 1 } 且不是 thenable
        // 为啥这里不控制
        resolve(x)
      }
    } catch (error) {
      // 2.3.3 case here
      if(called) return
      called = true
      reject(error)
    }
  } else {
    resolve(x) // x 是普通值，直接返回
  }
}
// 链式调用
const STATUS = {
  PENDING: 'pending',
  FULLFILL: 'fullfill',
  REJECT: 'reject'
}
class Promise {
  constructor(executor){
    this.status = STATUS.PENDING
    this.values = null // 成功函数的值
    this.reason = null // 失败函数的值
    this.onResolvedCallbacks = [] // case2: 存成功的函数
    this.onRejectedCallbacks = [] // case2: 存失败的函数

    const resolve = (data) => { // 需要用箭头函数或者绑定 this 的 function
      if(this.status === STATUS.PENDING){  // 去掉 PENDING 判断
        // case1: 保证状态只能发生一次变更, 不能先调用 resolve, 后调用 reject
        this.status = STATUS.FULLFILL
        this.values = data
        // case2: 执行异步操作保存的函数
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }

    const reject = (reason) => {
      if(this.status === STATUS.PENDING){ // 去掉 PENDING 判断
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

    // 两个入参均为非函数 04_resolvePromise/case_penetrate.js
    onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : e => {throw e}

    let promise2 = new Promise((resolve, reject) => {
      if(this.status === STATUS.FULLFILL){
        setTimeout(() => { // 这里加异步定时器的原因是，需要先拿到 promise2 返回值，再传递给 resolvePromise
          try {
              // 成功函数可能报错，捕获错误
              let x = onFullfilled(this.values) // 拿到成功函数的返回值，给下一个 then 使用
              resolvePromise(promise2, x, resolve, reject) // resolve(x)
            } catch (error) {
              reject(error)
            }
        })
      }
      if(this.status === STATUS.REJECT){
        setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)  // resolve(x)
            } catch (error) {
              reject(error)
            }
          })
      }
      // case2: executor 中执行了异步操作，需要将函数保存下来
      if(this.status === STATUS.PENDING){
        // 状态是 pending，失败与成功函数分别存储
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFullfilled(this.values)
              resolvePromise(promise2, x, resolve, reject)  // resolve(x)
            } catch (error) {
              reject(error)
            }
          })
        })

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
      }
    })
    return promise2
  }

  static deferred() {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
    })
    return dfd;
  }
}

module.exports = Promise