const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.post('/', async (req, res) => {
  try {
    const userId = req.user._id
    const categories = await Category.find().lean()
    const categoryId = req.body.filter
    if (categoryId === 'all') {
      const records = await Record.find({ userId }).sort({ date: 'desc' }).lean()
      const mappedRecords = 
      await Promise.all(
        records.map(async (record) => {
        const categoryId = record.categoryId
        const category = await Category.findOne({ _id: categoryId }).lean()
        return {
          ...record,
          date: record.date.toISOString().slice(0, 10),
          icon: category.icon
        }
      }))
      const totalAmount = mappedRecords.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.amount
      }, 0)
      res.render('index', { records: mappedRecords, totalAmount, categories })
    } else {
      const records = await Record.find({ userId, categoryId }).sort({ date: 'desc' }).lean()
      const mappedRecords = await Promise.all(records.map(async (record) => {
        const categoryId = record.categoryId
        const category = await Category.findOne({ _id: categoryId }).lean()
        return {
          ...record,
          date: record.date.toISOString().slice(0, 10),
          icon: category.icon,
        }
      }))
      const category = await Category.findOne({ _id: categoryId }).lean()
      const categoryName = category.name
      const totalAmount = mappedRecords.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.amount
      }, 0)
      res.render('index', { records: mappedRecords, totalAmount, categoryId, categoryName, categories })
    }
  } catch (error) {
    console.error(error)
  }
})


// async function getMappedRecords(userId, categoryId) {
//   const recordsQuery = categoryId === 'all' ? { userId } : { userId, categoryId }
//   const records = await Record.find(recordsQuery).sort({ date: 'desc' }).lean()
//   return Promise.all(records.map(async (record) => {
//     const category = await Category.findOne({ _id: record.categoryId }).lean()
//     return {
//       ...record,
//       date: record.date.toISOString().slice(0, 10),
//       icon: category.icon,
//     }
//   }))
// }

// router.post('/', async (req, res) => {
//   try {
//     const userId = req.user._id
//     const categories = await Category.find().lean()
//     const categoryId = req.body.filter
//     const mappedRecords = await getMappedRecords(userId, categoryId)
//     const totalAmount = mappedRecords.reduce((accumulator, currentValue) => {
//       return accumulator + currentValue.amount
//     }, 0)
//     let categoryName = ''
//     if (categoryId !== 'all') {
//       const category = await Category.findOne({ _id: categoryId }).lean()
//       categoryName = category.name
//     }
//     const renderData = {
//       records: mappedRecords,
//       totalAmount,
//       categoryId,
//       categoryName,
//       categories,
//     }
//     res.render('index', renderData)
//   } catch (error) {
//     console.error(error)
//   }
// })

module.exports = router
