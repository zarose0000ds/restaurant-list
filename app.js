const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const usePassport = require('./config/passport')
const routes = require('./routes')
const Restaurant = require('./models/restaurant.js')

const app = express()
const port = process.env.PORT

// DB CONNECTION
require('./config/mongoose')

// TEMPLATE ENGINE
app.engine('hbs', exphbs({ defaultLayout: "main", extname: '.hbs' }))
app.set('view engine', 'hbs')

// METHOD OVERRIDE
app.use(methodOverride('_method'))

// BODY PARSER
app.use(express.urlencoded({ extended: true }))

// STATIC FILES
app.use(express.static('public'))

// SESSION
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// PASSPORT
usePassport(app)

// RES LOCALS
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

// ROUTER
app.use(routes)

// LISTENING
app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`)
})