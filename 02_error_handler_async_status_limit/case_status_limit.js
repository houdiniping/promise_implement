const Promise = require('./promise_error_handle_async');
// 状态只能发生一次改变
const p = new Promise((resolve, reject) => {
  resolve('p: success')
  reject('p: fail')
})
p.then(console.log, err => console.log('err', err))
