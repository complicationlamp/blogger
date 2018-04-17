const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//do we need to make this an object?
const {Blogger} = require('./models');

Blogger.create('Blog post0','Nulla eligendi perferendis voluptas corporis iure reiciendis veritatis. Aut alias cumque enim minus. Soluta voluptatibus ea laudantium provident distinctio at cupiditate. Excepturi sed beatae sed. Culpa molestias omnis dolor quas corporis velit aut. Est dolor animi sed.');

router.get('/', (req, res) => {
    res.json(Blogger.get());
});

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = Blogger.create(req.body.title, req.body.content);
  res.status(201).json(item);
});

// Delete Blogger (by id)!
router.delete('/:id', (req, res) => {
    Blogger.delete(req.params.id);
    console.log(`Deleted blog item \`${req.params.ID}\``);
    res.status(204).end();
  });

  router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'id'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    if (req.params.id !== req.body.id) {
      const message = (
        `Request path id (${req.params.id}) and request body id `
        `(${req.body.id}) must match`);
      console.error(message);
      return res.status(400).send(message);
    }
    console.log(`Updating blog item \`${req.params.id}\``);
    const updatedItem = Blogger.update({
      id: req.params.id,
      title: req.body.title,
      content: req.body.content
    });
    res.status(204).end();
  })
  
  module.exports = router;