const Promise = require('../promise_complete')

Promise.resolve(new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve(100)
    reject(100)
  }, 500)
}))
.then(console.log)
.catch((e) => console.log('err', e))