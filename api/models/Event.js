const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
  title: String,
  address: String,
  photos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  date: Date,
  maxGuests: Number,
  price: Number,
  approve: Number,
  requirement: String
});

const EventModel = mongoose.model('Events',eventSchema);

module.exports = EventModel;