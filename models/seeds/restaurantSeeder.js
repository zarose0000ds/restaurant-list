const bcrypt = require('bcrypt')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant.js')
const User = require('../user')
const restaurant = require('../restaurant.json').results
const db = require('../../config/mongoose')

const REST_PER_USER = 3
const SEED_USER = [
  {
    name: 'User1',
    email: 'user1@example.com',
    password: '12345678',
    restaurant: [1, 2, 3]
  },
  {
    name: 'User2',
    email: 'user2@example.com',
    password: '12345678',
    restaurant: [4, 5, 6]
  }
]

db.once('open', () => {
  SEED_USER.forEach((item, id) => {
    const restId = item.restaurant

    bcrypt.genSalt(10).then(salt => bcrypt.hash(item.password, salt)).then(hash => User.create({
      name: item.name,
      email: item.email,
      password: hash
    })).then(user => {
      const userId = user._id

      return Promise.all(Array.from(
        { length: REST_PER_USER },
        (_, i) => Restaurant.create({
          name: restaurant[restId[i] - 1].name,
          name_en: restaurant[restId[i] - 1].name_en,
          category: restaurant[restId[i] - 1].category,
          image: restaurant[restId[i] - 1].image,
          location: restaurant[restId[i] - 1].location,
          phone: restaurant[restId[i] - 1].phone,
          google_map: restaurant[restId[i] - 1].google_map,
          rating: restaurant[restId[i] - 1].rating,
          description: restaurant[restId[i] - 1].description,
          userId
        })
      ))
    }).then(() => {
      if (id === SEED_USER.length - 1) {
        console.log('done')
        process.exit()
      }
    })
  })
})