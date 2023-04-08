const Record = require('../record') // 載入 Record model
const User = require('../user')
const Category = require('../category')
const db = require('../../config/mongoose')

const SEED_USERS = [
  {
    id: 1,
    name: '廣志',
    email: 'qwe@example.com',
    password: 'qwe',
  },
  {
    id: 2,
    name: '小新',
    email: 'qwe@example.com',
    password: 'qwe',
  },
];

const SEED_RECORDS = [{
  id: 1,
  name: '午餐',
  date: '2019.4.23',
  amount: 120,
  userId:1,
  categoryId:4,
},
{
  id: 2,
  name: '電影：驚奇隊長',
  date: '2019.4.23',
  amount: 220,
  userId:2,
  categoryId:3,
},
]

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', async() => {
  try {
    // 建立索引
    await Promise.all([
      User.createIndexes(),
      Record.createIndexes(),
    ])
    await User.create(SEED_USERS)
    console.log('User data inserted')

    // 新增 Record 資料
    for (const record of SEED_RECORDS) {
      const user = await User.findOne({ id: record.userId })
      const category = await Category.findOne({ id: record.categoryId })

      await Record.create({
        ...record,
        userId: user._id,
        categoryId: category._id,
      })
    }
    console.log('Record data inserted')
  } catch (err) {
    console.error(err)
  }

  db.close()
  console.log('Seeder done')
})