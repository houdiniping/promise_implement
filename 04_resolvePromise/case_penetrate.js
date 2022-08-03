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