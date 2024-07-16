const mongoose = require('mongoose');

const transaksiSchema = new mongoose.Schema({
  user: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
  orderId: String,
  name: String,
  qty: Number,
  phone: String,
  price: Number,
  total: Number,
  status: String,
  snap_token: String,
  payment_method: String,
  event: {type:mongoose.Schema.Types.ObjectId, ref:'Events'},
});

const TransaksiModel = mongoose.model('Transaksi',transaksiSchema);

module.exports = TransaksiModel;