const express = require('express');
const morgan = require('morgan');

const app = express();

const bloggerRouter = require('./bloggerRouter');

// log the http layer
app.use(morgan('common'));


//DO need to set up css and client js
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
  });

app.use('/blogger', bloggerRouter);

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
  });
  



