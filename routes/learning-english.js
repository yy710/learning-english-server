const fs = require('fs');
const soe = require("../soe.js");
const Session = require("../session.js");
const session = new Session();
const Audio = require('../audio.js');
const audio = new Audio();
const Sentence = require('../sentence');
const sentence = new Sentence();
const user = require('../user.js');

module.exports = function (express) {
    const router = express.Router();
    router.use(express.static('../public'));
    router.use(session.init('learningEnglish'));
    router.use(session.find());
    router.use(user.getUser());
    router.use(function (req, res, next) {
        //console.log("req.data", req.data);
        next();
    });

    router.get('/', (req, res, next) => {
        res.json({msg: "request ok!"});
        //res.render('learning-english', {title: '学英语的鱼'});
    });

    router.get('/login', session.login(), session.save(), session.replySid());

    router.post('/upload', session.haveSession(), audio.upload(), audio.saveToFile());

    router.get('/get-latest-sentence', (req, res, next) => {
        let data = { sentence: sentence.getTitle().getLatest(), next: false, previous: true };
        //console.log("data: ", data);
        res.json(data);
    });

    router.get('/get-previous-sentence', (req, res, next) => {
        const id = req.query.id;
        let data = { sentence: sentence.getTitle().getPrevious(id, 1), next: true, previous: true };
        console.log("id: ", id);
        res.json(data);
    });

    router.get('/get-next-sentence', (req, res, next) => {
        const id = req.query.id;
        let data = { sentence: sentence.getTitle().getNext(id,1), next: false, previous: true };
        console.log("id: ", id);
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