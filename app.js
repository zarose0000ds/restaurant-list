const express = require('express')
const exphbs = require('express-handlebars')
const restaurant = require('./restaurant.json')

const app = express()
const port = 3000

// TEMPLATE ENGINE
app.engine('hbs', exphbs({ defaultLayout: "main", extname: '.hbs' }))
app.set('view engine', 'hbs')

// STATIC FILES
app.use(express.static('public'))

// ROUTES
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurant.results })
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  res.render('show', { restaurant: restaurant.results[id - 1] })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurant.results.filter(item => (item.name.includes(keyword) || item.category.includes(keyword)))
  res.render('search', { keyword, restaurants })
})

// LISTENING
app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`)
})