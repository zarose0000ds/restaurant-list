const bcrypt = require('bcrypt')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant.js')
const User = require('../user')
const restaurant = require('../restaurant.json').results
const db = require('../../config/mongoose')

const SEED_USER = [
  {
    name: 'User1',
    email: 'user1@example.com',
    password: '12345678',
    restaurantId: [1, 2, 3]
  },
  {
    name: 'User2',
    email: 'user2@example.com',
    password: '12345678',
    restaurantId: [4, 5, 6]
  }
]

db.once('open', () => {
  Promise.all(Array.from(SEED_USER, seedUser => {
    const restaurantId = seedUser.restaurantId

    return bcrypt.genSalt(10).then(salt => bcrypt.hash(seedUser.password, salt)).then(hash => User.create({
      name: seedUser.name,
      email: seedUser.email,
      password: hash
    })).then(user => {
      const userId = user._id
      const restaurants = []

      restaurantId.forEach(id => {
        restaurant[id - 1].userId = userId
        restaurants.push(restaurant[id - 1])
      })

      return Restaurant.create(restaurants)
    })
  })).then(() => {
    console.log('done')
    process.exit()
  }).catch(e => console.log(e))
})