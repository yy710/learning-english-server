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
        (req, res, next) => {
            //console.log("req.body: ", req.body);
            let refText = sentence.getFromId(req.body.sentenceId).text;
            req.data.refText = punctuation(refText[0]);
            //console.log("req.data: ", req.data);
            next();
        },
        audio.evaluation2(),
        audio.saveToDb(),
        audio.reply()
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

function punctuation(str) {
    return str.replace(/[\ |\~|\“|\”|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, " ")//替换所有标点为空格
        .replace(/\s+/g, ' ')//合并多个空格
        .trim();//去除头尾空格
}