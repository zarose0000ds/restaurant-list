const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant.js')

router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId }).lean().then(restaurants => res.render('index', { restaurants })).catch(e => console.log(e))
})

module.exports = router