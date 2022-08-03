//
function resolvePromise(promise2, x, resolve, reject){
  // 保证所有人的 Promise 都可以互相调用
  // If promise and x refer to the same object, reject promise with a TypeError as the reason.
  // [TypeError: Chain cycle detected for promsie #<Promise>]
  if(promise2 === x) return  reject(new TypeError('Chain cycle detected for promsie #<Promise>'))

  let called = false; // 防止其它人的 Promise 没有做状态屏蔽
  if((typeof x === 'object' && x !== null) || typeof x === 'function'){
    try {
      let then = x.then // 拿 then 方法可能报错 Object.defineProperty(x, 'then', { get(){ throw new Error}})
      if(typeof then === 'function') { // 是 promise {then: function(){}} 也会被当做 promise
        then.call(x, y => { // 这里为啥不用 x.then 因为又可能走到 get 报错
          // y 返回的 promise 的 返回值
          if(called) return
          called = true
          resolvePromise(promise2, y, resolve, reject) // 递归解析返回的 Promise
        }, r => {
          if(called) return
          called = true
          reject(r)
        })
      } else {
        // 是对象或函数 { a: 1 } function(){}
        resolve(x)
      }
    } catch (error) {
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
      if(data instanceof Promise){ // Promise.resolve 的是 promise, 递归解析
        return data.then(resolve, reject)
      }
      if(this.status === STATUS.PENDING){
        // case1: 保证状态只能发生一次变更, 不能先调用 resolve, 后调用 reject
        this.status = STATUS.FULLFILL
        this.values = data
        // case2: 执行异步操作保存的函数
        this.onResolvedCallbacks.forEach(fn => fn())
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
    onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : e => {throw e}
    let promise2 = new Promise((resolve, reject) => {
      if(this.status === STATUS.FULLFILL){
        setTimeout(() => { // 这里加异步定时器的原因是，需要先拿到 promise2 返回值，再传递给 resolvePromise
          try {
              // 成功函数可能报错，捕获错误
              let x = onFullfilled(this.values) // 拿到成功函数的返回值，给下一个 then 使用
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
        })
      }
      if(this.status === STATUS.REJECT){
        setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
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
              resolvePromise(promise2, x, resolve, reject)
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

  catch(onRejected){
    return this.then(null, onRejected)
  }

  finally(onFinally){
    return this.then(value => {
      Promise.resolve(onFinally()).then(() => value)
    }, reason =>
    Promise.resolve(onFinally()).then(() => {throw reason}))
  }

  static resolve(value) {
    return new Promise((resolve, reject) => resolve(value))
  }

  static reject(reason) {
    return new Promise((resolve, reject) => reject(reason))
  }

  static all(values){
    return new Promise((resolve, reject) => {
      let arr = []
      let count = 0;
      function processData(index, data){
        arr[index] = data //
        // if(arr.length === values.length) { // 这里不能用 arr.length === values.length 判断, 可能会出现最后一个Promise返回最快, arr[2] = 1
        if(++count === values.length) { // 这里不能用 arr.length === values.length 判断, 可能会出现最后一个Promise返回最快, arr[2] = 1
          // 04_complete/case_all
          resolve(arr)
        }
      }
      for(let i =0; i<values.length; i++){
        const cur = values[i]
        Promise.resolve(cur).then((data) => {
          processData(i, data)
        }, reject) // 不管 cur 是普通值还是 Promise, 这样可以统一处理
      }
    })
  }

  // 无论失败成功都返回
  static allSettled(values){
    return new Promise((resolve, reject) => {
      let arr = []
      let count = 0;
      function processData(index, data){
        arr[index] = data
        if(++count === values.length){
          resolve(arr)
        }
      }
      for(let i=0; i<values.length; i++){
        let cur = values[i]
        Promise.resolve(cur).then(data => {
          processData(i, data)
        }, err => {
          processData(i, err)
        })
      }
    })
  }

  // 可用于超时处理
  static race(values){
    return new Promise((resolve, reject) => {
      for(let i=0; i<values.length; i++){
        Promise.resolve(values[i]).then(resolve, reject)
      }
    })
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