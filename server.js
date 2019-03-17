const express 		= require('express');
const logger 	    = require('morgan');
const bodyParser 	= require('body-parser');
const passport      = require('passport');
const pe            = require('parse-error');
const cors          = require('cors');
const compression   = require('compression');

// Express and PORT
const app   = express();
const port = process.env.PORT || 3000;

// Declare DB config and connect to Sequelize
const DATABASE = require('./config/database');
const models = require('./models');

models.sequelize.authenticate().then(() => {
    console.log('Connected to SQL database:', DATABASE.db_name);
})
.catch(err => {
    console.error('Unable to connect to SQL database:',DATABASE.db_name, err);
});

if(DATABASE.app==='dev'){
    // models.sequelize.sync(); //creates table if they do not already exist
    models.sequelize.sync({ force: true }); //deletes all tables then recreates them useful for testing and development purposes
}

// Register Routes
const v1    =   require('./routes/v1');

// ***************************************************
// MIDDLEWARE - MORGAN, BODYPARSER, CORS, COMPRESSION
// ***************************************************
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(compression());

//Passport
require('./config/passport')(passport)
app.use(passport.initialize());
app.use(passport.session());

// ******************************************
// ROUTES
// ******************************************
app.use('/api/v1', v1);


// ******************************************
// SERVER BASIC ROUTES
// ******************************************

app.use('/', function(req, res){
	res.statusCode = 200;//send the appropriate status code
	res.json({status:"success", message:"Yapsody API", data:{}})
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error => {
    console.error('Uncaught Error', pe(error));
});

// ******************************************
// SERVER START
// ******************************************
app.listen(port, () => console.log(`Server started on port ${port}`));