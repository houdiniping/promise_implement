const Promise = require('../promise_complete')

Promise.reject(new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(100)
    // reject(200)
  }, 500)
}))
.then(console.log)
.catch((e) => console.log('err', e))