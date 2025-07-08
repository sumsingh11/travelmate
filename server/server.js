// const express = require("express");
// const cors = require("cors");

// const app = express();
// app.use(express.json());
// app.use(cors());

// // Import Trip (Frontend sends a JSON file)
// app.post("/import", (req, res) => {
//     const tripData = req.body;
//     res.json({ success: true, trip: tripData });
// });

// // Export Trip (Frontend requests a JSON file)
// app.post("/export", (req, res) => {
//     const tripData = JSON.stringify(req.body, null, 2);
//     res.setHeader("Content-Disposition", "attachment; filename=trip.json");
//     res.setHeader("Content-Type", "application/json");
//     res.send(tripData);
// });

// app.get("/", (req, res) => {
//     res.send("TravelMate Backend is Running!");
// });

// // Start the server
// const PORT = 5003;
// app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`)); 


const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

require('./config/passport'); // Passport strategies

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Sessions for social login
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send('Travel Mate API Running!'));

const PORT = process.env.PORT || 5003;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('DB connection error:', err));
