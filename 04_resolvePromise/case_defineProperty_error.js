// 返回的 then 属性报错
const Promise = require('../implement_promise')
const x = {
  then: ''
}

Object.defineProperty(x, 'then', {
  get(){
    throw Error('无法获取')
  }
})

let p = new Promise((resolve, reject) => {
  resolve('success')
})

let p2 = p.then(data => {
  return x
})

p2.then(data => {
  console.log('data', data)
}, err => console.log('err', err))
