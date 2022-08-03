const Promise = require('./promise_error_handle_async');

// 异步
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p2: async')
  }, 1000)
  // 直接 resolve
  // resolve('p2: resolve')
})
p2.then(console.log)
p2.then(console.log)