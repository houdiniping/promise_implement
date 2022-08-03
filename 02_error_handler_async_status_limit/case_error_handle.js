const Promise = require('./promise_error_handle_async');

// 函数内直接报错
const p1 = new Promise((resolve, reject) => {
  throw Error('p1: error')
})
p1.then(console.log, err => console.log('p2: err', err))