const Promise = require('./implement_promise')
// const Promise = require('./promise3')
// const Promise = require('./promise-gh')
const adapter = {
  resolve: Promise.resolve,
  reject: Promise.reject,
  deferred: Promise.deferred,
}
module.exports = adapter