import './style.css'
const a = 'Hello Webpack^^'

function treeShakingTest(){
  console.log('tree-shaking...')
}

console.log(a)
module.exports = a