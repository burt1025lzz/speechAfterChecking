// 数据模型
const mongoose = require('./db')

// 定义 Dir Schema (数据规范)
const DirSchema = mongoose.Schema({
  value: {
    type: String,
    require: true,  // 必填
    unique: true  // 唯一, 不重复
  },
  key: String,
  first: String,
  end: String,
}, {
  timestamps: false,  // 时间戳, 自动添加文档的创建时间和更新时间
  versionKey: false  // 禁用版本控制器
})

// 定义 Dir Model
module.exports = mongoose.model('Dir',DirSchema)
