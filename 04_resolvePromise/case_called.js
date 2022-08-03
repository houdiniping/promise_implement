const Promise = require('./promise_resolvePromise')
// resolve 之后 reject
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('100')
  }, 1000)
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


/*
// // executor 里面 resolve Promise
// const p1 = new Promise((resolve, reject) => {
//   resolve(new Promise((res, rej) => {
//     res('inner resolve')
//   }))
// })

// p1.then(data => console.log('data', data))

// // then 入参是非函数，值透传
// const p3 = new Promise((resolve, reject) => {
//   resolve('p3: success')
// })

// p3.then()
// .then()
// .then(data => console.log('p3 data: ', data))

// // then 返回的 promise 不能和其执行的 promise 相同
// var p = new Promise((resolve, reject) => {
//   resolve('success')
// })

// const p2 = p.then(data => {
//   console.log('data', data)
//   return p2
// })

// p2.then()

// 其它实现没有判断状态，去掉 PENDING 判断
const p3 = new Promise((resolve, reject) => {
  resolve('p3')
})
p3.then(data => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Promise((res, rej) => {
        setTimeout(() => {
          res(`${data} 3`)
          rej(`${data} 4`)
        }, 500)
      }))
    }, 500)
  })
})
.then(data => {
  console.log('data', data)
}, err => {
  console.log('err', err)
})

 */
