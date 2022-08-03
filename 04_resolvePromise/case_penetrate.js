// 值透传例子
const Promise = require('../implement_promise')

const p = new Promise((resolve, reject) => {
  resolve('success')
})

p
.then()
.then(3)
.then(data => {
  console.log('data', data)
})

// why penetrate
//
p.then(null, err => {
  console.log('err', err)
})

// 前一个 then 返回的还是上一个 then 的数据
p.then(data => {
  console.log('data', data)
}, err => {
  console.log('err2', err)
})