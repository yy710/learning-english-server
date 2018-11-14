const multer = require('multer');
const upload = multer({dest: '../uploads/'});
const fs = require('fs');
const soe = require("../soe.js");
const Session = require("../session.js");
const session = new Session();

module.exports = function (express) {
    const router = express.Router();
    router.use(express.static('../public'));
    router.use(session.init('learningEnglish'));
    router.use(session.find());
    router.get('/', (req, res, next) => {
        res.json({msg: "request ok!"});
        //res.render('learning-english', {title: '学英语的鱼'});
    });
    router.get('/login', session.login(), session.save(), session.replySid());
    /**
     * send audio that upload to tencent for soe
     */
    router.post('/upload',
        session.haveSession(),
        upload.single('record'),
        function (req, res, next) {
            //debug
            console.log("req.file: ", req.file);
            console.log("req.body: ", req.body);

            fs.readFile(req.file.path, (err, data) => {
                if (err) {
                    throw err;
                } else {
                    let buf = Buffer.from(data);
                    let base64 = buf.toString('base64');

                    /*
                    soe("Help A monster said Annie Yeah sure said Jack A real monster in Frog Creek Pennsylvania", base64)
                        .then(data => res.json(data))
                        .catch(log("catch soe error: "));
                        */

                    /**
                     * write base64 to the file 'voice.txt'
                     */
                    //-------------------------------------------------------------------
                    fs.writeFile(req.file.destination + 'voice.txt', base64, err => {
                        if (err) throw err;
                        res.json({msg: 'upload ok!', code: 1});
                    });
                    //--------------------------------------------------------------------
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