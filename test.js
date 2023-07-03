/**
 * 给你一个字符串 s ，仅反转字符串中的所有元音字母，并返回结果字符串。
    元音字母包括 'a'、'e'、'i'、'o'、'u'，且可能以大小写两种形式出现不止一次。
    示例 1：
    输入：s = "hello"
    输出："holle"
    示例 2：
    输入：s = "leetcode"
    输出："leotcede" // eeoe
 */

    function fn(str) {
      let res = str.split('')
      let arr = ['a','e','i','o','u']
      let left = 0
      let right = res.length - 1
      while(left<right){
        while(left<right && !arr.includes(str[left])) left++
        while(left<right &&!arr.includes(str[right])) right--
        let temp = res[left]
        res[left] = res[right]
        res[right] = temp
        left++
        right--
      }
      console.log(res.join(''))
    }
    fn('leetcode')
    fn('hello')

