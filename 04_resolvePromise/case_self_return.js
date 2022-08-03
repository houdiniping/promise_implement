// 返回自身
const Promise = require('./implement_promise')

let p = new Promise((resolve, reject) => {
  resolve('success')
})

let p2 = p.then(data => {
  return p2
})

p2.then(data => {
  console.log('data', data)
}, err => console.log('err', err))
