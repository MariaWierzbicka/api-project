const express = require('express');
const cors = require('cors');
const path = require('path');
const socket = require('socket.io');
const mongoose = require('mongoose');
const helmet = require('helmet');


const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

const app = express();

app.use(express.static(path.join(__dirname, '/client/build')));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());

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

const NODE_ENV = process.env.NODE_ENV;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
let dbUri = '';
// if(NODE_ENV === 'production') dbUri = 'url to remote db';
// else if
if(NODE_ENV === 'test') dbUri = 'mongodb://localhost:27017/NewWaveDBtest';
else dbUri = 'mongodb+srv://' + DB_USER + ':' + DB_PASS + '@cluster0.uyu87.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect( dbUri, {dbName: "NewWaveDB", useNewUrlParser: true, useUnifiedTopology: true });
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
