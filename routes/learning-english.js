let express = require('express');
let router = express.Router();
let multer  = require('multer');
let upload = multer({ dest: '../uploads/' });

/* GET home page. */
router.post('/upload', upload.single('record'), function(req, res, next) {
    //debug
    //console.log(req.file);
    console.log(req.body);
    res.json({test: 'ok!'});
});

module.exports = router;