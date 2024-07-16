const mongoose = require('mongoose');

const tiketSchema = new mongoose.Schema({
  event: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Events'},
  user: {type:mongoose.Schema.Types.ObjectId, required:true},
  name: {type:String, required:true},
  qty : {type:Number, required: true},
  phone: {type:String, required:true},
  price: Number,
});

const TiketModel = mongoose.model('Tiket', tiketSchema);

module.exports = TiketModel;