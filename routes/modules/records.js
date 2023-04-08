const express = require('express')
const router = express.Router()
const Record = require('../../models/record')


router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {//新增支出
  const recordData = {
    userId: req.user._id,
    name: req.body.name,
    date: req.body.date,
    category: req.body.category,
    amount: req.body.amount,
  };
  return Record.create({ ...recordData })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .lean()
    .then((record) => res.render('edit', { record }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const _id = req.params.id
  const recordData = {
    userId: req.user._id,
    name: req.body.name,
    date: req.body.date,
    category: req.body.category,
    amount: req.body.amount,
  };
  return Record.findOne(_id)
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
  return Record.findOne({_id, userId})
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
