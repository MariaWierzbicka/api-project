const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const db = require('../db');

router.route('/testimonials').get((req, res) => {
  res.json(db.testimonials);
});

router.route('/testimonials/random').get((req, res) => {
  const randomIndex = Math.floor(Math.random() * db.testimonials.length);
  res.json(db.testimonials[randomIndex]);
});

router.route('/testimonials/:id').get((req, res) => {
  const id = req.params.id;
  const item = db.testimonials.find(i => i.id.toString() === id);
  res.json(item);
})

router.route('/testimonials').post((req, res) => {
  const { author, text, id } = req.body;
  
  newTestimonial = {
    id: uuidv4(),
    author: req.body.author, 
    text: req.body.text
  };

  db.testimonials.push(newTestimonial);
  res.json({message: 'OK'});
});

router.route('/testimonials/:id').delete((req, res) => {
  const id = req.params.id;
  const index = db.testimonials.findIndex(i => i.id.toString() === id);
  db.testimonials.splice(index, 1);
  res.json({ message: 'OK' });
});

router.route('/testimonials/:id').put((req, res) => {
  const id = req.params.id;
  const index = db.testimonials.findIndex(i => i.id.toString() === id);
  const itemId = db.testimonials[index].id;
  db.testimonials[index] = {
    id: itemId,
    author: req.body.author, 
    text: req.body.text
  };
  res.json({ message: 'OK' });
})

module.exports = router;