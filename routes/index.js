const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const restaurant = require('./modules/restaurant')

router.use('/restaurants', restaurant)
router.use('/', home)

module.exports = router