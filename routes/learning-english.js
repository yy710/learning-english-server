let express = require('express');
let router = express.Router();
let multer = require('multer');
let upload = multer({dest: '../uploads/'});
let fs = require('fs');
let soe = require("../soe.js");
const session = require('wafer-node-session');
let MongoDBStore = require('../mongodb-ssesion.js')(session);
const weappConfig = require('../ssl/config.js').learningEnglish;
//console.log(weappConfig);

router.use('/', (req, res, next) => {
    //console.log("ok!", req.data);
    //res.json({errmsg: "ok!"});
    next();
});
//router.use(express.static('../public'));
router.use(function (req, res, next) {
    /*
    session({
        // 小程序 appId
        appId: weappConfig.appId,
        // 小程序 appSecret
        appSecret: weappConfig.appSecret,
        // 登录地址
        loginPath: '/login',
        // 会话存储
        store: new MongoDBStore({db: req.data.db, collection: 'learning_english_sessions'})
    })(req, res, next);
    */
});

router.get('/login', (req, res, next)=>{
    res.json({msg: "ok!"});
});


/**
 * send audio that upload to tencent for soe
 */
router.post('/upload', upload.single('record'), function (req, res, next) {
    //debug
    console.log("req.file: ", req.file);
    console.log("req.body: ", req.body);

    fs.readFile(req.file.path, (err, data) => {
        if (err) {
            throw err;
        } else {
            let buf = Buffer.from(data);
            let base64 = buf.toString('base64');

            soe("“Help! A monster!” said Annie.“Yeah, sure,” said Jack. “A real monster in Frog Creek, Pennsylvania.”", base64)
                .then(r => res.json(r))
                .catch(log);

            /**
             * write base64 to the file 'voice.txt'
             */
            /*
            fs.writeFile(req.file.destination + 'voice.txt', base64, err => {
                if (err) throw err;
            });
            */
        }
    });
});

function log(data) {
    console.log(data);
    return Promise.resolve(data);
}

module.exports = router;