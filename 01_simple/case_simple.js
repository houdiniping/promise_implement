const Promise = require('./promise_simple')

const p0 = new Promise((resolve, reject) => {
  resolve('p0: success')
})
p0.then(data => console.log('p0', data))