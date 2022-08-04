// 返回自身
// then 的回调函数返回自身，新 Promise 永远不会被 resolve 或 reject
const Promise = require('./promise_resolvePromise')

let p = new Promise((resolve, reject) => {
  resolve('success')
})

let p2 = p.then(data => {
  return p2
})

p2.then(data => {
  console.log('data', data)
}, err => console.log('err', err))
