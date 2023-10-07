const participle = require("nodejieba");
const pinyin = require("pinyin");

const handle = sentence => {
  const arr = []
  const result = participle.cut(sentence, true);
  console.log(result);
  // const regular = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
  result.forEach(item => {
    const result = pinyin(item, {
      // style: pinyin.STYLE_NORMAL, // 设置无拼音风格
      // style: pinyin.STYLE_TONE, // 设置默认拼音风格
      style: pinyin.STYLE_TONE2, // 设置数字拼音风格
    }).map(item => {
      return item[0]
    }).join('')
    // !regular.test(result) && arr.push({
    arr.push({
      code: result,
      word: item
    })
    console.log(result)
  })
  return arr
}
const simStr = (str1, str2) => {
  const length = str1.length > str2.length ? str1.length : str2.length
  return ((1 - sim(str1, str2) / length) * 100).toFixed(2)
}
const sim = (str1, str2) => {
  const
    arr = [],
    length1 = str1.length,
    length2 = str2.length;

  if (length1 === 0) return length2
  if (length2 === 0) return length1

  for (let i = 0; i <= length1; i++) {
    arr[i] = []
    arr[i][0] = i
  }
  for (let i = 0; i <= length2; i++) {
    arr[0][i] = i
  }
  for (let i = 1; i <= length1; i++) {
    for (let j = 1; j <= length2; j++) {
      const cons = str1.charAt(i - 1) === str2.charAt(j - 1) ? 0 : 1
      arr[i][j] = Math.min(arr[i - 1][j - 1], arr[i - 1][j], arr[i][j - 1]) + cons
    }
  }
  // console.log(arr)
  return arr[length1][length2]
}
exports.handlePinyin = handle
exports.handleSimstr = simStr
