const fs = require('fs');
const soe = require("../soe.js");
const Session = require("../session.js");
const session = new Session();
const Audio = require('../audio.js');
const audio = new Audio();
const Sentence = require('../sentence');
const sentence = new Sentence();
const User = require('../user.js');

module.exports = function (express) {
    const router = express.Router();
    router.use(express.static('../public'));
    router.use(session.init('learningEnglish'));
    router.use(session.find());
    router.use(function (req, res, next) {
        let user = new User(req.data.session);
        req.data.user = user;
        next();
    });

    router.get('/', (req, res, next) => {
        res.json({msg: "request ok!"});
        //res.render('learning-english', {title: '学英语的鱼'});
    });
    router.get('/login', session.login(), session.save(), session.replySid());
    router.post('/upload', session.haveSession(), audio.upload(), audio.saveToFile());
    router.get('/get-sentence', (req, res, next) => {
        let data = sentence.getTitle().getNext(3, 2);
        //console.log("data: ", data);
        res.json(data);
    });

    return router;
};

function log(msg) {
    return function (data) {
        console.log(msg, data);
        return Promise.resolve(data);
    };
}