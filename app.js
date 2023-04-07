const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars');
const Record=require('./models/record')
const bodyParser = require('body-parser')
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }) // 設定連線到 mongoDB)

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})


app.get('/', (req, res) => {
  Record.find() 
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

app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.post('/records', (req, res) => {//新增支出
  const recordData = {
    name: req.body.name,
    date: req.body.date,
    category: req.body.category,
    amount: req.body.amount,
  };
  return Record.create({ ...recordData })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


app.get('/records/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then((record) => res.render('edit', { record }))
    .catch(error => console.log(error))
})

app.post('/records/:id/edit', (req, res) => {
  const id = req.params.id
  const recordData = {
    name: req.body.name,
    date: req.body.date,
    category: req.body.category,
    amount: req.body.amount,
  };
  return Record.findById(id)
    .then(record => {
      record.set(recordData);
      return record.save()
    })
    .then(() => res.redirect(`/`))
    .catch(error => console.log(error))
})

app.post('/records/:id/delete', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})



app.listen(3000,()=>{
  console.log('App is running on port:3000')
})