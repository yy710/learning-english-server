let express = require('express');
let router = express.Router();
let multer = require('multer');
let upload = multer({dest: '../uploads/'});
let fs = require('fs');

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
            fs.writeFile(req.file.destination + 'voice.txt', base64, err => {
                if (err) throw err;
            });
        }
    });

    res.json({test: 'ok!'});
});

module.exports = router;