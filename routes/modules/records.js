const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/new', async (req, res) => {
  const categories = await Category.find().lean()
  res.render('new', { categories })
})

router.post('/', (req, res) => {//新增支出
  const recordData = {
    categoryId: req.body.categoryId,
    userId: req.user._id,
    name: req.body.name,
    date: req.body.date,
    amount: req.body.amount,
  };
  return Record.create({ ...recordData })
    .then(() => req.flash('success_msg', '成功新增支出！'))
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


router.get('/:id/edit', async (req, res) => {// edit record page
  try {
    const userId = req.user._id
    const _id = req.params.id
    const categories = await Category.find().lean()
    const record = await Record.findOne({ _id, userId }).lean()
    record.date = record.date.toISOString().slice(0, 10)
    const category = await Category.findOne({ _id: record.categoryId }).lean()
    const categoryName = category.name
    res.render('edit', { record, categoryName, categories })
  } catch (error) {
    console.log(error)
  }
})


router.put('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  const recordData = {
    name: req.body.name,
    date: req.body.date,
    categoryId: req.body.categoryId,
    amount: req.body.amount,
  };
  return Record.findOne({ _id, userId })
    .then(record => {
      record.set(recordData);
      return record.save()
    })
    .then(() => res.redirect(`/`))
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => req.flash('success_msg', '刪除成功！'))
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
