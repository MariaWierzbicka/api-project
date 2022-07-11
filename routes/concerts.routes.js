const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const db = require('../db');

router.route('/concerts').get((req, res) => {
  res.json(db.concerts);
});

router.route('/concerts/:id').get((req, res) => {
  const id = req.params.id;
  const item = db.concerts.find(i => i.id.toString() === id);
  res.json(item);
})

router.route('/concerts').post((req, res) => {
  const { id, performer, genre, price, day, image } = req.body;

  newConcert = {
    id: uuidv4(),
    performer: req.body.performer, 
    genre: req.body.genre,
    price: req.body.price,
    day: req.body.day,
    image: req.body.image
  };

  db.concerts.push(newConcert);
  res.json({message: 'OK'});
});

router.route('/concerts/:id').delete((req, res) => {
  const id = req.params.id;
  const index = db.concerts.findIndex(i => i.id.toString() === id);
  db.concerts.splice(index, 1);
  res.json({ message: 'OK' });
});

router.route('/concerts/:id').put((req, res) => {
  const id = req.params.id;
  const index = db.concerts.findIndex(i => i.id.toString() === id);
  const itemId = db.concerts[index].id;
  db.concerts[index] = {
    id: itemId,
    performer: req.body.performer, 
    genre: req.body.genre,
    price: req.body.price,
    day: req.body.day,
    image: req.body.image
  };
  res.json({ message: 'OK' });
});

module.exports = router;