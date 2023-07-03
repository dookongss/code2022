function myCurrying(fn,...args) {
  if(args.length >= fn.length) {
    return fn(...args)
  }
  return function(...args2) {
    return myCurrying(fn,...args,...args2)
  }
}

function add(x,y,z){
  return x+y+z
}
let test = myCurrying(add,1)
let result = test(1)(2)
console.log(result)