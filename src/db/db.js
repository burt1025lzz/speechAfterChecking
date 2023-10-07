/**
 * @description mongoose 连接数据库
 * @author burt
 */

const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', true)
// 开始连接
mongoose.connect(`${process.env.MONGO_URL}`, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => {
  console.log('mongoose 连接成功')
})

mongoose.connection.on('error', err => {
  console.error('mongoose 连接出错:', err)
})

module.exports = mongoose // commonjs
