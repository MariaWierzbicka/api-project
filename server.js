const express = require('express');
const cors = require('cors');
const path = require('path');
const socket = require('socket.io');
const mongoose = require('mongoose');

const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

const app = express();

app.use(express.static(path.join(__dirname, '/client/build')));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {	
  req.io = io;	
  next();	
});

app.use('/api', testimonialsRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

mongoose.connect('mongodb+srv://m-01:VZ0h8vPfGSX8qIhY@cluster0.uyu87.mongodb.net/?retryWrites=true&w=majority', {dbName: "NewWaveDB", useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', err => console.log('Error ' + err));

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
}); 

const io = socket(server);

io.on('connection', (socket) => {
  console.log('new socket', socket.id);
});

app.use((req, res) => {
  res.status(404).json({message: '404 not found...'});
});
