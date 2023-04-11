const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const records=require('../routes/modules/records')
const users = require('./modules/users')  
const filter = require('./modules/filter')
const { authenticator } = require('../middleware/auth')  // 掛載 middleware

router.use('/filter', authenticator, filter)
router.use('/records', authenticator,records)
router.use('/users', users)  
router.use('/', authenticator, home)



module.exports = router