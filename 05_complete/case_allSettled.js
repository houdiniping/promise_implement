const Promise = require('../promise_complete')

Promise.allSettled([
  1,
  new Promise((resolve) => setTimeout(() => resolve(100))),
  new Promise((resolve, reject) => setTimeout(() => reject(200))),
  2]
  )
.then(data => console.log('data', data))