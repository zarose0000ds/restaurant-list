const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant.js')

router.get('/', (req, res) => {
  Restaurant.find().lean().then(restaurants => res.render('index', { restaurants })).catch(e => console.log(e))
})

module.exports = router