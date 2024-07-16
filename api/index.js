const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Event = require('./models/Event.js');
const Tiket = require('./models/Tiket.js');
const Transaksi = require('./models/Transaksi.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const multer = require('multer');
const fs = require('fs');
const mime = require('mime-types');
const uploadRequire = require('./config/multer.js');
const path = require('path');
const midtransClient = require('midtrans-client');

require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';
const bucket = 'dawid-booking-app';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use('/pdf', express.static(path.join(__dirname, 'uploads/pdf')));
app.use(cors({
  credentials: true,
  origin: ['http://localhost:5173','http://localhost:3000'],
}));


function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get('/test', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json('test ok');
});

app.post('/register', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {name,email,password} = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password:bcrypt.hashSync(password, bcryptSalt),
      role: 2
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }

});

app.post('/register-admin', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {name,email,password,role} = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password:bcrypt.hashSync(password, bcryptSalt),
      role
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }

});

app.post('/login', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id,
        role: userDoc.role
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie("token", token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});

app.get('/profile', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id} = await User.findById(userData.id);
      res.json({name,email,_id});
    });
  } else {
    res.json(null);
  }
});

app.post('/logout', (req,res) => {
  res.cookie('token', '').json(true);
});


app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".png";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({dest: "uploads/"});
app.post("/upload", photosMiddleware.array('photos', 100), (req, res) => {
  const uploadedFiles = [];
  for(let i = 0; i < req.files.length; i++){
    const {path,originalname} = req.files[i];
    console.log(path);
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath);
  }
  res.json(uploadedFiles);
  console.log(uploadedFiles);
});

app.post('/events',uploadRequire.single('requirement'), (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    title,address,addedPhotos,description,price,
    perks,extraInfo,date,maxGuests,
  } = req.body;
  const requirementPath = req.file ? req.file.path.replace(/\\/g, '/') : null;
  console.log('FIle', requirementPath);
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const approveEvent = 0;
    const placeDoc = await Event.create({
      owner:userData.id,price,
      title,address,photos:addedPhotos,description,
      perks,extraInfo,date,maxGuests,approve:approveEvent,
      requirement: requirementPath,
    });
    res.json(placeDoc);
  });
});

app.get('/user-events', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json( await Event.find({owner:id}) );
  });
});

app.get('/events/:id', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
  res.json(await Event.findById(id));
});

app.put('/events', uploadRequire.single('requirement'), async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    id, title,address,addedPhotos,description,
    perks,extraInfo,date,maxGuests,price,
  } = req.body;
  const requirementPath = req.file ? req.file.path : null;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Event.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,address,photos:addedPhotos,description,
        perks,extraInfo,date,maxGuests,price,requirement: requirementPath,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get('/events', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json( await Event.find().populate('owner') );
});

app.get('/events/:id/pdf', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const { requirement } = event;
    if (!requirement) {
      return res.status(404).json({ message: 'PDF requirement not found for this event' });
    }
    const filePath = path.join(__dirname, requirement);
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.patch('/events/:id/approve', async (req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;
    const { token } = req.cookies;

    

    // Verifikasi token
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        throw new Error('Token tidak valid'); // Tanggapan jika token tidak valid
      }

      // Dapatkan event berdasarkan id
      const doc = await Event.findById(id);
      if (!doc) {
        throw new Error('Event tidak ditemukan'); // Tanggapan jika event tidak ditemukan
      }
      // Set approve menjadi 1 dan simpan
      doc.approve = 1;
      await doc.save();
      res.json('ok');
    });
  } catch (error) {
    res.status(401).json({ message: error.message }); // Tanggapan untuk kesalahan
  }
});

app.post('/tiket', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {
    event,name,qty,phone,price,
  } = req.body;
  Tiket.create({
    event,name,qty,phone,price,
    user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});



app.get('/tiket', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json( await Tiket.find({user:userData.id}).populate('event') );
});

app.post('/transaksi', async(req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {orderId,dateBuy,qty, name, phone, price, total,event} = req.body;
  try {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: "SB-Mid-server-JEqE8RGYJN5CYaYgWZXj8eYM",
        clientKey: "SB-Mid-client-xGLXMk4yPuvj0lJD"
      })
      if (err) {
        throw new Error('Token tidak valid'); // Tanggapan jika token tidak valid
      }

      // Dapatkan event berdasarkan id
      const doc = await Tiket.findOne({orderId});
      if (!doc) {
        throw new Error('Tiket tidak ditemukan'); // Tanggapan jika event tidak ditemukan
      }
      const paymentData = {
        transaction_details: {
          order_id : orderId,
          gross_amount : total
        },
        customer_details: {
          first_Name: name
        }
      }

      snap.createTransaction(paymentData).then((transaction) => {
        const dataPayment = {
          response: JSON.stringify(transaction)
        }
        const token = transaction.token
        Transaksi.create({
          orderId: orderId,
          dateBuy: dateBuy,
          qty: qty,
          total: total,
          price: price,
          phone: phone,
          status: "PENDING",
          payment_method: "Midtrans",
          snap_token: token,
          name: name,
          event: event,
          user: userData.id
        });

        res.status(200).json({message: "berhasil", dataPayment,token: token})
      });


      
    });
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

app.post('/verify-payment', async(req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { orderId, transactionStatus } = req.body;

  try {
    // Update the transaction status based on payment result
    const updatedTransaction = await Transaksi.findOneAndUpdate(
      { orderId: orderId },
      { status: transactionStatus === 'success' ? 'Payment Success' : 'Payment Failed' },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ message: "Transaction status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})
app.get('/transaksi', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json( await Transaksi.find({user:userData.id}).populate('event') );
});

app.get('/tickets', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json( await Transaksi.find({}).populate('event') );
});

app.listen(4000);