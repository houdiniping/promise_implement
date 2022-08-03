const Promise = require('../promise_complete')

const promiseFactory = (value) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(value)
    }, 500)
  })
}

const pAll = Promise.all([promiseFactory(1), promiseFactory(2), 2])
.then(data => {
  console.log('data', data)
})