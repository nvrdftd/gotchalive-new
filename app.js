var express = require('express');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var config = require('./config');
var app = express();


// set template engine
app.set('view engine', 'ejs');

//security protection
app.use(helmet());

// parse requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files
app.use(express.static('assets'));

// index route
app.use('/', require('./routes/index'));

// api route
app.use('/api', require('./routes/api/videos'));

// port listening
app.listen(config.port, function(){
  console.log('Server is running on port', this.address().port);
});
