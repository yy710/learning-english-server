let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let indexRouter = require('./routes/index.js');
let usersRouter = require('./routes/users.js');
let app = express();
const config = require('./ssl/config.js');
const MongoClient = require('mongodb').MongoClient;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    req.data = {};
    req.data.session = {};
    req.data.config = config;
    //console.log("req.query: ", req.query);
    //req.data.query = JSON.parse(req.query);
    //console.log("req.data.query: ", req.data.query);
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

const learningEnglishRouter = require('./routes/learning-english.js');
app.use(
    '/learning-english',
    initDb(config.learningEnglish.dbUrl),
    learningEnglishRouter(express)
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


/**
 * middleware for mongodb
 * @param dbUrl
 * @returns {Function} req.data.db
 */
function initDb(dbUrl) {
    return function (req, res, next) {
        // static method
        MongoClient.connect(dbUrl, function (error, client) {
            if (error) {
                let e = new Error('Error connecting to db: ' + error.message);
                throw e;
            }
            //if (!req.data) req.data = {};
            req.data.db = client.db("learning_english");
            next();
        });
    };
}

function handleError(error, callback) {
    if (this._emitter.listeners('error').length) {
        this._emitter.emit('error', error);
    }

    if (callback) {
        callback(error);
    }

    if (!this._emitter.listeners('error').length && !callback) {
        throw error;
    }
}

function mergeOptions(options, defaults) {
    for (var key in defaults) {
        options[key] = options[key] || defaults[key];
    }
}

module.exports = app;
