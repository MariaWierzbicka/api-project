const Seat = require('../models/seat.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Seat.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const slot = await Seat.findById(req.params.id);
    if(slot) res.json(slot)
    else res.status(404).json({ message: 'Not found...'})
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};
exports.postSeat = async (req, res) => {

  try{
    const { day, seat, client, email } = req.body;
  
    const seatTaken = await Seat.findOne({day: req.body.day, seat: req.body.seat});
    if(seatTaken){
      res.status(400).json({ message: "The slot is already taken..." });
    } else {
      const newSeat = new Seat({
        day: day, 
        seat: seat,
        client: client,
        email: email
      });

      await newSeat.save();
      req.io.emit('seatsUpdated', await Seat.find());
      res.json({ message: 'OK'});
    }
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.putSeat = async(req, res) => {
  const { day, seat, client, email } = req.body 
  
  try {
    const slot = await Seat.findById(req.params.id);
    if(slot){
      await Seat.updateOne({ _id: req.params.id }, {$set: {
        day: day,
        seat: seat,
        client: client,
        email: email
      }});
      res.json(slot);
    } else res.status(404).json({ message: 'Not found...'})
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteSeat = async (req, res) => {
  try {
    const slot = await Seat.findById(req.params.id)
    if(slot) {
      await Seat.deleteOne({_id: req.params.id})
      res.json(slot);
    } else res.status(404).json({ message: 'Not found...'})

  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};