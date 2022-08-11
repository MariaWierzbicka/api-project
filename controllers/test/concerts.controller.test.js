const Concert = require('../../models/concert.model');
const Seat = require('../../models/seat.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Concert', () => {

  before(async () => {

    try {
      await mongoose.connect('mongodb://localhost:27017/NewWaveDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err) {
      console.error(err);
    }

  });
  
  after(async () => {
    await Concert.deleteMany();
  });

  describe('Reading data', () => {

    beforeEach( async () => {
      const testConOne = new Concert({ _id: '62eb91508a81e0e99af110c2', performer: 'John Doe', genre: 'Rock', price: 15, day: 1 });
      await testConOne.save();
  
      const testConTwo = new Concert({ _id: '62eb91508a81e0e99af110c3', performer: 'Amanda Smith', genre: 'Pop', price: 25, day: 2 });
      await testConTwo.save();
      
      const testSeatOne = new Seat({ _id: '62eb91508a81e0e99af110c4', day: 1, seat: 8, client: 'John Watson', email: 'jwatson@example.com'});
      await testSeatOne.save();
      
      const testSeatTwo = new Seat({ _id: '62eb91bd70387413904ac289', day: 2, seat: 18, client: 'Willy Wonka', email: 'wwonka@example.com'});
      await testSeatTwo.save();

      const testSeatThree = new Seat({ _id: '62eb91bd70387413904ac288', day: 2, seat: 28, client: 'Don Pedro', email: 'dpedro@example.com'});
      await testSeatThree.save();
    });

    afterEach(async () => {
      await Concert.deleteMany();
      await Seat.deleteMany();
    });

    it('should return all the concerts data with find method', async () => {
      const concerts = await Concert.find();
      const expectedLength = 2;
      expect(concerts.length).to.be.equal(expectedLength);
    });

    it('should return all the seats for the chosen day', async () => {
      const con = await Concert.findOne({ day: 2 });
      const seats = await Seat.find({ day: con.day });
      expect(seats.length).to.be.equal(2);
    });

    it('should update concert with tickets data', async () => {
      const con = await Concert.findOne({ day: 2 });
      const seats = await Seat.find({ day: con.day });
      const freeSeats = 50 - seats.length;

      await Concert.updateOne({ _id: con._id }, { $set: { tickets: freeSeats }});
      const updatedCon = await Concert.findOne({ _id: con._id });

      expect(seats.length).to.be.equal(2);
      expect(updatedCon.tickets).to.be.equal(48);

    });
  });
});
