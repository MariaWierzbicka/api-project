const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const db = [
  { id: 1, author: 'John Doe', text: 'This company is worth every coin!' },
  { id: 2, author: 'Amanda Doe', text: 'They really know how to make you happy.' },
];


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/testimonials', (req, res) => {
  res.send(db);
});

app.get('/testimonials/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * db.length);
  res.send(db[randomIndex]);

});

app.get('/testimonials/:id', (req, res) => {
  const id = req.params.id;
  const item = db.find(i => i.id.toString() === id)
  res.send(item);
});

app.post('/testimonials', (req, res) => {
  const { author, text, id } = req.body;
  
  newTestimonial = {
    id: uuidv4(),
    author: req.body.author, 
    text: req.body.text
  };

  db.push(newTestimonial);
  res.send({message: 'OK'});
});

app.delete('/testimonials/:id', (req, res) => {
  const id = req.params.id;
  const index = db.findIndex(i => i.id.toString() === id);
  db.splice(index, 1);
  res.send({ message: 'OK' });
});

app.put('/testimonials/:id', (req, res) => {
  const id = req.params.id;
  const index = db.findIndex(i => i.id.toString() === id);
  db[index] = {
    id: db[index].id,
    author: req.body.author, 
    text: req.body.text
  };
  res.send({ message: 'OK' });
});

app.use((req, res) => {
  res.status(404).send({message: '404 not found...'});
})
