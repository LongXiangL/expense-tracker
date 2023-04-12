const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

async function getMappedRecords(userId, categoryId) {
  const recordsQuery = categoryId === 'all' ? { userId } : { userId, categoryId }
  const records = await Record.find(recordsQuery).sort({ date: 'desc' }).lean()
  return Promise.all(records.map(async (record) => {
    const category = await Category.findOne({ _id: record.categoryId }).lean()
    return {
      ...record,
      date: record.date.toISOString().slice(0, 10),
      icon: category.icon,
    }
  }))
}

router.post('/', async (req, res) => {
  try {
    const userId = req.user._id
    const categories = await Category.find().lean()
    const categoryId = req.body.filter
    const mappedRecords = await getMappedRecords(userId, categoryId)
    const totalAmount = mappedRecords.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount
    }, 0)
    let categoryName = ''
    if (categoryId !== 'all') {
      const category = await Category.findOne({ _id: categoryId }).lean()
      categoryName = category.name
    }
    const renderData = {
      records: mappedRecords,
      totalAmount,
      categoryId,
      categoryName,
      categories,
    }
    res.render('index', renderData)
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
