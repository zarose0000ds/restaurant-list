const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const usePassport = require('./config/passport')
const routes = require('./routes')

const app = express()
const port = process.env.PORT

// DB CONNECTION
require('./config/mongoose')

// TEMPLATE ENGINE
app.engine('hbs', exphbs({ defaultLayout: "main", extname: '.hbs', helpers: require('handlebars-helpers')() }))
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

// FLASH MESSAGE
app.use(flash())

// RES LOCALS
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

// ROUTER
app.use(routes)

// LISTENING
app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`)
})