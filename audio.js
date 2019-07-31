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

    evaluation2(text) {
        return (req, res, next) => {
            this.audio2base64(req.file.path)
                .then(data => {
                    return soe(text, data);
                })
                //.then(log("soe return: "))
                .then(this.words2rate)
                .then(log("resData: "))
                .then(data => res.json(data))
                .catch(log("catch soe error: "));
        };
    }

    words2rate(data = {}) {
        if (!data) return Promise.reject();
        const rate = data.Words.map(function (item) {
            return [item.Word, item.PronAccuracy];
        });
        const resData = {
            msg: 'upload ok!',
            code: 1,
            pronAccuracy: data.PronAccuracy,
            pronFluency: data.PronFluency,
            pronCompletion: data.PronCompletion,
            rate: rate,
            next: data.PronAccuracy > 79 && data.PronFluency > 0.69 && data.PronCompletion > 0.89
        };
        return Promise.resolve(resData);
    }

    reply(data){

    }

    /**
     * write base64 to the file 'voice.txt'
     */
    saveToFile() {
        return (req, res, next) => {
            this.audio2base64(req.file.path).then(data => {
                fs.writeFile(req.file.destination + 'voice.txt', data, err => {
                    if (err) throw err;
                    res.json({
                        msg: 'upload ok!',
                        code: 1,
                        rate: [["Once", 95], ["time", 30], ["sort", 70]],
                        next: true
                    });
                });
            });
        };
    }

}

module.exports = Audio;


function log(msg) {
    return function (data) {
        console.log(msg, JSON.stringify(data, null, 4));
        return Promise.resolve(data);
    };
}