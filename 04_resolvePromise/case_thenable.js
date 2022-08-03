const Promise = require('./promise_resolvePromise')

new Promise((resolve, reject) => {
  resolve(3)
})
.then(() => ({
  then: function(){
    console.log('promise')
    return 3
  }
}))
.then(data => console.log('data', data))