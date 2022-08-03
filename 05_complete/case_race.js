
function wrap(promise){
  let abort;
  let innerPormise = new Promise((resolve, reject) => {
    abort = reject
  })
  let racePromise = Promise.race([promise, innerPormise])
  racePromise.abort = abort
  return racePromise
}

let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000)
})

p = wrap(p)
setTimeout(() => {
  p.abort('fail')
}, 1000)

p.then(console.log, console.group)