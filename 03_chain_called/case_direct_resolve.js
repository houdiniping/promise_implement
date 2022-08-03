const Promise = require('./promise_chain_called')
// debugger
// then 异步任务队列，是调用 resolve 或 reject 之后放进去的
// 异步任务遵循先进先出/FIFO 原则
// 1. 为什么这里直接 resolve，后面紧接的第一个 then 没有执行
// 2. 第二个 then 的函数有没有放入任务队列
// 3.
const p = new Promise((resolve, reject) => {
  resolve(1)
})
p.then(data => {
  console.log('p.then: ', data)
  return 2
})
.then(num => {
  console.log('p.then.then: ', num)
  return 6
})
.then(num => {
  console.log('p.then.then: ', num)
  return 7
})

const p1 = new Promise((resolve, reject) => {
  console.log('333')
  resolve(10)
})
p1.then((data) => {
  console.log('p1: ', data)
  return 3
})
.then((data) => {
  console.log('p1: ', data)
  return 4
})
.then((data) => {
  console.log('p1: ', data)
  return 5
})