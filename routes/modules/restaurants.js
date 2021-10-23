const express = require('express')
const multer = require('multer')
const router = express.Router()
const upload = multer()

const Restaurant = require('../../models/restaurant.js')
const Image = require('../../models/image.js')

router.get('/search', (req, res) => {
  const userId = req.user._id
  const keyword = req.query.keyword
  const keywordList = keyword.split(' ').filter(item => item !== '') //THE LIST CONTAIN EVERY VALID KEYWORD

  // REDIRECT TO HOME PAGE WHEN KEYWORD IS EMPTY
  if (keywordList.length <= 0) {
    return res.redirect('/')
  }

  // CREATE QUERY ARRAY
  const query = []
  keywordList.forEach(kw => {
    query.push({ name: { $regex: kw, $options: 'i' } })
    query.push({ category: { $regex: kw, $options: 'i' } })
  })

  Restaurant.find({ userId, $or: query}).lean().then(restaurants => res.render('search', { restaurants })).catch(e => console.log(e))
})

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', upload.single('image'), (req, res) => {
  const userId = req.user._id
  const { name, name_en, category, location, phone, rating, description } = req.body
  const nameEnReg = /^[a-zA-Z0-9\s]+$/
  const phoneReg = /^\d{2,3}\s\d{3,4}\s\d{4}$/
  const errors = []

  if (!name || !category || !location || !phone || !description) {
    errors.push({ message: '有尚未填寫的必填欄位！' })
  }
  if (name_en && !nameEnReg.test(name_en)) {
    errors.push({ message: '英文名稱限填大小寫英文及數字！' })
  }
  if (phone && !phoneReg.test(phone)) {
    errors.push({ message: '請按照規定格式填寫電話號碼！' })
  }
  if (errors.length) {
    return res.render('new', {
      errors,
      name,
      name_en,
      category,
      location,
      phone,
      rating,
      description
    })
  }

  Restaurant.create({
    name,
    name_en,
    category,
    image: '/uploads/restaurant-default',
    location,
    phone,
    rating,
    description,
    userId
  }).then(restaurant => {
    if (req.file) {
      const restaurantId = restaurant._id
      return Promise.all([
        Image.create({ content: req.file.buffer, restaurantId }).then(image => {
          restaurant.image = `/uploads/${image._id}`
          restaurant.save()
        })
      ])
    }
  }).then(() => res.redirect('/')).catch(e => console.log(e))
})

router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findOne({ _id, userId }).lean().then(restaurant => res.render('show', { restaurant })).catch(e => console.log(e))
})

router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findOne({ _id, userId }).lean().then(restaurant => res.render('edit', { restaurant })).catch(e => console.log(e))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, name_en, category, location, phone, rating, description } = req.body
  const nameEnReg = /^[a-zA-Z0-9\s]+$/
  const phoneReg = /^\d{2,3}\s\d{3,4}\s\d{4}$/
  const errors = []

  if (!name || !category || !location || !phone || !description) {
    errors.push({ message: '有尚未填寫的必填欄位！' })
  }
  if (name_en && !nameEnReg.test(name_en)) {
    errors.push({ message: '英文名稱限填大小寫英文及數字！' })
  }
  if (phone && !phoneReg.test(phone)) {
    errors.push({ message: '請按照規定格式填寫電話號碼！' })
  }
  if (errors.length) {
    return res.render('edit', {
      errors,
      _id,
      name,
      name_en,
      category,
      location,
      phone,
      rating,
      description
    })
  }

  Restaurant.findOne({ _id, userId }).then(restaurant => {
    restaurant.name = name
    restaurant.name_en = name_en
    restaurant.category = category
    restaurant.location = location
    restaurant.phone = phone
    restaurant.rating = rating,
    restaurant.description = description
    restaurant.save()
  }).then(() => res.redirect(`/restaurants/${_id}`)).catch(e => console.log(e))
})

router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findOne({ _id, userId }).then(restaurant => {
    const restaurantId = restaurant._id
    Image.findOne({ restaurantId }).then(image => image.remove())
    restaurant.remove()
  }).then(() => res.redirect('/')).catch(e => console.log(e))
})

module.exports = router