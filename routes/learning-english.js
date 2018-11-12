let multer = require('multer');
let upload = multer({dest: '../uploads/'});
let fs = require('fs');
let soe = require("../soe.js");
const session = require('../session.js');
const config = require('../ssl/config.js');
//const session = require('wafer-node-session');
//let MongoDBStore = require('../mongodb-ssesion.js')(session);
//const weappConfig = require('../ssl/config.js').learningEnglish;
//console.log(weappConfig);


module.exports = function(express) {
    const router = express.Router();

    router.use(express.static('../public'));

    router.use(function (req, res, next) {
        console.log("req.get('sid'): ", req.get('sid'));
        next();
    });

    router.get('/', (req, res, next) => {
        console.log("router / ", req.query);
        res.json({errmsg: "ok!"});
    });

    /*
    router.use(function (req, res, next) {
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
    });
    */

    router.get(
        '/login',
        session.code2Session(config.learningEnglish.appId, config.learningEnglish.appSecret),
        session.save,
        session.reply
    );


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

                soe("Help A monster said Annie Yeah sure said Jack A real monster in Frog Creek Pennsylvania", base64)
                    .then(data => res.json(data))
                    .catch(log("catch soe error: "));

                /**
                 * write base64 to the file 'voice.txt'
                 */
                /*-------------------------------------------------------------------
                fs.writeFile(req.file.destination + 'voice.txt', base64, err => {
                    if (err) throw err;
                    res.json({errmsg: 'upload ok!'});
                });
                --------------------------------------------------------------------*/
            }
        });
    });

    return router;
};

function log(msg) {
    return function (data) {
        console.log(msg, data);
        return Promise.resolve(data);
    };
}