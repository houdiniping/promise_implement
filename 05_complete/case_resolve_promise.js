const Promise = require('./promise_complete')

let p = new Promise((resolve, reject) => {
    resolve(new Promise((res, rej) => {
      res(new Promise((r, j) => {
        j(200)
      }))
    }))
})
p
.then((console.log))
.catch(err => console.log('err', err))
