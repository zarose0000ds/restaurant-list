const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant.js')

router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const keywordList = keyword.split(' ').filter(item => item !== '') //THE LIST CONTAIN EVERY VALID KEYWORD
  let results = []

  // REDIRECT TO HOME PAGE WHEN KEYWORD IS EMPTY
  if (keywordList.length <= 0) {
    return res.redirect('/')
  }

  Promise.all(Array.from({ length: keywordList.length },
    (_, i) => Restaurant.find({
      $or: [
        { name: { $regex: keywordList[i], $options: 'i' } },
        { category: { $regex: keywordList[i], $options: 'i' } }
      ]
    }).lean().then(restaurants => results = results.concat(restaurants))
  )).then(() => res.render('search', { keyword, restaurants: results })).catch(e => console.log(e))
})

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const { name, name_en, category, location, phone, description } = req.body
  Restaurant.create({
    name,
    name_en,
    category,
    image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5635/01.jpg',
    location,
    phone,
    description
  }).then(() => res.redirect('/')).catch(e => console.log(e))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id).lean().then(restaurant => res.render('show', { restaurant }))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id).lean().then(restaurant => console.log(restaurant)).catch(e => console.log(e))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id).then(restaurant => restaurant.remove()).then(() => res.redirect('/')).catch(e => console.log(e))
})

module.exports = router