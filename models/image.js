const mongoose = require('mongoose')
const Schema = mongoose.Schema
const imageSchema = new Schema({
  content: {
    type: Buffer,
    require: true
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    index: true
  }
})

module.exports = mongoose.model('Image', imageSchema)