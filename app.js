let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let learningEnglishRouter = require('./routes/learning-english.js');
let indexRouter = require('./routes/index.js');
let usersRouter = require('./routes/users.js');
let app = express();
var mongodb = require('mongodb');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/learning-english', learningEnglishRouter);

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
 * @returns {Function}
 */
function initDb(dbUrl) {
    return function (req, res, next) {
        mongodb.MongoClient.connect(dbUrl, function (error, client) {
            if (error) {
                let e = new Error('Error connecting to db: ' + error.message);
                throw e;
            }
            req.db = client.db;//deprecated
            req.data.db = req.db;//approve
            next();
        });

        /**
         * old middware
         */
        /*
        MongoClient.connect(dbUrl, function (err, db) {
            assert.equal(null, err);
            req.db = db;//deprecated
            req.data.db = db;//approve
            next();
        });
        */
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
