const mongoose = require('mongoose')
const Category = require('../category') // 載入 Category model

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', async () => {
  console.log('mongodb connected!')
  try {
    await Category.deleteMany() // 清空資料表
    console.log('Category collection dropped')

    // 在這裡新增你要填充的資料
    const categories = [
      { id: 1, name: '家居物業' },
      { id: 2, name: '交通出行' },
      { id: 3, name: '休閒娛樂' },
      { id: 4, name: '餐飲食品' },
      { id: 5, name: '其他' },
    ]

    await Category.insertMany(categories)
    console.log('Category data inserted')
  } catch (err) {
    console.error(err)
  }

  db.close()
  console.log('categorySeeder done')
})