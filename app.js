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
  const keywordList = keyword.split(' ').filter(item => item !== '') //THE LIST CONTAIN EVERY VALID KEYWORD

  // REDIRECT TO HOME PAGE WHEN KEYWORD IS EMPTY
  if (keywordList.length <= 0) {
    return res.redirect('/')
  }

  const restaurants = restaurant.results.filter(item => {
    // CHECK IF RESTAURANT NAME OR CATEGORY INCLUDES ANY KEYWORD
    for (let i = 0; i < keywordList.length; i++) {
      if (item.name.includes(keywordList[i]) || item.category.includes(keywordList[i])) {
        return true
      }
    }
  })
  res.render('search', { keyword, restaurants })
})

// LISTENING
app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`)
})