const fetch = require('node-fetch')
const pinyin = require("pinyin");
const getParticiple = async (str) => {
  try {
    let res = await fetch(process.env.CHATGPT_API || '', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CHATGPT_KEY}`
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": `只结果分词成数组:${str}`}],
        "max_tokens": 800,
        "temperature": 0.5,
        "frequency_penalty": 0,
        "presence_penalty": 0
      })
    })
    res = await res.json()
    res = JSON.parse(res.choices[0].message.content.replaceAll('\'','"'))
    let arr = []
    res.forEach(item => {
      const result = pinyin(item, {
        // style: pinyin.STYLE_NORMAL, // 设置无拼音风格
        // style: pinyin.STYLE_TONE, // 设置默认拼音风格
        style: pinyin.STYLE_TONE2, // 设置数字拼音风格
      }).map(item => {
        return item[0]
      }).join('')
      arr.push({
        code: result,
        word: item
      })
    })
    return arr
  } catch (error) {
    return [
      {
        code: 'error',
        word: '智能模式出现问题，请切换模式'
      }
    ]
  }
}

exports.getParticiple = getParticiple
