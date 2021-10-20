const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const restaurants = require('./modules/restaurants')

router.use('/restaurants', restaurants)
router.use('/', home)

module.exports = router