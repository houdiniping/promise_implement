const Promise = require('../promise_complete')

const p = new Promise((resolve, reject) => {
  resolve(1)
})
p
.then(() => console.log('then'))
.catch(() => console.log('catch'))
.finally(() => console.log('finally'))

// 执行在所有 then catch 函数之后
// finally 依然返回 Promise
p
.then(() => console.log('then1'))
.catch(() => console.log('catch1'))
.finally(d => console.log('finally1', d))
.then(data => console.log('data'))