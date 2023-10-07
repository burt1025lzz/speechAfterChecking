const router = require('koa-router')()
const handle = require("../common/handle");
const pinyin = require("pinyin");
const Dir = require('../db/model')
const getParticiple = require("../common/gpt");


router.prefix('/api')

// 根据首位搜索数据字典
router.get('/search', async ctx => {
  const query = ctx.query  // req 功能
  const {str, mode} = query
  if (str) {
    let dirRes = ''
    let arr = []
    if (mode === 'gpt') {
      arr = await getParticiple.getParticiple(str)
    } else {
      arr = handle.handlePinyin(str)
    }
    const pattern = /^[\u4E00-\u9FA5]{1,5}$/
    for (const item of arr) {
      let res = []
      if (pattern.test(item.word)) {
        console.log(item)
        res = await Dir.find({
          first: item.code[0],
          end: !isNaN(Number(item.code[item.code.length - 1])) ? item.code[item.code.length - 2] : item.code[item.code.length - 1]
        })
      }
      // console.log(!isNaN(Number(item.code[item.code.length - 1]))? item.code[item.code.length - 2] : item.code[item.code.length - 1])
      let list = []
      res.forEach(val => {
        // console.log(val)
        list.push({
          num: handle.handleSimstr(val.key, item.code),
          value: val.value
        })
      })
      list.sort((a, b) => {
        return b['num'] - a['num']
      })
      // console.log(list)
      res.length ? dirRes += list[0].value : dirRes += item.word
    }
    ctx.body = {
      errno: 0,
      message: 'success',
      data: dirRes
    }
  } else {
    ctx.body = {
      errno: 999,
      message: '必填项为空',
      data: []
    }
  }
})

// 写入字典库
router.get('/write', async ctx => {
  const query = ctx.query  // req 功能
  const pattern = /^[\u4E00-\u9FA5]{1,5}$/
  const {str} = query
  if (pattern.test(str)) {
    if (str.length >= 2) {
      let strPin = pinyin(str, {
        // style: pinyin.STYLE_NORMAL, // 设置无拼音风格
        // style: pinyin.STYLE_TONE, // 设置默认拼音风格
        style: pinyin.STYLE_TONE2, // 设置数字拼音风格
      }).join('')

      const dir = new Dir({
        value: str,
        key: strPin,
        first: strPin[0],
        end: !isNaN(Number(strPin[strPin.length - 1])) ? strPin[strPin.length - 2] : strPin[strPin.length - 1]
      })
      // 获取数据库列表
      let dirList, errno, message
      try {
        dirList = await dir.save()
        errno = 0
        message = 'success'
      } catch (e) {
        dirList = []
        errno = e.code
        message = '数据录入重复'
      }

      ctx.body = {
        errno,
        message,
        data: dirList
      }
    } else {
      ctx.body = {
        errno: 10000,
        message: '请录入词组, 字典内容不能为空或单个汉字',
        data: []
      }
    }
  } else {
    ctx.body = {
      errno: 12000,
      message: '字典只能录入汉字',
      data: []
    }
  }
})
// 删除数据字典中的数据
router.get('/delete', async ctx => {
  const query = ctx.query  // req 功能
  const pattern = /^[\u4E00-\u9FA5]{1,5}$/
  const {str} = query
  if (pattern.test(str)) {
    if (str.length >= 2) {
      const dir = await Dir.where({
        value: str
      }).remove()
      if (dir.deletedCount) {
        ctx.body = {
          errno: 0,
          message: '删除成功',
        }
      } else {
        ctx.body = {
          errno: 0,
          message: '删除失败, 字典中没有需要删除项',
        }
      }
    } else {
      ctx.body = {
        errno: 10000,
        message: '只能删除字典中的词组',
      }
    }
  } else {
    ctx.body = {
      errno: 12000,
      message: '只能删除字典中的汉字',
    }
  }
})
module.exports = router

