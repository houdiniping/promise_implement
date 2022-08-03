const Promise = require('./promise_resolvePromise')
// 链式调用, 不能返回 this， promise 状态只能从 PENDING -> FULLFILLED 或 PENDING -> REJECTED
const p = new Promise((resolve, reject) => {
  resolve('p')
})

p
.then(data => {
  console.log('then1', data)
  // return 'prev then' // 返回普通值
  // 嵌套返回 resolve Promise
  return new Promise((resolve, reject) => {
    resolve (new Promise((res, rej) => {
      res('inner2 resolve')
    }))
  })
})
// 下一个 then 能拿到上一个 then 的返回结果
.then(data => console.log('then2: ', data))