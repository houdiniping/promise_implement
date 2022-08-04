// 返回自身
// then 的回调函数返回自身，因为返回 Promise 会进行递归解析，因此不能返回自身
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
