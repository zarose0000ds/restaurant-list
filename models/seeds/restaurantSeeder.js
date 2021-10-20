if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant.js')
const restaurant = require('../restaurant.json').results
const db = require('../../config/mongoose')

db.once('open', () => {
  restaurant.forEach(item => {
    const { name, name_en, category, image, location, phone, google_map, rating, description } = item

    Restaurant.create({
      name,
      name_en,
      category,
      image,
      location,
      phone,
      google_map,
      rating,
      description
    })
  })

  console.log('done')
})