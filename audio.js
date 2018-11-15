const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: '../uploads/'});
const soe = require('./soe.js');
const Sentence = require('./session.js');

class Audio {
    constructor() {
        this.openid = null;
        this.evaluation = null;
        this.setenceId = null;
    }

    upload() {
        return upload.single('record');
    }

    audio2base64(filePath) {
        return new Promise(function (resolve, reject) {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const buf = Buffer.from(data);
                    const base64 = buf.toString('base64');
                    resolve(base64);
                }
            })
        });
    }

    evaluation(text) {
        return (req, res, next) => {
            //debug
            console.log("req.file: ", req.file);
            console.log("req.body: ", req.body);

            this.audio2base64(req.file.path)
                .then(data => {
                    return soe("Help A monster said Annie Yeah sure said Jack A real monster in Frog Creek Pennsylvania", base64);
                })
                .then(data => res.json(data))
                .catch(log("catch soe error: "));
        };
    }

    /**
     * write base64 to the file 'voice.txt'
     */
    saveToFile() {
        return (req, res, next) => {
            this.audio2base64(req.file.path).then(data => {
                fs.writeFile(req.file.destination + 'voice.txt', data, err => {
                    if (err) throw err;
                    res.json({msg: 'upload ok!', code: 1});
                });
            });
        };
    }

}

module.exports = Audio;


function log(msg) {
    return function (data) {
        console.log(msg, data);
        return Promise.resolve(data);
    };
}