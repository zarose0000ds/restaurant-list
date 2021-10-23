const express = require('express')
const multer = require('multer')
const router = express.Router()
const upload = multer()

const Restaurant = require('../../models/restaurant.js')
const Image = require('../../models/image.js')
const validator = require('../../models/validation/restaurantValidator')

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
  const errors = validator(req.body)
  const { name, name_en, category, location, phone, rating, description } = req.body
  let google_map = req.body.google_map

  if (errors.length) {
    return res.render('new', {
      errors,
      name,
      name_en,
      category,
      location,
      phone,
      google_map,
      rating,
      description
    })
  }

  // SET DEFAULT GOOGLE MAP URL IF NOT GIVEN
  if (!google_map) google_map = `https://www.google.com/maps/place/${location}`

  Restaurant.create({
    name,
    name_en,
    category,
    image: '/uploads/restaurant-default',
    location,
    phone,
    google_map,
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
  Restaurant.findOne({ _id, userId }).lean().then(restaurant => {
    // PREVENT FROM SHOWING DEFAULT GOOGLE MAP SHARE LINK
    if (restaurant.google_map !== `https://www.google.com/maps/place/${restaurant.location}`) {
      const google_map = restaurant.google_map
      return res.render('edit', { restaurant, google_map })
    }
    res.render('edit', { restaurant })
  }).catch(e => console.log(e))
})

router.put('/:id', upload.single('image'), (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const errors = validator(req.body)
  const { name, name_en, category, location, phone, rating, description } = req.body
  let google_map = req.body.google_map
  
  if (errors.length) {
    return res.render('edit', {
      errors,
      _id,
      name,
      name_en,
      category,
      location,
      phone,
      google_map,
      rating,
      description
    })
  }

  // SET DEFAULT GOOGLE MAP URL IF NOT GIVEN
  if (!google_map) google_map = `https://www.google.com/maps/place/${location}`

  Restaurant.findOne({ _id, userId }).then(restaurant => {
    restaurant.name = name
    restaurant.name_en = name_en
    restaurant.category = category
    restaurant.location = location
    restaurant.phone = phone
    restaurant.google_map = google_map
    restaurant.rating = rating,
    restaurant.description = description
    
    // NEW IMAGE UPLOAD
    if (req.file) {
      const restaurantId = restaurant._id

      // REMOVE OLD IMAGE IF EXISTS
      Image.findOne({ restaurantId }).then(image => {
        if (image) return image.remove()
      })
      
      return Promise.all([
        Image.create({ content: req.file.buffer, restaurantId }).then(image => {
          restaurant.image = `/uploads/${image._id}`
          restaurant.save()
        })
      ])
    }

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