let express = require('express');
let router = express.Router();
let multer = require('multer');
let upload = multer({dest: '../uploads/'});
let fs = require('fs');
let soe = require("../soe.js");

router.use(express.static('../public'));

/* GET home page. */
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

            soe("Dinosaurs Before Dark", base64)
                .then(r => res.json(r))
                .catch(log);

            /**
             * test
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
    Promise.resolve(data);
}

module.exports = router;