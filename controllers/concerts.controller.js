const Concert = require('../models/concert.model');
const Seat = require('../models/seat.model');

exports.getAll = async (req, res) => {
  try {
    const concerts = await Concert.find();
    for(let con of concerts){
      
      const matchingSeats = await Seat.find({ day: con.day });
      const tickets = 50 - matchingSeats.length;
      await Concert.updateOne({ _id: con._id}, { $set: { tickets: tickets }});
    }
    res.json(await Concert.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if(!concert) res.status(404).json({ message: 'Not found' });
    else res.json(concert);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.postConcert = async (req, res) => {
  const { performer, genre, price, day, image } = req.body;
  try {
    const newConcert = new Concert({
      performer: performer,
      genre: genre,
      price: price,
      day: day,
      image: image  
    });
    await newConcert.save();
    res.json({ message: 'OK' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.putConcert = async (req, res) => {
  const { performer, genre, price, day, image } = req.body;
  try {
    const concert = await Concert.findById(req.params.id);
    if(concert){
      await Concert.updateOne({_id: req.params.id}, {$set: {
        performer: performer,
        genre: genre,
        price: price,
        day: day,
        image: image
      }});
      res.json({ message: 'OK' });
    } else res.status(404).json({ message: 'Not found...'})
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteConcert = async (req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if(concert) {
      await Concert.deleteOne({_id: req.params.id})
      res.json({ message: 'OK' });
    } else res.status(404).json({ message: 'Not found...'})
  } 
  catch(err) {
    res.status(500).json({ message: err });
  }
};