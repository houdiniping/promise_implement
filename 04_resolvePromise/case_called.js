const Promise = require('./promise_resolvePromise')
// resolve 之后 reject
const p = new Promise((resolve, reject) => {
    resolve('100')
})

let p2 = p.then(data => {
  console.log("p: resolve after 1s", data)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('p2: resolve')
      reject('p2: reject')
    })
  })
})
p2.then(data => {
  console.log('data', data)
}, err => console.log('err', err))


// 其它实现没有判断状态，去掉 PENDING 判断
// const p3 = new Promise((resolve, reject) => {
//   resolve('p3')
// })
// p3.then(data => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(new Promise((res, rej) => {
//         setTimeout(() => {
//           res(`${data} 3`)
//           rej(`${data} 4`)
//         }, 500)
//       }))
//     }, 500)
//   })
// })
// .then(data => {
//   console.log('data', data)
// }, err => {
//   console.log('err', err)
// })