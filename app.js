const express = require('express')
const exphbs = require('express-handlebars')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT
const Restaurant = require('./models/restaurant.js')

// DB CONNECTION
require('./config/mongoose')

// TEMPLATE ENGINE
app.engine('hbs', exphbs({ defaultLayout: "main", extname: '.hbs' }))
app.set('view engine', 'hbs')

// STATIC FILES
app.use(express.static('public'))

// ROUTES
app.get('/', (req, res) => {
  Restaurant.find().lean().then(restaurants => res.render('index', {restaurants})).catch(e => console.log(e))
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id).lean().then(restaurant => res.render('show', {restaurant}))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const keywordList = keyword.split(' ').filter(item => item !== '') //THE LIST CONTAIN EVERY VALID KEYWORD
  let results = []

  // REDIRECT TO HOME PAGE WHEN KEYWORD IS EMPTY
  if (keywordList.length <= 0) {
    return res.redirect('/')
  }

  Promise.all(Array.from({ length: keywordList.length },
    (_, i) => Restaurant.find({ $or: [
      { name: { $regex: keywordList[i], $options: 'i' } },
      { category: { $regex: keywordList[i], $options: 'i' } }
    ]}).lean().then(restaurants => results = results.concat(restaurants))
  )).then(() => res.render('search', { keyword, restaurants: results })).catch(e => console.log(e))
})

// LISTENING
app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`)
})