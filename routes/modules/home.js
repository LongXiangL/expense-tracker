const express = require('express')
const router = express.Router()
const Record=require('../../models/record')
const Category=require('../../models/category')

router.get('/', (req, res) => {
  const userId = req.user._id 
  Record.find({userId})
    .lean()
    .sort({ date: 'desc' })
    .then(records => {
      records = records.map(record => ({
        ...record,
        date: record.date.toISOString().slice(0, 10)
      }))
      res.render('index', { records })
    })
    .catch(error => console.error(error))
})


module.exports = router
