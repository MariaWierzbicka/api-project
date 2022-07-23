const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

router.route('/seats').get((req, res) => {
  res.json(db.seats);
});

router.route('/seats/:id').get((req, res) => {
  const id = req.params.id;
  const item = db.seats.find(i => i.id.toString() === id);
  res.json(item);
})

router.route('/seats').post((req, res) => {
  const { id, day, seat, client, email } = req.body;
  
  const seatTaken = db.seats.some(slot => slot.day === req.body.day && slot.seat === req.body.seat)

  if(seatTaken){
    res.status(400).json({ message: "The slot is already taken..." });
  } else {
    newSeat = {
      id: uuidv4(),
      day: req.body.day, 
      seat: req.body.seat,
      client: req.body.client,
      email: req.body.email
    };

    db.seats.push(newSeat);
    req.io.emit('seatsUpdated', db.seats);

    res.json({message: 'OK'});
  }
});

router.route('/seats/:id').delete((req, res) => {
  const id = req.params.id;
  const index = db.seats.findIndex(i => i.id.toString() === id);
  db.seats.splice(index, 1);
  res.json({ message: 'OK' });
});

router.route('/seats/:id').put((req, res) => {
  const id = req.params.id;
  const index = db.seats.findIndex(i => i.id.toString() === id);
  const itemId = db.seats[index].id;
  db.seats[index] = {
    id: itemId,
    day: req.body.day, 
    seat: req.body.seat,
    client: req.body.client,
    email: req.body.email
  };
  res.json({ message: 'OK' });
});

module.exports = router;