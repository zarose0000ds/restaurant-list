const express = require('express')
const path = require('path')
const router = express.Router()

const Image = require('../../models/image.js')

router.get('/restaurant-default', (req, res) => {
  res.set('Content-Type', 'image/png')
  res.sendFile(path.join(__dirname, '../../public/images/restaurant.png'))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  
  Image.findById(id).then(image => {
    res.set('Content-Type', 'image/png')
    res.send(image.content)
  }).catch(e => console.log(e))
})

module.exports = router