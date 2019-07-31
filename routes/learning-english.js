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

    router.post('/upload',
        session.haveSession(),
        audio.upload(),
        audio.evaluation2("Once upon a time there was a lovely princess But she had an enchantment upon her of a fearful sort"),
        audio.saveToFile()
        );

    router.get('/get-latest-sentence', (req, res, next) => {
        const id = 0;
        let s = sentence.getTitle().getLatest();
        let data = {sentence: s, next: !!s.nextId, previous: !!s.previousId};
        console.log("id: ", id);
        res.json(data);
    });

    router.get('/get-previous-sentence', (req, res, next) => {
        const id = req.query.id;
        //debug
        console.log("req id = ", id);
        let s = sentence.getTitle().getPrevious(id);
        //debug
        console.log("get id = ", s.id);
        let data = {sentence: s, next: !!s.nextId, previous: !!s.previousId};
        res.json(data);
    });

    router.get('/get-next-sentence', (req, res, next) => {
        const id = req.query.id;
        //debug
        console.log("req id = ", id);
        let s = sentence.getTitle().getNext(id);
        //debug
        console.log("get id = ", s.id);
        let data = {sentence: s, next: !!s.nextId, previous: !!s.previousId};
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